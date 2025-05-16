import { Routes, Route } from "react-router-dom";
import MarketingPage from "./pages/marketing/marketing-page";
import MarketingLayout from "./pages/marketing/layout-marketing";
import SignIpPage from "./pages/platform/clerk/sign-in/sign-in-page";
import SignUpPage from "./pages/platform/clerk/sign-in/sign-up-page";
import ClerkLayout from "./pages/platform/clerk/layout-clerk";
import CreateOrganizationPage from "./pages/platform/clerk/select-org/select-page";
import OrganizationIdPage from "./pages/platform/dashboard/organization/organizationId/pageOrganization";
import DashboardLayout from "./pages/platform/dashboard/layout-dashboard-page";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import SettingsPage from "./pages/platform/dashboard/organization/organizationId/settings/settings-page";
import BoardIdPage from "./pages/platform/dashboard/board/board_ID/page-board";
import BoardIdLayout from "./pages/platform/dashboard/board/board_ID/layout-board";
import Organizationlayout from './pages/platform/dashboard/organization/layout-organization';
import ActivityPage from "./pages/platform/dashboard/organization/organizationId/activity/page";
import BillingPage from "./pages/platform/dashboard/organization/organizationId/billing/billing-page";
import { useOrganization } from "@clerk/clerk-react";
import ErrorPage from "./pages/platform/dashboard/organization/organizationId/ErrorPage";


function App() {
  const { membership } = useOrganization();
  const role = membership?.role;

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><MarketingLayout><MarketingPage /></MarketingLayout></PublicRoute>} />
      <Route path="/sign-in" element={<ClerkLayout> <SignIpPage /> </ClerkLayout>} />
      <Route path="/sign-up" element={<ClerkLayout> <SignUpPage /> </ClerkLayout>} />
      <Route path="/select-org" element={<ProtectedRoute><ClerkLayout><CreateOrganizationPage /></ClerkLayout></ProtectedRoute>} />
      <Route path="/organization/:organizationId" element={<ProtectedRoute><DashboardLayout><Organizationlayout><OrganizationIdPage /></Organizationlayout> </DashboardLayout></ProtectedRoute>} />
      <Route path="/organization/:organizationId/activity" element={<ProtectedRoute><DashboardLayout><Organizationlayout>< ActivityPage /></Organizationlayout> </DashboardLayout></ProtectedRoute>} />
      <Route path="/organization/:organizationId/settings" element={<ProtectedRoute><DashboardLayout><Organizationlayout> <SettingsPage /></Organizationlayout> </DashboardLayout></ProtectedRoute>} />
      {role === 'org:admin' && (<Route path="/organization/:organizationId/billing" element={<ProtectedRoute><DashboardLayout><Organizationlayout> <BillingPage /></Organizationlayout> </DashboardLayout></ProtectedRoute>} />
      )}
      <Route path="/board/:boardId" element={<ProtectedRoute><DashboardLayout><BoardIdLayout><BoardIdPage /></BoardIdLayout></DashboardLayout></ProtectedRoute>} />

      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
