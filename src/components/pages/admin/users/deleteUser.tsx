"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@/types";
import { fetcher } from "@/lib/fetcher";

interface DeleteUserDialogProps {
  user: User;
  onSuccess: () => void;
}

export function DeleteUserDialog({ user, onSuccess }: DeleteUserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await fetcher({
          url: `/api/admin/users/${user.id}`,
          method: "delete",
          config: { withCredentials: true },
        });

        onSuccess();
        toast.success(`User "${user.name}" berhasil dihapus`);
      } catch (error) {
        console.error("delete User error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Pengguna</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Apakah kamu yakin ingin menghapus pengguna{" "}
          <strong>{user.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <DialogFooter className="mt-4">
          <Button
            className="cursor-pointer"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
