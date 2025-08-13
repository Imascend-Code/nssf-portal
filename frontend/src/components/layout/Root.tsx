// src/components/layout/Root.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="content" className="flex-1 max-w-6xl mx-auto w-full p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
