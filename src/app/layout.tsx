import "./globals.css";
import "./utils/lib/fontawesome";
import NavBar from "./components/NavBar";
import { ReactNode } from "react";
import { ReduxProvider } from "./components/ReduxProvider";

export const metadata = {
  title: "CineScope",
  description:
    "CineScope: Browse movies by genre, explore celebrity filmographies, view trailers & images, and get TMDb-powered recommendations—all in one place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <ReduxProvider>
          <NavBar />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
