"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios, { AxiosError } from "axios";

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
import { ApiResponse } from "@/lib/response";
import Link from "next/link";
import { useAuthActions } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useLoadingState } from "@/contexts/loading-context";

export default function Register() {
  const [isPending, startTransition] = React.useTransition();
  const { setUser } = useAuthActions();
  const { startLoading, stopLoading } = useLoadingState("auth-register");

  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    startTransition(async () => {
      try {
        startLoading();

        const { data } = await axios.post<ApiResponse>(
          "/api/auth/register",
          {
            ...values,
          },
          {
            withCredentials: true,
          },
        );

        if (!data.success) {
          toast.error((data.error as string) || "Terjadi Kesalahan");
          return;
        }

        await setUser(data.data as User);

        toast.success("register sukses! Mengarahkan...");
        router.push("/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("register error:", error);
          toast.error((error.response?.data as ApiResponse).error as string);
        }
      } finally {
        stopLoading();
      }
    });
  }

  return (
    <main className="grid md:grid-cols-2">
      <section className="order-2 md:order-1">
        <Card className="flex h-screen w-full flex-col justify-center rounded-t-none p-8 shadow-lg md:rounded-l-none md:p-12 lg:p-16">
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
                  className="w-full cursor-pointer"
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
