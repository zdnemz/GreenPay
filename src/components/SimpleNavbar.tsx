import Link from "next/link";
import GreenPayIcon from "./icons/GreenPay";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SimpleNavbar({ backTo }: { backTo?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      if (backTo) {
        router.replace(backTo);
      } else {
        router.back();
      }
    } else {
      router.push("/"); // fallback kalau user langsung buka halaman ini
    }
  };

  return (
    <div className="bg-sidebar flex w-full items-center justify-between border-b py-3">
      <div>
        <Button
          onClick={handleBack}
          variant={"link"}
          className="cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali</span>
          </span>
        </Button>
      </div>

      {/* Logo */}
      <div>
        <h1 className="text-2xl font-semibold">
          <Link href="/" className="flex items-center justify-center gap-x-1">
            <GreenPayIcon className="text-primary h-8 w-8" />
            <span>
              <span className="text-primary">Green</span>Pay
            </span>
          </Link>
        </h1>
      </div>
    </div>
  );
}
