import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Toaster } from "@/components/ui/toaster";

// Metadados centralizados para PWA e SEO
export const metadata: Metadata = {
  title: 'Nova CNH 2026',
  description: 'Teste atualizado para aprender e treinar com regras de 2026.',
  manifest: '/manifest.json',
  icons: {
    // Ícone padrão para navegadores e favicon.ico fallback
    icon: '/icon-192x192.png',
    // Ícone para dispositivos Apple (tela inicial)
    apple: '/icon-192x192.png',
  },
};

// Configuração da Viewport e Tema
export const viewport: Viewport = {
  themeColor: '#00153B', // Cor da barra de status (Azul Royal)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
