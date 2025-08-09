"use client";

import Footer from "@/components/Footer";
import RootLayout from "@/components/layouts/RootLayout";
import Navbar from "@/components/Navbar";
import ProfileSection from "@/components/pages/petugas/profile";
import { withAuth } from "@/hoc/withAuth";

export default withAuth(DashboardPetugasPage, undefined, ["PETUGAS"]);

function DashboardPetugasPage() {
  return (
    <RootLayout header={<Navbar />} footer={<Footer />}>
      <ProfileSection />
    </RootLayout>
  );
}
