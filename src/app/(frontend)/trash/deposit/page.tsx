"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { fetcher } from "@/lib/fetcher";
import { TrashType } from "@/generated/prisma";
import { TrashPrepareData } from "@/types";
import { prepareDepositTrashSchema } from "@/schemas/trash-schema";
import RootLayout from "@/components/layouts/RootLayout";
import Footer from "@/components/Footer";
import { formatSeconds } from "@/lib/time";
import SimpleNavbar from "@/components/SimpleNavbar";

type DepositFormValues = z.infer<typeof prepareDepositTrashSchema>;

const trashTypes = [
  { value: TrashType.PLASTIC, label: "Plastik" },
  { value: TrashType.PAPER, label: "Kertas" },
  { value: TrashType.METAL, label: "Logam" },
  { value: TrashType.ORGANIC, label: "Organik" },
  { value: TrashType.OTHER, label: "Lainnya" },
];

export default function TrashDepositPage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [qrData, setQrData] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const [expires, setExpires] = React.useState<number>();
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  React.useEffect(() => {
    if (!expires) return;

    const updateTimeLeft = () => {
      const diff = Math.max(0, Math.floor((expires - Date.now()) / 1000));
      setTimeLeft(diff);
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expires]);

  function countdownDisplay(seconds: number) {
    const { minutes, seconds: s } = formatSeconds(seconds, {
      padHours: true,
      alwaysShowDays: false,
    });

    return `${minutes} Menit ${s} Detik`;
  }

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(prepareDepositTrashSchema),
    defaultValues: {
      trash: [{ trashType: TrashType.PLASTIC, weight: 0 }],
    },
  });

  const { control, register, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "trash" });

  const onSubmit = (values: DepositFormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      startTransition(async () => {
        try {
          const res = await fetcher<TrashPrepareData>({
            url: "/api/trash/prepare",
            method: "post",
            data: values,
            config: { withCredentials: true },
          });

          if (res.data) {
            setExpires(res.data?.payload.expiresAt);
            setQrData(btoa(JSON.stringify(res.data)));
            toast.success("QR Code berhasil dibuat");

            setStep(3);
          }
        } catch (error) {
          console.error("Prepare trash error:", error);
          toast.error((error as Error).message || "Terjadi kesalahan");
        }
      });
    }
  };

  return (
    <RootLayout header={<SimpleNavbar />} footer={<Footer />}>
      <section className="flex min-h-screen w-full items-center justify-center">
        <Card className="mx-auto max-w-2xl min-w-96 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Setor Sampah</h2>
          </div>

          <Separator />

          {step === 1 && (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {fields.map((field, index) => {
                const selectedTypes = watch("trash").map((t) => t.trashType);
                const availableTypes = trashTypes.filter(
                  (t) =>
                    t.value === watch(`trash.${index}.trashType`) ||
                    !selectedTypes.includes(t.value),
                );

                return (
                  <div key={field.id} className="flex items-center gap-3">
                    <Select
                      value={watch(`trash.${index}.trashType`)}
                      onValueChange={(val) =>
                        setValue(`trash.${index}.trashType`, val as TrashType)
                      }
                    >
                      <SelectTrigger className="w-[150px] flex-shrink-0">
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

                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Berat (kg)"
                      className="w-[120px] flex-shrink-0"
                      {...register(`trash.${index}.weight`, {
                        valueAsNumber: true,
                      })}
                    />

                    <div className="w-[90px] flex-shrink-0">
                      {fields.length > 1 ? (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => remove(index)}
                          className="w-full"
                        >
                          Hapus
                        </Button>
                      ) : (
                        <div className="invisible">
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                          >
                            Hapus
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
                onClick={() =>
                  append({ trashType: TrashType.PLASTIC, weight: 0 })
                }
              >
                + Tambah Jenis
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
              >
                Lanjut Konfirmasi
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Konfirmasi Setoran</h3>
              <ul className="space-y-2">
                {watch("trash").map((t, i) => (
                  <li
                    key={i}
                    className="flex justify-between rounded border p-2"
                  >
                    <span>
                      {trashTypes.find((x) => x.value === t.trashType)?.label}
                    </span>
                    <span>{t.weight} kg</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Kembali
                </Button>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                  className="cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                >
                  Buat QR Code
                </Button>
              </div>
            </div>
          )}

          {step === 3 && qrData && (
            <div className="space-y-4 text-center">
              <h3 className="font-semibold">QR Code Setoran</h3>

              <div className="border-foreground mx-auto flex h-[200px] w-[200px] items-center justify-center rounded border">
                {timeLeft > 0 ? (
                  <QRCodeSVG value={qrData} size={200} />
                ) : (
                  <div className="bg-muted-foreground flex h-full w-full items-center justify-center">
                    <span className="text-foreground text-lg font-bold">
                      QR Kadaluarsa
                    </span>
                  </div>
                )}
              </div>

              <p className="text-muted-foreground grid text-sm">
                Tunjukkan QR Code ini ke petugas.
                <span className="text-xs">
                  {timeLeft > 0 ? (
                    <>
                      Kadaluarsa dalam{" "}
                      <span className="font-semibold">
                        {countdownDisplay(timeLeft)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">QR sudah kadaluarsa</span>
                  )}
                </span>
              </p>

              <Button
                className="cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                onClick={() => setStep(1)}
              >
                Setor Lagi
              </Button>
            </div>
          )}
        </Card>
      </section>
    </RootLayout>
  );
}
