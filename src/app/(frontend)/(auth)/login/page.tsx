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
import { loginSchema } from "@/schemas/auth-schema";
import { toast } from "sonner";
import Link from "next/link";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { useAuthActions } from "@/stores/auth-store";

export default function Login() {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { setUser } = useAuthActions();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        const { data } = await fetcher<User>({
          url: "/api/auth/login",
          method: "post",
          data: values,
          config: { withCredentials: true },
        });

        if (!data) throw new Error();
        await setUser(data);

        toast.success("Login sukses! Mengarahkan...");
        if (data.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        } else if (data.role === "USER") {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        console.error("login error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      }
    });
  }

  return (
    <main className="grid md:grid-cols-2">
      <section className="order-1 md:order-2">
        <Card className="flex h-screen w-full flex-col justify-center rounded-t-none p-8 shadow-lg md:rounded-l-none md:p-12 lg:p-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
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
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? "Loading..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="text-muted-foreground flex justify-center gap-x-1 text-sm">
            {"Belum punya akun?"}
            <Button className="p-0" variant="link" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
      <section className="flex items-center justify-center p-16 md:order-1">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold">Selamat Datang Kembali</h2>
          <p className="text-muted-foreground">
            Masukkan detail pribadi Anda untuk menggunakan semua fitur situs
          </p>
        </div>
      </section>
    </main>
  );
}
