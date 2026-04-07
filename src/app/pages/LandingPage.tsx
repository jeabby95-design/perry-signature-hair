import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <BookingForm />
      <Footer />
    </div>
  );
}
