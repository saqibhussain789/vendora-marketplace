import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatWidget from "../chat/ChatWidget";  
import ScrollToTop from "./ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="min-h-[calc(100vh-160px)]">
        <ScrollToTop />
        <Outlet />
        <ChatWidget />
      </main>

      <Footer />
      
    </div>
  );
}