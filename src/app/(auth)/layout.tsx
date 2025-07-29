"use client";

import * as React from "react";

import { withGuest } from "@/hoc/withAuth";

export default withGuest(function ({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
});
