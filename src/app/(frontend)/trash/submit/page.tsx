"use client";

import React, { useTransition } from "react";
import { useQRData } from "@/stores/qr-store";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashSubmitData } from "@/types";
import { Status, TrashType } from "@/generated/prisma";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { submitDepositTrashSchema } from "@/schemas/trash-schema";
import RootLayout from "@/components/layouts/RootLayout";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SimpleNavbar from "@/components/SimpleNavbar";
import { withAuth } from "@/hoc/withAuth";
import { Plus, Trash } from "lucide-react";

const trashTypes = [
  { value: TrashType.PLASTIC, label: "Plastik" },
  { value: TrashType.PAPER, label: "Kertas" },
  { value: TrashType.METAL, label: "Logam" },
  { value: TrashType.ORGANIC, label: "Organik" },
  { value: TrashType.OTHER, label: "Lainnya" },
];

export default withAuth(TrashSubmitPage, undefined, ["PETUGAS"]);

function TrashSubmitPage() {
  const QRData = useQRData();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!QRData) {
    redirect("/trash/verify");
  }

  console.log(QRData);

  const form = useForm<z.infer<typeof submitDepositTrashSchema>>({
    resolver: zodResolver(submitDepositTrashSchema),
    defaultValues: {
      payloadId: QRData.payload.payloadId,
      userId: QRData.payload.user.id,
      signature: QRData.signature,
      trash: QRData.payload.trash.length
        ? QRData.payload.trash.map((item) => ({
            trashType: item.trashType as TrashType,
            weight: Number(item.weight) || 0.01,
          }))
        : [{ trashType: TrashType.PLASTIC, weight: 0.01 }],
      status: Status.APPROVED as Status,
    },
  });

  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "trash",
  });

  const onSubmit = async (values: z.infer<typeof submitDepositTrashSchema>) => {
    startTransition(async () => {
      try {
        const { data } = await fetcher<TrashSubmitData>({
          url: "/api/trash/submit",
          data: values,
          config: { method: "POST", withCredentials: true },
        });

        if (!data) throw new Error("Response data kosong");

        if (data.status === "APPROVED") {
          toast.success("Transaksi disetujui", {
            description: `Berhasil mendapatkan ${data.totalPoints} poin dari ${data.totalWeight.toFixed(2)} kg sampah`,
          });
        } else if (data.status === "REJECTED") {
          toast.error("Transaksi ditolak", {
            description: `${data.totalWeight.toFixed(2)} kg sampah tidak memenuhi kriteria`,
          });
        }

        router.push("/trash/history");
      } catch (error) {
        console.error("Submit error:", error);
        toast.error((error as Error).message || "Terjadi kesalahan");
      }
    });
  };

  const getFirstAvailableTrashType = (
    usedTypes: TrashType[],
  ): TrashType | null => {
    for (const t of trashTypes) {
      if (!usedTypes.includes(t.value)) return t.value;
    }
    return null; // semua sudah dipakai
  };

  return (
    <RootLayout header={<SimpleNavbar />}>
      <section className="flex min-h-screen w-full items-center justify-center">
        <Card className="mx-auto max-w-2xl min-w-96 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Konfirmasi Setor Sampah</h2>
              <p className="text-muted-foreground">
                {QRData.payload.user.name}
              </p>
            </div>
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {fields.map((field, index) => {
                const selectedTypes = watch("trash").map((t) => t.trashType);
                const availableTypes = trashTypes.filter(
                  (t) =>
                    t.value === watch(`trash.${index}.trashType`) ||
                    !selectedTypes.includes(t.value),
                );

                return (
                  <div key={field.id} className="flex items-center gap-3">
                    <FormField
                      control={control}
                      name={`trash.${index}.trashType`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              value={fieldProps.value}
                              onValueChange={fieldProps.onChange}
                            >
                              <SelectTrigger className="w-32 flex-shrink-0">
                                <SelectValue placeholder="Pilih jenis" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTypes.map((t) => (
                                  <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`trash.${index}.weight`}
                      render={({ field: fieldProps }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="Berat (kg)"
                              className="w-full flex-shrink-0"
                              {...fieldProps}
                              onChange={(e) =>
                                fieldProps.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="w-6 flex-shrink-0">
                      {fields.length > 1 ? (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="w-full cursor-pointer"
                        >
                          <Trash />
                        </Button>
                      ) : (
                        <div className="invisible">
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-full cursor-pointer"
                          >
                            <Trash />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                className="w-32 cursor-pointer"
                onClick={() => {
                  const usedTypes: TrashType[] = watch("trash").map(
                    (t) => t.trashType,
                  );
                  const newType = getFirstAvailableTrashType(usedTypes);
                  if (newType) {
                    append({ trashType: newType, weight: 0.01 });
                  } else {
                    toast.error("Semua jenis sampah sudah ditambahkan");
                  }
                }}
              >
                <Plus /> Tambah
              </Button>

              <Separator />

              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full flex-shrink-0">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Status.APPROVED}>
                            Setujui
                          </SelectItem>
                          <SelectItem value={Status.REJECTED}>Tolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
              >
                {isPending ? "Memproses..." : "Lanjut Konfirmasi"}
              </Button>
            </form>
          </Form>
        </Card>
      </section>
    </RootLayout>
  );
}
