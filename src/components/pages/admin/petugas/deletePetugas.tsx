"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/response";
import { User } from "@/types";

interface DeletePetugasDialogProps {
  petugas: User;
  onSuccess: () => void;
}

export function DeletePetugasDialog({
  petugas,
  onSuccess,
}: DeletePetugasDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await axios.delete<ApiResponse>(`/api/admin/petugas/${petugas.id}`, {
          withCredentials: true,
        });

        toast.success(`Petugas "${petugas.name}" berhasil dihapus`);
        if (onSuccess) onSuccess();
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Delete petugas error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive" size="sm">
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Petugas</DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          Apakah kamu yakin ingin menghapus petugas{" "}
          <strong>{petugas.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
