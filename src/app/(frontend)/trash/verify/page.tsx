"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, RotateCw, Camera, Square, X } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { TrashVerifyData } from "@/types";
import { useQRActions } from "@/stores/qr-store";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import SimpleNavbar from "@/components/SimpleNavbar";
import RootLayout from "@/components/layouts/RootLayout";
import { withAuth } from "@/hoc/withAuth";
import { cn } from "@/lib/utils";
import { decoder } from "@/lib/encode";
import Image from "next/image";

type TabType = "camera" | "upload";

export default withAuth(TrashVerifyPage, undefined, ["PETUGAS"]);

function TrashVerifyPage() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("camera");

  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const scanningRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  const [isPending, startTransition] = React.useTransition();

  const { setQRData } = useQRActions();
  const router = useRouter();

  // Reset semua state ke kondisi awal
  const resetToInitialState = () => {
    stopScan();
    stopCamera();
    setActiveTab("camera");
    setUploadedImage(null);
    setScanning(false);
    setCameraActive(false);

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
  };

  // Fungsi verifikasi data langsung fetch
  const verifyData = async (encoded: string) => {
    try {
      const decoded = decoder<{ p: string; s: string }>(encoded);

      const finalData = {
        payloadId: decoded.p,
        signature: decoded.s,
      };

      const { data } = await fetcher<TrashVerifyData>({
        url: "/api/trash/verify",
        data: finalData,
        method: "post",
        config: { withCredentials: true },
      });

      if (!data) throw new Error("Data verifikasi tidak ditemukan");

      setQRData(data);
      toast.success("Verifikasi berhasil");

      // Reset ke kondisi awal setelah berhasil
      setTimeout(() => {
        resetToInitialState();
      }, 500);

      router.push("/trash/submit");
    } catch (error) {
      console.error("trash Verify error:", error);
      toast.error((error as Error).message || "Terjadi kesalahan");

      // Reset ke kondisi awal setelah error
      setTimeout(() => {
        resetToInitialState();
      }, 1000);
    }
  };

  // Start camera stream
  const startCamera = async () => {
    if (
      !selectedDeviceId ||
      !videoRef.current ||
      !codeReader.current ||
      !mountedRef.current
    )
      return;

    try {
      let constraints = {
        video: {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: { ideal: "environment" },
        },
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (error) {
        console.warn(
          "Failed with exact deviceId, trying without exact constraint:",
          error,
        );
        constraints = {
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: "environment" },
          },
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      }

      if (videoRef.current && mountedRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);

        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
    } catch (error) {
      console.error("Camera start error:", error);
      toast.error(`Tidak dapat mengakses kamera: ${(error as Error).message}`);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (videoRef.current && mountedRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (fallbackError) {
        console.error("Fallback camera error:", fallbackError);
        toast.error("Tidak dapat mengakses kamera apapun.");
      }
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Start scanning QR code
  const startScan = async () => {
    if (
      !selectedDeviceId ||
      !videoRef.current ||
      !codeReader.current ||
      !mountedRef.current ||
      !cameraActive
    )
      return;

    if (scanningRef.current) return;

    scanningRef.current = true;
    setScanning(true);

    try {
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        async (result) => {
          if (result && scanningRef.current && mountedRef.current) {
            scanningRef.current = false;
            codeReader.current?.reset();
            setScanning(false);

            startTransition(async () => {
              await verifyData(result.getText());
            });
          }
        },
      );
    } catch (e) {
      scanningRef.current = false;
      setScanning(false);
      console.error("Scan error:", e);
    }
  };

  // Stop scanning
  const stopScan = () => {
    scanningRef.current = false;
    setScanning(false);
    codeReader.current?.reset();
  };

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;

    // Clean up current tab
    if (activeTab === "camera") {
      stopScan();
      stopCamera();
    } else if (activeTab === "upload" && uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }

    setActiveTab(tab);
  };

  // Handle camera tab actions
  const handleCameraAction = async () => {
    if (!cameraActive) {
      await startCamera();
      setTimeout(() => {
        if (mountedRef.current) {
          startScan();
        }
      }, 500);
    } else if (scanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  // Scan dari gambar (upload)
  const handleScanFromImage = async (file: File) => {
    const img = document.createElement("img");
    const imageUrl = URL.createObjectURL(file);
    img.src = imageUrl;

    setUploadedImage(imageUrl);
    setScanning(true);

    img.onload = async () => {
      try {
        const result = await codeReader.current?.decodeFromImage(img);
        if (result) {
          setScanning(false);
          startTransition(async () => {
            await verifyData(result.getText());
          });
        } else {
          setScanning(false);
          toast.error("Gagal membaca QR code dari gambar.");
        }
      } catch {
        setScanning(false);
        toast.error("Gagal membaca QR code dari gambar.");
      }
    };

    img.onerror = () => {
      setScanning(false);
      toast.error("Gagal memuat gambar.");
      URL.revokeObjectURL(imageUrl);
      setUploadedImage(null);
    };
  };

  // Clear uploaded image
  const clearUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
      setUploadedImage(null);
    }
  };

  // Initialize cameras on mount
  useEffect(() => {
    mountedRef.current = true;
    codeReader.current = new BrowserMultiFormatReader();

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (!mountedRef.current) return;

        stream.getTracks().forEach((track) => track.stop());

        codeReader.current
          ?.listVideoInputDevices()
          .then((videoInputDevices) => {
            if (!mountedRef.current) return;

            setDevices(videoInputDevices);

            console.log(videoInputDevices);

            if (videoInputDevices.length > 0) {
              let defaultCamera = videoInputDevices.find(
                (device) =>
                  !device.label.toLowerCase().includes("front") &&
                  !device.label.toLowerCase().includes("user") &&
                  !device.label.toLowerCase().includes("virtual"),
              );

              if (!defaultCamera) {
                defaultCamera = videoInputDevices.find(
                  (device) =>
                    device.label.toLowerCase().includes("back") ||
                    device.label.toLowerCase().includes("rear") ||
                    device.label.toLowerCase().includes("environment"),
                );
              }

              if (!defaultCamera) {
                defaultCamera = videoInputDevices[0];
              }

              setSelectedDeviceId(defaultCamera.deviceId);
              console.log(defaultCamera);
            }
          })
          .catch((error) => {
            console.error("Error listing video devices:", error);
          });
      })
      .catch((error) => {
        console.error("Camera permission error:", error);
        toast.error(
          "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.",
        );
      });

    return () => {
      mountedRef.current = false;
      resetToInitialState();
      codeReader.current = null;
    };
  }, []);

  // Upload image handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !mountedRef.current) return;

    await handleScanFromImage(file);
    e.target.value = "";
  };

  // Toggle kamera depan/belakang
  const toggleCamera = () => {
    if (devices.length < 2 || !mountedRef.current || !scanning) return;

    const currentIndex = devices.findIndex(
      (d) => d.deviceId === selectedDeviceId,
    );
    const nextIndex = (currentIndex + 1) % devices.length;

    stopScan();
    stopCamera();

    setSelectedDeviceId(devices[nextIndex].deviceId);

    setTimeout(async () => {
      if (mountedRef.current) {
        await startCamera();
        setTimeout(() => {
          if (mountedRef.current) {
            startScan();
          }
        }, 500);
      }
    }, 300);
  };

  const getCameraButtonText = () => {
    if (!cameraActive) return "Mulai Kamera";
    if (scanning) return "Stop Scan";
    return "Mulai Scan";
  };

  const getCameraButtonIcon = () => {
    if (!cameraActive) return <Camera className="mr-2 h-4 w-4" />;
    if (scanning) return <Square className="mr-2 h-4 w-4" />;
    return <Camera className="mr-2 h-4 w-4" />;
  };

  return (
    <RootLayout header={<SimpleNavbar />} footer={<Footer />}>
      <section className="flex min-h-screen w-full items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="mb-4 text-xl font-semibold">
            Verifikasi QR Code Setor Sampah
          </h1>

          {/* Tab Navigation */}
          <div className="mb-4 flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => handleTabChange("camera")}
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "camera"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Camera className="mr-2 inline-block h-4 w-4" />
              Kamera
            </button>
            <button
              onClick={() => handleTabChange("upload")}
              className={cn(
                "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
                activeTab === "upload"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              <Upload className="mr-2 inline-block h-4 w-4" />
              Upload
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-background relative mb-4 aspect-square w-full overflow-hidden rounded-md">
            {activeTab === "camera" ? (
              <>
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  autoPlay
                  style={{ display: cameraActive ? "block" : "none" }}
                />

                {!cameraActive && (
                  <div className="absolute inset-0 flex w-full items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">
                        {'Klik "Mulai Kamera" untuk memulai'}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {uploadedImage ? (
                  <div className="relative h-full">
                    <Image
                      width={200}
                      height={200}
                      src={uploadedImage}
                      alt="Uploaded QR"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={clearUploadedImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex w-full items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                      <p className="text-gray-500">Pilih gambar QR code</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Loading Overlay */}
            {(scanning || isPending) && (
              <div className="bg-opacity-50 text-foreground absolute inset-0 flex w-full items-center justify-center bg-black/70">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
                  <p>{isPending ? "Memproses..." : "Memindai..."}</p>
                </div>
              </div>
            )}
          </div>

          {/* Tab Content Actions */}
          {activeTab === "camera" ? (
            <div className="flex gap-2">
              <Button
                onClick={handleCameraAction}
                disabled={isPending}
                variant={scanning ? "destructive" : "default"}
                className="flex-1 cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
              >
                {getCameraButtonIcon()}
                {getCameraButtonText()}
              </Button>

              {scanning && devices.length > 1 && (
                <Button
                  variant="outline"
                  onClick={toggleCamera}
                  disabled={isPending}
                  className="px-3"
                  title="Ganti Kamera"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              {uploadedImage ? (
                <Button
                  onClick={clearUploadedImage}
                  disabled={isPending}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Hapus Gambar
                </Button>
              ) : (
                <Button
                  asChild
                  disabled={isPending}
                  className="flex-1 cursor-pointer bg-[linear-gradient(270deg,var(--chart-1),var(--chart-2),var(--chart-3),var(--chart-4))] bg-[length:200%_200%] shadow transition-all duration-300 hover:shadow-[0_0_10px_4px_rgba(166,255,0,0.4)]"
                >
                  <label className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Pilih Gambar QR
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isPending}
                    />
                  </label>
                </Button>
              )}
            </div>
          )}
        </Card>
      </section>
    </RootLayout>
  );
}
