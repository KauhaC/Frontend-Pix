// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Banco Pix",
  description: "Sistema Pix Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
