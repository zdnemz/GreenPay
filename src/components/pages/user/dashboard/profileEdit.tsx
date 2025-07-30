"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import z from "zod";
import { toast } from "sonner";

import { updateUserSchema } from "@/schemas/user-schema";
import { ApiResponse } from "@/lib/response";

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
import axios, { AxiosError } from "axios";
import { UserData } from "@/types";
import { useLoadingState } from "@/contexts/loading-context";

interface EditProfileDialogProps {
  user: UserData;
}

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const { startLoading, stopLoading } = useLoadingState("user-profile-edit");

  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    const cleanedValues = {
      name: values.name?.trim() || undefined,
      email: values.email?.trim() || undefined,
    };

    startTransition(async () => {
      try {
        startLoading();
        const { data } = await axios.put<ApiResponse>(
          "/api/users/profile",
          {
            ...cleanedValues,
          },
          {
            withCredentials: true,
          },
        );

        if (!data.success) {
          toast.error((data.error as string) || "Terjadi Kesalahan");
          return;
        }

        toast.success("Profile telah diperbarui");
        router.refresh();
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Update profile error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
          return;
        }

        toast.error("Terjadi kesalahan");
      } finally {
        stopLoading();
      }
    });
  }

  return (
    <Dialog>
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
