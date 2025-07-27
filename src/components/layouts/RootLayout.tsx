import { cn } from "@/lib/utils";
import * as React from "react";

export interface RootLayoutProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const DEFAULT_PADDING =
  "*:px-6 *:sm:px-12 *:md:px-24 *:lg:px-36 *:xl:px-48 *:2xl:px-60";

export default function RootLayout({
  className,
  children,
  header,
  footer,
}: RootLayoutProps) {
  return (
    <>
      {header && (
        <header className={cn("fixed z-50 w-full *:py-3", DEFAULT_PADDING)}>
          {header}
        </header>
      )}
      <main
        className={cn(
          "relative min-h-screen w-full *:py-12 [&>:first-child]:pt-24 [&>:last-child]:pb-24",
          className,
          DEFAULT_PADDING,
        )}
      >
        {children}
      </main>
      {footer && <footer className={cn(DEFAULT_PADDING)}>{footer}</footer>}
    </>
  );
}
