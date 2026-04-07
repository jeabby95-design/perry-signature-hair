import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { markBookingDepositPaid } from "../../firebase/firestore";

export default function StripeSuccess() {
  const [searchParams] = useSearchParams();
  const [updating, setUpdating] = useState(true);

  useEffect(() => {
    async function updateStatus() {
      const bookingId = searchParams.get("bookingId");
      const sessionId = searchParams.get("session_id") ?? undefined;

      if (!bookingId) {
        toast.error("Missing booking reference.");
        setUpdating(false);
        return;
      }

      try {
        await markBookingDepositPaid(bookingId, sessionId);
        toast.success("Deposit payment confirmed.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to verify payment.";
        toast.error(message);
      } finally {
        setUpdating(false);
      }
    }

    void updateStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Success</h1>
        <p className="text-gray-600 mb-6">
          {updating ? "Verifying your payment..." : "Your booking deposit has been recorded."}
        </p>
        <Link to="/client/bookings">
          <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
            Go To My Bookings
          </Button>
        </Link>
      </Card>
    </div>
  );
}
