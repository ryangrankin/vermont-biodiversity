import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vermont Biodiversity",
  description: "A student-designed app to help protect Vermont biodiversity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}