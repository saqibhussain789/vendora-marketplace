import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout";
import RoleRoute from "../components/RoleRoute";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import HomePage from "../pages/public/HomePage";
import ProductsPage from "../pages/public/ProductsPage";
import ProductDetailPage from "../pages/public/ProductDetailPage";
import CartPage from "../pages/public/CartPage";
import SellerStorePage from "../pages/public/SellerStorePage";
import NotFoundPage from "../pages/public/NotFoundPage";
import CheckoutPage from "../pages/public/CheckoutPage";
import OrderSuccessPage from "../pages/public/OrderSuccessPage";
import SupportPage from "../pages/public/SupportPage";
import HelpCenterPage from "../pages/public/HelpCenterPage";
import ShippingReturnsPage from "../pages/public/ShippingReturnsPage";
import SellerPoliciesPage from "../pages/public/SellerPoliciesPage";
import PrivacyPolicyPage from "../pages/public/PrivacyPolicyPage";
import FaqPage from "../pages/public/FaqPage";
import NotificationsPage from "../pages/NotificationsPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import ProfilePage from "../pages/ProfilePage";
import AddressesPage from "../pages/AddressesPage";

import CustomerOverviewPage from "../pages/customer/CustomerOverviewPage";
import CustomerOrdersPage from "../pages/customer/CustomerOrdersPage";

import SellerOverviewPage from "../pages/seller/SellerOverviewPage";
import SellerProductsPage from "../pages/seller/SellerProductsPage";
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";
import SellerOrderDetailPage from "../pages/seller/SellerOrderDetailPage";
import SellerProductDetailPage from "../pages/seller/SellerProductDetailPage";
import SellerProductFormPage from "../pages/seller/SellerProductFormPage";

import AdminOverviewPage from "../pages/admin/AdminOverviewPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminSellersPage from "../pages/admin/AdminSellersPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:id", element: <ProductDetailPage /> },
      { path: "store/:sellerId", element: <SellerStorePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout/:sellerId", element: <CheckoutPage /> },
      { path: "order-success", element: <OrderSuccessPage /> },
      { path: "support", element: <SupportPage /> },
      { path: "support/help-center", element: <HelpCenterPage /> },
      { path: "support/shipping-returns", element: <ShippingReturnsPage /> },
      { path: "support/seller-policies", element: <SellerPoliciesPage /> },
      { path: "support/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "support/faq", element: <FaqPage /> },
    ],
  },

  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password/:token", element: <ResetPasswordPage /> },

  {
    path: "/dashboard",
    element: (
      <RoleRoute allowedRoles={["customer"]}>
        <DashboardLayout role="customer" title="Customer Dashboard" />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <CustomerOverviewPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "addresses", element: <AddressesPage /> },
      { path: "orders", element: <CustomerOrdersPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },

  {
    path: "/seller",
    element: (
      <RoleRoute allowedRoles={["seller"]}>
        <DashboardLayout role="seller" title="Seller Dashboard" />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <SellerOverviewPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "addresses", element: <AddressesPage /> },
      { path: "products", element: <SellerProductsPage /> },
      { path: "products/new", element: <SellerProductFormPage /> },
      { path: "products/:id", element: <SellerProductDetailPage /> },
      { path: "products/:id/edit", element: <SellerProductFormPage /> },
      { path: "orders", element: <SellerOrdersPage /> },
      { path: "orders/:id", element: <SellerOrderDetailPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <RoleRoute allowedRoles={["admin"]}>
        <DashboardLayout role="admin" title="Admin Dashboard" />
      </RoleRoute>
    ),
    children: [
      { index: true, element: <AdminOverviewPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "addresses", element: <AddressesPage /> },
      { path: "users", element: <AdminUsersPage /> },
      { path: "sellers", element: <AdminSellersPage /> },
      { path: "products", element: <AdminProductsPage /> },
      { path: "orders", element: <AdminOrdersPage /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;