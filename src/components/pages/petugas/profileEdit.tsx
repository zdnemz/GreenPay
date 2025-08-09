"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import z from "zod";
import { toast } from "sonner";

import { updateUserSchema } from "@/schemas/user-schema";

import { Edit2 } from "lucide-react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserData } from "@/types";
import { fetcher } from "@/lib/fetcher";

interface EditProfileDialogProps {
  user: UserData;
  onSuccess: () => void;
}

export default function EditProfileDialog({
  user,
  onSuccess,
}: EditProfileDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    const cleanedValues = {
      name: values.name?.trim() || undefined,
      email: values.email?.trim() || undefined,
    };

    startTransition(async () => {
      try {
        await fetcher({
          url: "/api/users/profile",
          method: "put",
          data: cleanedValues,
          config: {
            withCredentials: true,
          },
        });

        toast.success("Profile telah diperbarui");
        onSuccess();
        setOpen(false);
      } catch (error) {
        console.error("profile edit error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]">
          Edit Profil
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-xl p-0">
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="sr-only">Edit Profil</DialogTitle>
          <div className="w-full">
            <Image
              src="/banner.png"
              alt="banner"
              width={1920}
              height={400}
              className="h-24 w-full object-cover"
            />
          </div>
          <div className="relative w-fit -translate-y-12">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/avatar.png" alt="User Avatar" />
            </Avatar>
            <div className="bg-background/50 border-primary absolute right-0 bottom-0 -translate-1 rounded-full border p-1 shadow-md">
              <Edit2 className="h-4 w-4" />
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Your name"
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

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending ? "Loading..." : "Simpan"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
