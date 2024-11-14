"use client";

import RecentDocuments from "./components/RecentDocuments";
import Hero from "./components/Hero.jsx";
import CategoriesCarousel from "./components/ListCategories"; // Importa correctamente el carrusel de categorías
import { useEffect } from "react";

export default function HomePage() {
  return (
    <div className="container min-h-screen text-black flex flex-col w-full">
      <section className="container">
        <Hero />
      </section>
      <section className="container px-6 py-8">
        <CategoriesCarousel /> {/* Asegúrate de que el componente esté bien importado */}
      </section>
      <section className="container px-6 py-8">
        <RecentDocuments />
      </section>
    </div>
  );
}

