import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import MainLayout from "./layouts/MainLayout";
import BoardPage from "./pages/BoardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* MainLayout wraps the child routes */}
          <Route path="/" element={<MainLayout />}>
            {/* Default Home Page */}
            <Route index element={<BoardPage />} />
            
            {/* Auth pages */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;