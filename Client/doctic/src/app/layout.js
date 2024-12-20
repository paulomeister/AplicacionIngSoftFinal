"use client"; // Asegúrate de que esté aquí solo si este archivo está manejando estado de cliente

import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./context/AuthContext";

const font = Roboto_Flex({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

// export const metadata = {
//   title: "DocTIC | Gestión y Publicación de Documentos Académicos",
//   description:
//     "DocTIC es una plataforma académica para la gestión, publicación y consulta de documentos. Facilita el acceso a recursos educativos, permitiendo a estudiantes y docentes compartir, valorar y comentar investigaciones, proyectos y trabajos académicos.",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased min-h-screen`}>
        {/* Coloca el AuthProvider aquí para envolver todo el contenido */}
        <AuthProvider>
          <NextUIProvider>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow justify-center">
                {children}
              </main>
            </div>
          </NextUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
