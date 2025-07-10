import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { NotifierProvider } from "@/context/NotifierContext";
import Notification from "@/components/Notification";

export const metadata: Metadata = {
  title: "SSC - Alcaldia de Medellin",
  description: "Sistema de Seguimiento de Contratos - Alcaldía de Medellín",
  keywords: ["contratos", "seguimiento", "alcaldía", "medellín", "gobierno", "secretaria de infraestructura"],
  authors: [{ name: "Alcaldía de Medellín" }],
  creator: "Alcaldía de Medellín",
  publisher: "Alcaldía de Medellín",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" href="https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/04/cropped-favicon-1-1-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/04/cropped-favicon-1-1-192x192.png" sizes="192x192" />
        <link rel="apple-touch-icon" type="image/png" href="https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/04/cropped-favicon-1-1-180x180.png" />
        <meta name="msapplication-TileImage" content="https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/04/cropped-favicon-1-1-270x270.png" />
      </head>
      <body className="bg-pattern min-h-screen">
        <AuthProvider>
          <NotifierProvider>
            {children}
            <Notification />
          </NotifierProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
