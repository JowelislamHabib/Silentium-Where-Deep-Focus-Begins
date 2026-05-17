import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./Components/NavBar";

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
  title: "Silentium — Where Deep Focus Begins",
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
      <body className="light bg-stone-50 text-gray-900 antialiased selection:bg-indigo-50">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
