import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "รายการสินค้า",
  description: "ใบงานปฏิบัติ React Hook Form, Zod และ External API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}