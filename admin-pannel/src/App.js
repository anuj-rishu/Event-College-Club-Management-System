import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Userdisplay from "./pages/userdisplay";
import Scandata from "./pages/Scandata";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import FormList from "./components/FormList";
import FormBuilder from "./components/FormBuilder";
import FormPreview from "./components/FormPreview";
import FormResponses from "./components/FormPreview";
import UpdateDetails from "./pages/updateDetails";
import UserMessage from "./pages/UserMessage";
import Interview from "./pages/Interview";
import Scanner from "./pages/Scanner";
import AddAdmin from "./pages/AddAdmin";
import CertificateForm from "./pages/certificate";
import VerifyCertificate from "./pages/verifyCerti";
import TicketGenerationForm from "./pages/adminTicketGen";
import TicketStats from "./pages/TicketSalesStats";
import Layout from "./components/layout";



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/verify/:scanId" element={<VerifyCertificate />} />
        
        {/* Protected routes with Layout */}
        <Route
          path="/scan"
          element={
            <ProtectedRoute>
                    <Layout>
                <Scandata />
                </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userdisplay"
          element={
            <ProtectedRoute>
              <Layout>
                <Userdisplay />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/formlist"
          element={
            <ProtectedRoute>
              <Layout>
                <FormList />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Layout>
                <FormBuilder />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FormBuilder editMode={true} />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FormPreview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/responses/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FormResponses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UpdateDetails />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-message"
          element={
            <ProtectedRoute>
              <Layout>
                <UserMessage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Layout>
                <Interview />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <Layout>
                <Scanner />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-control"
          element={
            <ProtectedRoute>
              <Layout>
                <AddAdmin />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate"
          element={
            <ProtectedRoute>
              <Layout>
                <CertificateForm />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/genarateTicket"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketGenerationForm/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticketstats"
          element={
            <ProtectedRoute>
              <Layout>
                <TicketStats/>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;


