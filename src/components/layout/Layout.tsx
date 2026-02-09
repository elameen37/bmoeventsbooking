import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "@/components/ui/scroll-to-top";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showScrollToTop?: boolean;
}

const Layout = ({ children, showFooter = true, showScrollToTop = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
      {showFooter && <Footer />}
      {showScrollToTop && <ScrollToTop />}
    </div>
  );
};

export default Layout;
