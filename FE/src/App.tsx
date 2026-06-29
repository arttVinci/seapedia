import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardShell } from "./components/dashboard/DashboardShell";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { GuestRoute } from "./components/auth/GuestRoute";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { StorePage } from "./pages/StorePage";
import { DashboardPage } from "./pages/DashboardPage";
import { BuyerDashboardPage } from "./pages/BuyerDashboardPage";
import CheckoutPage from "./pages/buyer/CheckoutPage";
import OrderHistoryPage from "./pages/buyer/OrderHistoryPage";
import OrderDetailPage from "./pages/buyer/OrderDetailPage";
import CartPage from "./pages/buyer/CartPage";
import WalletPage from "./pages/buyer/WalletPage";
import AddressPage from "./pages/buyer/AddressPage";
import { SellerDashboardPage } from "./pages/SellerDashboardPage";
import { ProductManagementPage } from "./pages/seller/ProductManagementPage";
import { StoreManagementPage } from "./pages/seller/StoreManagementPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerOrderDetailPage from "./pages/seller/SellerOrderDetailPage";
import SellerIncomePage from "./pages/seller/SellerIncomePage";
import { DriverDashboardPage } from "./pages/DriverDashboardPage";
import DriverJobsPage from "./pages/driver/DriverJobsPage";
import DriverJobDetailPage from "./pages/driver/DriverJobDetailPage";
import DriverActiveJobPage from "./pages/driver/DriverActiveJobPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import VoucherPage from "./pages/admin/VoucherPage";
import PromoPage from "./pages/admin/PromoPage";
import BuyerExpensePage from "./pages/buyer/BuyerExpensePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/stores/:id" element={<StorePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/reviews" element={<ReviewsPage />} />
          <Route path="/select-role" element={<RoleSelectionPage />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Buyer & Dashboard Routes wrapped in DashboardLayout so Navbar is visible but no Footer */}
          <Route element={<DashboardLayout />}>
            {/* Buyer Routes */}
            <Route path="/buyer" element={<BuyerDashboardPage />} />
            <Route path="/buyer/cart" element={<CartPage />} />
            <Route path="/buyer/checkout" element={<CheckoutPage />} />
            <Route path="/buyer/orders" element={<OrderHistoryPage />} />
            <Route path="/buyer/orders/:id" element={<OrderDetailPage />} />
            <Route path="/buyer/wallet" element={<WalletPage />} />
            <Route path="/buyer/addresses" element={<AddressPage />} />
            <Route path="/buyer/reports/expense" element={<BuyerExpensePage />} />

            {/* Seller, Driver, Admin Routes (With Sidebar) */}
            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Seller Routes */}
              <Route path="/seller" element={<SellerDashboardPage />} />
              <Route path="/seller/products" element={<ProductManagementPage />} />
              <Route path="/seller/store" element={<StoreManagementPage />} />
              <Route path="/seller/orders" element={<SellerOrdersPage />} />
              <Route path="/seller/orders/:id" element={<SellerOrderDetailPage />} />
              <Route path="/seller/reports/income" element={<SellerIncomePage />} />
              
              {/* Driver Routes */}
              <Route path="/driver" element={<DriverDashboardPage />} />
              <Route path="/driver/jobs" element={<DriverJobsPage />} />
              <Route path="/driver/jobs/:id" element={<DriverJobDetailPage />} />
              <Route path="/driver/active-job" element={<DriverActiveJobPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/vouchers" element={<VoucherPage />} />
              <Route path="/admin/promos" element={<PromoPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
