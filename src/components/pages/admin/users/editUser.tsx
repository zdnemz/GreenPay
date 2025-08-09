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
import { UserUpdateSchema } from "@/schemas/admin-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetcher } from "@/lib/fetcher";

interface EditUserDialogProps {
  user: User;
  onSuccess: () => unknown;
}

export function EditUserDialog({ user, onSuccess }: EditUserDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof UserUpdateSchema>>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: z.infer<typeof UserUpdateSchema>) => {
    startTransition(async () => {
      try {
        await fetcher({
          url: `/api/admin/users/${user.id}`,
          method: "put",
          data,
          config: { withCredentials: true },
        });

        onSuccess();
        toast.success(`Data user "${data.name}" berhasil disimpan`);
        setOpen(false);
      } catch (error) {
        console.error("edit User error:", error);
        toast.error((error as Error).message);
      }
    });
  };

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [open, user, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="cursor-pointer">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
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
