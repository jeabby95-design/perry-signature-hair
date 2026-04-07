import { createBrowserRouter } from "react-router";
import LandingPage from "./pages/LandingPage.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import DashboardOverview from "./pages/admin/DashboardOverview.tsx";
import BookingRequests from "./pages/admin/BookingRequests.tsx";
import BookingDetail from "./pages/admin/BookingDetail.tsx";
import ConfirmedBookings from "./pages/admin/ConfirmedBookings.tsx";
import StylistsManagement from "./pages/admin/StylistsManagement.tsx";
import GalleryManagement from "./pages/admin/GalleryManagement.tsx";
import LoyaltyProgram from "./pages/admin/LoyaltyProgram.tsx";
import CalendarPage from "./pages/admin/CalendarPage.tsx";
import NotificationsPage from "./pages/admin/NotificationsPage.tsx";
import SettingsPage from "./pages/admin/SettingsPage.tsx";
import StaffLayout from "./layouts/StaffLayout.tsx";
import StaffDashboard from "./pages/staff/StaffDashboard.tsx";
import StaffBookings from "./pages/staff/StaffBookings.tsx";
import StaffBookingDetail from "./pages/staff/StaffBookingDetail.tsx";
import StaffAvailability from "./pages/staff/StaffAvailability.tsx";
import StaffNotifications from "./pages/staff/StaffNotifications.tsx";
import RequireRole from "./components/auth/RequireRole.tsx";
import AuthPage from "./pages/auth/AuthPage.tsx";
import StripeSuccess from "./pages/payment/StripeSuccess.tsx";
import ClientLayout from "./layouts/ClientLayout.tsx";
import ClientOverview from "./pages/client/ClientOverview.tsx";
import ClientBookings from "./pages/client/ClientBookings.tsx";
import ClientBookingDetail from "./pages/client/ClientBookingDetail.tsx";
import ClientLoyalty from "./pages/client/ClientLoyalty.tsx";
import ClientReviews from "./pages/client/ClientReviews.tsx";
import ClientSavedStyles from "./pages/client/ClientSavedStyles.tsx";
import ClientGallery from "./pages/client/ClientGallery.tsx";
import ClientNotifications from "./pages/client/ClientNotifications.tsx";
import ClientSettings from "./pages/client/ClientSettings.tsx";
import NotFound from "./pages/NotFound.tsx";

function AdminProtectedLayout() {
  return (
    <RequireRole role="admin">
      <AdminLayout />
    </RequireRole>
  );
}

function StaffProtectedLayout() {
  return (
    <RequireRole role="staff">
      <StaffLayout />
    </RequireRole>
  );
}

function ClientProtectedLayout() {
  return (
    <RequireRole role="client">
      <ClientLayout />
    </RequireRole>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/payment/success",
    Component: StripeSuccess,
  },
  {
    path: "/admin",
    Component: AdminProtectedLayout,
    children: [
      { index: true, Component: DashboardOverview },
      { path: "booking-requests", Component: BookingRequests },
      { path: "booking-requests/:id", Component: BookingDetail },
      { path: "confirmed-bookings", Component: ConfirmedBookings },
      { path: "stylists", Component: StylistsManagement },
      { path: "gallery", Component: GalleryManagement },
      { path: "loyalty", Component: LoyaltyProgram },
      { path: "calendar", Component: CalendarPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  {
    path: "/staff",
    Component: StaffProtectedLayout,
    children: [
      { index: true, Component: StaffDashboard },
      { path: "bookings", Component: StaffBookings },
      { path: "bookings/:id", Component: StaffBookingDetail },
      { path: "availability", Component: StaffAvailability },
      { path: "notifications", Component: StaffNotifications },
    ],
  },
  {
    path: "/client",
    Component: ClientProtectedLayout,
    children: [
      { index: true, Component: ClientOverview },
      { path: "bookings", Component: ClientBookings },
      { path: "bookings/:id", Component: ClientBookingDetail },
      { path: "loyalty", Component: ClientLoyalty },
      { path: "reviews", Component: ClientReviews },
      { path: "saved-styles", Component: ClientSavedStyles },
      { path: "gallery", Component: ClientGallery },
      { path: "notifications", Component: ClientNotifications },
      { path: "settings", Component: ClientSettings },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
