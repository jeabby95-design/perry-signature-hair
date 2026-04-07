import { useEffect, useMemo, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Star, Upload, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import {
  createReview,
  deleteReview,
  getCompletedBookingsPendingReview,
  getReviewsByClient,
} from "../../firebase/firestore";
import type { Booking, Review } from "../../types/domain";

export default function ClientReviews() {
  const { user, profile } = useAuth();
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        return;
      }

      try {
        const [reviewsRows, pendingRows] = await Promise.all([
          getReviewsByClient(user.uid),
          getCompletedBookingsPendingReview(user.uid),
        ]);

        setMyReviews(reviewsRows);
        setCompletedBookings(pendingRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load reviews.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [user]);

  const selectedBookingData = useMemo(
    () => completedBookings.find((booking) => booking.id === selectedBooking),
    [completedBookings, selectedBooking],
  );

  async function handleSubmitReview() {
    if (!user || !profile) {
      toast.error("Please sign in to submit reviews.");
      return;
    }

    if (!selectedBookingData) {
      toast.error("Please select a completed booking.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please add a comment.");
      return;
    }

    try {
      const newReviewId = await createReview({
        bookingId: selectedBookingData.id,
        clientId: user.uid,
        clientName: profile.fullName,
        stylistId: selectedBookingData.stylistId,
        stylistName: selectedBookingData.stylistName,
        rating,
        comment: comment.trim(),
      });

      setMyReviews((previous) => [
        {
          id: newReviewId,
          bookingId: selectedBookingData.id,
          clientId: user.uid,
          clientName: profile.fullName,
          stylistId: selectedBookingData.stylistId,
          stylistName: selectedBookingData.stylistName,
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...previous,
      ]);

      setCompletedBookings((previous) =>
        previous.filter((booking) => booking.id !== selectedBookingData.id),
      );

      setSelectedBooking("");
      setRating(0);
      setComment("");
      toast.success("Review submitted successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit review.";
      toast.error(message);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    try {
      await deleteReview(reviewId);
      setMyReviews((previous) => previous.filter((review) => review.id !== reviewId));
      toast.success("Review deleted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete review.";
      toast.error(message);
    }
  }

  const averageRating = useMemo(() => {
    if (myReviews.length === 0) {
      return 0;
    }

    const total = myReviews.reduce((sum, review) => sum + review.rating, 0);
    return total / myReviews.length;
  }, [myReviews]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews & Ratings</h1>
        <p className="text-gray-600 mt-1">Share your experience and help others</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Leave a Review</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="booking">Select Booking</Label>
            <Select value={selectedBooking} onValueChange={setSelectedBooking}>
              <SelectTrigger id="booking">
                <SelectValue placeholder="Choose a completed booking" />
              </SelectTrigger>
              <SelectContent>
                {completedBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id}>
                    {booking.service} with {booking.stylistName || "Assigned stylist"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex items-center space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 font-medium text-gray-900">
                  {rating} {rating === 1 ? "star" : "stars"}
                </span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this service and stylist..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="photo">Upload Photo (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          <Button
            onClick={() => void handleSubmitReview()}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
          >
            Submit Review
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Reviews</h2>
        {loading ? (
          <Card className="p-6 text-gray-600">Loading reviews...</Card>
        ) : (
          <div className="space-y-4">
            {myReviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? "fill-amber-500 text-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">{review.rating}/5</span>
                    </div>
                    <p className="font-medium text-gray-900 mb-1">
                      Booking: {review.bookingId}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {myReviews.length === 0 && (
              <Card className="p-6 text-gray-600">No reviews yet.</Card>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-600">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{myReviews.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Average Rating</p>
          <div className="flex items-center mt-2">
            <p className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            <Star className="w-6 h-6 text-amber-500 fill-amber-500 ml-2" />
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600">Pending Reviews</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{completedBookings.length}</p>
        </Card>
      </div>
    </div>
  );
}
