import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "@styles/globals.css";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { ThreeToggle } from "@components/ThreeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Oguz Kabasakal",
    default: "Oguz Kabasakal - Developer | Designer | Composer",
  },
  description: "Developing by day, slaying demons by night",
  metadataBase: new URL("https://oguzkabasakal.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-gray-800 w-full`}>
        <Providers>
          <main id="main" className="min-h-screen">
            <ThreeToggle />
            <Navbar />
            {children}
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
