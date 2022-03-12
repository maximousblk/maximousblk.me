import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Container({ children }) {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-900 min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1 justify-center bg-white dark:bg-gray-900 px-4 sm:px-8">{children}</main>
      <Footer />
    </div>
  );
}
