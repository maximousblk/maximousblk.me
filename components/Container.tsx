import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Container({ children }) {
  return (
    <div className="bg-white dark:bg-coolGray-900">
      <Navbar />
      <main className="flex flex-col justify-center bg-white dark:bg-coolGray-900 px-6">{children}</main>
      <Footer />
    </div>
  );
}
