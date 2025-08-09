"use client";

import { Suspense, useEffect } from "react";
import { useLoading } from "@/hooks/useLoading";

function SuspenseFallbackHandler() {
  const { startLoading, stopLoading } = useLoading("suspense");

  useEffect(() => {
    startLoading();
    return () => stopLoading();
  }, [startLoading, stopLoading]);

  return null;
}

export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
) {
  return function WrappedWithSuspense(props: P) {
    return (
      <Suspense fallback={<SuspenseFallbackHandler />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
