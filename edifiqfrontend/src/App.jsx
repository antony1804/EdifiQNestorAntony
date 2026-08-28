import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./componentes/Sidebar";
import LandingPage from "./pages/LadingPages";
import HomePage from "./pages/Admin/AdminHomePages";
import PersonasPage from "./pages/PersonaPages";
import "./App.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <HomePage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/personas"
          element={
            <AdminLayout>
              <PersonasPage />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;