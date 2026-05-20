import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import { Toast } from "@heroui/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "QuietHub - Where Deep Focus Begins",
    template: "%s - QuietHub",
  },
  description:
    "Calm · Minimal · Intentional spaces, sessions, and reservations.",
};

export default function RootLayout({ children }) {
  return (
    <html
      data-theme="light"
      lang="en"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="light bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),rgba(255,255,255,0.96)_35%),linear-gradient(145deg,#f8faff_0%,#ffffff_45%,#f6f3ff_100%)] text-gray-900 antialiased selection:bg-indigo-200">
        <NavBar />
        {children}
        <Footer />
        <Toast.Provider placement="top" />
      </body>
    </html>
  );
}
