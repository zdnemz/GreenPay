import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function WithdrawPage() {
  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <section className="flex min-h-screen w-full flex-col items-center justify-center space-y-3 text-center">
        <div>
          {/* Status Code */}
          <h1 className="text-primary text-6xl font-bold">404</h1>

          {/* Message */}
          <h2 className="text-2xl font-semibold">Fitur Belum Tersedia</h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Halaman ini masih dalam tahap pengembangan.
          </p>
        </div>

        {/* Back to Home */}
        <Button asChild className="flex items-center gap-2">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </section>
    </RootLayout>
  );
}
