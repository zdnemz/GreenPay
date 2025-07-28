"use client";

import * as React from "react";
import { withAuth } from "@/hoc/withAuth";
import RootLayout from "@/components/layouts/RootLayout";

export default withAuth(
  function () {
    return (
      <RootLayout>
        <h1>Hello World</h1>
      </RootLayout>
    );
  },
  "/",
  ["USER", "ADMIN"],
);
