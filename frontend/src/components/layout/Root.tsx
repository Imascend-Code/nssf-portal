import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Root() {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Top Navigation */}
        <Navbar />

        {/* Main content */}
        <main id="content" className="flex-1">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <Toaster position="top-right" richColors expand visibleToasts={3} />
      </div>
    </TooltipProvider>
  );
}