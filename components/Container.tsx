import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Container({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Navbar />
      <main className="flex flex-1 flex-col justify-center bg-white px-4 dark:bg-gray-900 sm:px-8">{children}</main>
      <Footer />
    </div>
  );
}
