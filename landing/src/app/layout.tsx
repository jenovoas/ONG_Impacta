import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Impacta+ — Plataforma SaaS para ONGs y Conservación',
  description: 'Gestión transparente de socios, donaciones, biblioteca de especies y misiones de campo para organizaciones ecológicas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="bg-[#0e0e0e] text-[#e5e2e1] antialiased selection:bg-[#00a8ff]/30 selection:text-[#95ccff]">
        {children}
      </body>
    </html>
  );
}
