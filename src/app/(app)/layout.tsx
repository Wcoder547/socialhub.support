// app/(app)/layout.tsx
import Footer from "@/src/components/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <Footer />
    </div>
  );
}
