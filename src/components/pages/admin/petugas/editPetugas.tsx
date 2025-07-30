"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as React from "react";
import { z } from "zod";
import { PetugasUpdateSchema } from "@/schemas/admin-schema";
import { ApiResponse } from "@/lib/response";
import axios, { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface EditpetugasDialogProps {
  petugas: User;
  onSuccess: () => void;
}

export function EditPetugasDialog({
  petugas,
  onSuccess,
}: EditpetugasDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof PetugasUpdateSchema>>({
    defaultValues: {
      name: petugas.name,
      email: petugas.email,
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: z.infer<typeof PetugasUpdateSchema>) => {
    startTransition(async () => {
      try {
        await axios.put<ApiResponse>(`/api/admin/petugas/${petugas.id}`, data, {
          withCredentials: true,
        });

        if (onSuccess) onSuccess();

        toast.success(`Data petugas "${data.name}" berhasil disimpan`);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Admin dashboard error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        setOpen(false);
      }
    });
  };

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: petugas.name,
        email: petugas.email,
      });
    }
  }, [open, petugas, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit petugas</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your name"
                      className="focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? "Loading..." : "Simpan Perubahan"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
