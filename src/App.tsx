import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import SalesLayout from "./components/pharmacy/sales/SalesLayout";
import SalesInvoiceList from "./components/pharmacy/sales/SalesInvoiceList";
import SalesInvoiceForm from "./components/pharmacy/sales/SalesInvoiceForm";
import SalesReturnList from "./components/pharmacy/sales/SalesReturnList";
import SalesReturnForm from "./components/pharmacy/sales/SalesReturnForm";
import SalesReportList from "./components/pharmacy/sales/SalesReportList";
import SecurityLayout from "./components/security/SecurityLayout";
import ControlPanel from "./components/security/ControlPanel";
import UserManagement from "./components/users/UserManagement";
import RoleManagement from "./components/roles/RoleManagement";
import PatientManagement from "./components/patients/PatientManagement";
import PatientRegistration from "./components/patients/PatientRegistration";
import OPDManagement from "./components/patients/opd/OPDManagement";
import OPDVisitList from "./components/patients/opd/OPDVisitList";
import OPDQueue from "./components/patients/opd/OPDQueue";
import OPDAppointments from "./components/patients/opd/OPDAppointments";

// Import OPD definition components
import DiseasesForm from "./components/opd/definitions/DiseasesForm";
import SymptomsForm from "./components/opd/definitions/SymptomsForm";
import TestsForm from "./components/opd/definitions/TestsForm";
import DosageForm from "./components/opd/definitions/DosageForm";
import DaysForm from "./components/opd/definitions/DaysForm";
import PendingPatients from "./components/opd/PendingPatients";

// Import IPD components
import IPDLayout from "./components/ipd/IPDLayout";
import IPDDashboardComponent from "./components/ipd/IPDDashboard";
import WardForm from "./components/ipd/definitions/WardForm";
import RoomForm from "./components/ipd/definitions/RoomForm";
import BedForm from "./components/ipd/definitions/BedForm";
import ServiceForm from "./components/ipd/definitions/ServiceForm";
import PatientTreatment from "./components/ipd/PatientTreatment";
import IPDBilling from "./components/ipd/IPDBilling";

// Import Pharmacy Prescriptions page
import PrescriptionsPage from "./pages/pharmacy/prescriptions";

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

// Lazy load OPD components
const OPDCheckup = lazy(() => import("./pages/opd/checkup"));
const OPDBilling = lazy(() => import("./pages/opd/billing"));

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

            {/* Security routes */}
            <Route path="/security" element={<SecurityLayout />}>
              <Route index element={<Navigate to="users" replace />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route
                path="permissions"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">
                      Permissions Management
                    </h1>
                    <div>Permissions coming soon</div>
                  </div>
                }
              />
              <Route path="control-panel" element={<ControlPanel />} />
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
              <Route path="prescriptions" element={<PrescriptionsPage />} />
              <Route path="sales" element={<SalesLayout />}>
                <Route index element={<Navigate to="invoices" replace />} />
                <Route path="invoices" element={<SalesInvoiceList />} />
                <Route path="invoices/new" element={<SalesInvoiceForm />} />
                <Route
                  path="invoices/edit/:id"
                  element={<SalesInvoiceForm />}
                />
                <Route path="returns" element={<SalesReturnList />} />
                <Route path="returns/new" element={<SalesReturnForm />} />
                <Route path="returns/edit/:id" element={<SalesReturnForm />} />
                <Route path="reports" element={<SalesReportList />} />
              </Route>
            </Route>

            {/* OPD routes */}
            <Route path="/opd">
              <Route path="diseases" element={<DiseasesForm />} />
              <Route path="symptoms" element={<SymptomsForm />} />
              <Route path="tests" element={<TestsForm />} />
              <Route path="dosage" element={<DosageForm />} />
              <Route path="days" element={<DaysForm />} />
              <Route path="pending-patients" element={<PendingPatients />} />
              <Route path="checkup" element={<OPDCheckup />} />
              <Route path="billing" element={<OPDBilling />} />
            </Route>

            {/* IPD routes */}
            <Route path="/ipd" element={<IPDLayout />}>
              <Route index element={<IPDDashboardComponent />} />
              <Route path="wards" element={<WardForm />} />
              <Route path="rooms" element={<RoomForm />} />
              <Route path="beds" element={<BedForm />} />
              <Route path="services" element={<ServiceForm />} />
              <Route path="treatments" element={<PatientTreatment />} />
              <Route path="billing" element={<IPDBilling />} />
            </Route>

            {/* Patient Management routes */}
            <Route path="/patients">
              <Route path="management" element={<PatientManagement />} />
              <Route path="registration" element={<PatientRegistration />} />
              <Route path="opd">
                <Route index element={<OPDManagement searchQuery="" />} />
                <Route
                  path="visits"
                  element={<OPDVisitList searchQuery="" />}
                />
                <Route path="queue" element={<OPDQueue searchQuery="" />} />
                <Route
                  path="appointments"
                  element={<OPDAppointments searchQuery="" />}
                />
              </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
