"use client";

import { withAuth } from "@/hoc/withAuth";
import React from "react";

export default withAuth(
  function ({ children }: { children: React.ReactNode }) {
    return children;
  },
  undefined,
  ["ADMIN"],
);
