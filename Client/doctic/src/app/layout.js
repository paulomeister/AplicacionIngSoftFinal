import localFont from "next/font/local";
import "./globals.css";
import Navbar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "DocTIC | Gestión y Publicación de Documentos Académicos",
  description: "DocTIC es una plataforma académica para la gestión, publicación y consulta de documentos. Facilita el acceso a recursos educativos, permitiendo a estudiantes y docentes compartir, valorar y comentar investigaciones, proyectos y trabajos académicos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased d-flex flex-column h-vh`}>
        <Navbar /> 
        <main className="flex-grow-1 d-flex justify-content-center w-full p-4">
          {children}
        </main>
      </body>
    </html>
  );G
}
