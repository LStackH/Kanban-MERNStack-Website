import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0e1a2b] text-white">
    {/* Nav */}
    <Navbar />

    {/* Main content area */}
    <main className="flex-1 container mx-auto px-4 py-8">
      <Outlet />
    </main>

    {/* Footer */}
    <Footer />
  </div>
  )
}

export default MainLayout