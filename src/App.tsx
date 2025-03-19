import React, { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import DashboardSkeleton from "./components/dashboard/DashboardSkeleton";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import VerifyEmailForm from "./components/auth/VerifyEmailForm";
import AuthGuard from "./components/auth/AuthGuard";
import ModuleSelectionPage from "./components/modules/ModuleSelectionPage";
import MainLayout from "./components/layout/MainLayout";
import RecordsLayout from "./components/records/RecordsLayout";
import CategoryForm from "./components/records/CategoryForm";
import DepartmentForm from "./components/records/DepartmentForm";
import CompanyForm from "./components/records/CompanyForm";
import WarehouseForm from "./components/records/WarehouseForm";
import BankForm from "./components/records/BankForm";
import UOMForm from "./components/records/UOMForm";
import ItemManagement from "./components/pharmacy/ItemManagement";
import routes from "tempo-routes";
import CustomerManagement from "./components/pharmacy/CustomerManagement";
import InventoryManagement from "./components/pharmacy/InventoryManagement";
import PurchaseLayout from "./components/pharmacy/purchase/PurchaseLayout";
import PurchaseOrderList from "./components/pharmacy/purchase/PurchaseOrderList";
import PurchaseOrderForm from "./components/pharmacy/purchase/PurchaseOrderForm";
import PurchaseInvoiceList from "./components/pharmacy/purchase/PurchaseInvoiceList";
import PurchaseInvoiceForm from "./components/pharmacy/purchase/PurchaseInvoiceForm";
import PurchaseReturnList from "./components/pharmacy/purchase/PurchaseReturnList";
import PurchaseReturnForm from "./components/pharmacy/purchase/PurchaseReturnForm";
import PurchaseReportList from "./components/pharmacy/purchase/PurchaseReportList";

// Lazy load dashboard components
const AdminDashboard = lazy(
  () => import("./components/dashboard/AdminDashboard"),
);
const PharmacyDashboard = lazy(
  () => import("./components/dashboard/PharmacyDashboard"),
);
const OPDDashboard = lazy(() => import("./components/dashboard/OPDDashboard"));
const IPDDashboard = lazy(() => import("./components/dashboard/IPDDashboard"));
const LabDashboard = lazy(() => import("./components/dashboard/LabDashboard"));

// Lazy load records components
// Using direct imports for CategoryForm and DepartmentForm

function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/verify-email" element={<VerifyEmailForm />} />

          {/* Module Selection - Separate route */}
          <Route path="/module-selection" element={<ModuleSelectionPage />} />

          {/* Protected routes with MainLayout */}
          <Route
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            {/* Dashboard routes */}
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
            <Route path="/opd-dashboard" element={<OPDDashboard />} />
            <Route path="/ipd-dashboard" element={<IPDDashboard />} />
            <Route path="/lab-dashboard" element={<LabDashboard />} />

            {/* Records & Definitions routes */}
            <Route path="/records" element={<RecordsLayout />}>
              <Route path="categories" element={<CategoryForm />} />
              <Route path="departments" element={<DepartmentForm />} />
              <Route path="companies" element={<CompanyForm />} />
              <Route path="warehouses" element={<WarehouseForm />} />
              <Route path="banks" element={<BankForm />} />
              <Route path="uoms" element={<UOMForm />} />
              <Route
                path="forms"
                element={<div className="p-6">Forms coming soon</div>}
              />
              <Route
                path="templates"
                element={<div className="p-6">Templates coming soon</div>}
              />
              <Route
                path="reports"
                element={<div className="p-6">Reports coming soon</div>}
              />
            </Route>

            {/* Pharmacy routes */}
            <Route path="/pharmacy">
              <Route path="items" element={<ItemManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="inventory" element={<InventoryManagement />} />
              <Route path="purchase" element={<PurchaseLayout />}>
                <Route index element={<Navigate to="orders" replace />} />
                <Route path="orders" element={<PurchaseOrderList />} />
                <Route path="orders/new" element={<PurchaseOrderForm />} />
                <Route path="orders/edit/:id" element={<PurchaseOrderForm />} />
                <Route path="invoices" element={<PurchaseInvoiceList />} />
                <Route path="invoices/new" element={<PurchaseInvoiceForm />} />
                <Route
                  path="invoices/edit/:id"
                  element={<PurchaseInvoiceForm />}
                />
                <Route path="returns" element={<PurchaseReturnList />} />
                <Route path="returns/new" element={<PurchaseReturnForm />} />
                <Route
                  path="returns/edit/:id"
                  element={<PurchaseReturnForm />}
                />
                <Route path="reports" element={<PurchaseReportList />} />
              </Route>
              <Route
                path="prescriptions"
                element={<div className="p-6">Prescriptions coming soon</div>}
              />
              <Route
                path="sales"
                element={<div className="p-6">Sales coming soon</div>}
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
