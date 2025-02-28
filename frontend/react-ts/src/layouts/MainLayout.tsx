import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SearchProvider } from "../context/SearchContext";


// MainLayout, wrapped in SearchProvider to pass search queries to children. Contains Navbar, the main content outlet and a footer

function MainLayout() {
  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen bg-[#0e1a2b] text-white">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  );
}

export default MainLayout