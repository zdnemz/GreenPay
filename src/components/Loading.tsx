export default function Loading() {
  return (
    <div className="bg-background fixed z-[999] flex h-screen w-full touch-none items-center justify-center overflow-hidden">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
    </div>
  );
}
