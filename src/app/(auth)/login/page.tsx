"use client";

import * as React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import axios from "axios";

import RootLayout from "@/components/layouts/RootLayout";

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
import { ApiResponse } from "@/lib/response";
import Link from "next/link";

export default function Login() {
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      try {
        setLoading(true);

        const { data } = await axios.post<ApiResponse>(
          "/api/auth/login",
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

        toast.success("Login sukses! Mengarahkan...");
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Terjadi Kesalahan");
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <RootLayout>
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
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
      </div>
    </RootLayout>
  );
}
