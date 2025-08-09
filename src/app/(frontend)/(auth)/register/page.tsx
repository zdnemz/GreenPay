"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema } from "@/schemas/auth-schema";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/stores/auth-store";
import { User } from "@/types";
import { fetcher } from "@/lib/fetcher";

export default function Register() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { setUser } = useAuthActions();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      try {
        const { data } = await fetcher<User>({
          url: "/api/auth/register",
          method: "post",
          data: values,
          config: { withCredentials: true },
        });

        if (!data) throw new Error();

        await setUser(data);
        toast.success("Pendaftaran sukses! Mengarahkan...");
        router.replace("/dashboard");
      } catch (error) {
        console.error("register error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <main className="grid md:grid-cols-2">
      <section className="order-2 md:order-1">
        <Card className="flex h-screen w-full flex-col justify-center rounded-none rounded-t-lg p-8 shadow-lg md:rounded-t-none md:rounded-r-lg md:p-12 lg:p-16">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Daftar Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="******"
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
                  className="w-full cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                  disabled={isPending}
                >
                  {isPending ? "Loading..." : "register"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-muted-foreground flex justify-center gap-x-1 text-sm">
            {"Sudah punya akun?"}
            <Button className="p-0" variant="link" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      <section className="order-1 flex items-center justify-center p-16 md:order-2">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold">
            Halo, Sahabat <span className="text-primary">GreenPay</span>
          </h2>
          <p className="text-muted-foreground">
            Daftar dengan detail pribadi Anda untuk menggunakan semua fitur
            situs
          </p>
        </div>
      </section>
    </main>
  );
}
