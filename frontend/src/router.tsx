import type { RouteObject } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfileHomePage from "./pages/ProfileHomePage";
import OrdersListingPage from "./pages/OrdersListingPage";

import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import CartPage from "./pages/CartPage";
import AddressPage from "./pages/AddressPage";
import PaymentPage from "./pages/PaymentPage";

import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";

import AuthPage from "./pages/AuthPage";
import LocationPermissionPage from "./pages/LocationPermissionPage";
import EditProfilePage from "./pages/EditProfilePage";

export const appRoutes: RouteObject[] = [
 
  {
    path: "/location-permission",
    element: <LocationPermissionPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "profile",
        element: <ProfileHomePage />,
      },
      {
        path: "profile/edit",
        element: <EditProfilePage />,
      },
      {
        path: "orders",
        element: <OrdersListingPage />,
      },
    ],
  },

  {
    path: "/products",
    element: <ProductListingPage />,
  },
  {
    path: "/products/:productId",
    element: <ProductDetailPage />,
  },

  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/address",
    element: <AddressPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },

  {
    path: "/order-confirmation",
    element: <OrderConfirmationPage />,
  },
  {
    path: "/order-status/:orderId",
    element: <OrderStatusPage />,
  },
  {
    path: "/orders/:orderId",
    element: <OrderDetailsPage />,
  },
];
