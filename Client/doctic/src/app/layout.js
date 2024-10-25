import { Roboto_Flex } from 'next/font/google';
import "./globals.css";
import Navbar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {NextUIProvider} from "@nextui-org/react";

const font = Roboto_Flex({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin']
});

export const metadata = {
  title: "DocTIC | Gestión y Publicación de Documentos Académicos",
  description: "DocTIC es una plataforma académica para la gestión, publicación y consulta de documentos. Facilita el acceso a recursos educativos, permitiendo a estudiantes y docentes compartir, valorar y comentar investigaciones, proyectos y trabajos académicos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased d-flex flex-column h-vh`}>
        <NextUIProvider>
            <Navbar /> 
            <main className='container mx-auto flex justify-center p-4'>
              {children}
            </main>
        </NextUIProvider>
      </body>
    </html>
  );G
}
