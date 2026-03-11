import type { Metadata } from "next";
import { AppProviders } from "../providers/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Manager - Kiip",
  description: "Gerenciamento de tarefas para times",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-page text-text-primary antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
