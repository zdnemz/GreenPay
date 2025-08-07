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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      role: user.role,
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: z.infer<typeof UserUpdateSchema>) => {
    startTransition(async () => {
      try {
        await fetcher({
          url: `/api/admin/users/${user.id}`,
          method: "put",
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
        role: user.role,
      });
    }
  }, [open, user, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit</Button>
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="focus-visible:ring-primary w-full">
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="PETUGAS">Petugas</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
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
