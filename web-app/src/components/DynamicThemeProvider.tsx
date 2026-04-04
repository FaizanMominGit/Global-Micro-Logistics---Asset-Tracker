"use client";

import dynamic from "next/dynamic";
import * as React from "react";
import type { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeProvider = dynamic(
  () => import("@/components/ThemeProvider").then((mod) => mod.ThemeProvider),
  {
    ssr: false,
    loading: () => <React.Fragment />,
  }
);

export function DynamicThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
