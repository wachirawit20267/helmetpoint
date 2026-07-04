import Header from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
  );
}