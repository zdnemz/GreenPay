"use client";

import * as React from "react";

import { withAuth } from "@/hoc/withAuth";

export default withAuth(
  function ({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
  },
  undefined,
  ["USER"],
);

// export default function Layout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return children;
// }
