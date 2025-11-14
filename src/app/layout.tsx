import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StyledComponentsRegistry from "@/lib/styled-components";
import { AppShell } from "@/components/AppShell";
import { ToastProvider } from "@/components/shared/Toast/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quarterly Task Planner",
  description:
    "Plan and visualise work across quarters with week-by-week highlighting for every task.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StyledComponentsRegistry>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
