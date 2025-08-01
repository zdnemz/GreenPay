import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/providers/auth-provider";
import LoadingProvider from "@/components/providers/loading-provider";

const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GreenPay - Tukar Sampah Jadi Saldo Digital",
  description:
    "Ubah sampah jadi saldo digital dan bantu lingkungan bersama GreenPay.",
  alternates: {
    canonical: `${process.env.APP_URL}/`,
  },
  openGraph: {
    title: "GreenPay",
    description: "Platform tukar sampah jadi saldo digital berbasis komunitas.",
    url: `${process.env.APP_URL}/`,
    siteName: "GreenPay",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{ overflow: "hidden" }}
        className={`${poppins.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
