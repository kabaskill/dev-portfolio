import "@styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { ThreeToggle } from "../components/Three/ThreeToggle";

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
      <body
        className={`${inter.className} dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full`}
      >
        <Providers>
          <main id="main" className="min-h-screen">
            <ThreeToggle />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
