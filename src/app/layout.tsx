import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adam | Portfolio",
  description: "Full-Stack Developer & Creative Technologist",
  openGraph: {
    title: "Adam | Portfolio",
    description: "Full-Stack Developer & Creative Technologist",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body className="bg-background text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
