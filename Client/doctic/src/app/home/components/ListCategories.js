import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Tooltip, Button } from "@nextui-org/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./CategoriesCarousel.css";

const CategoriesCarousel = () => {
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/Categorias/allDistinct");
        const categoryNames = response.data;

        const categoryData = await Promise.all(
          categoryNames.map(async (name) => {
            const res = await axios.get(`http://localhost:8080/api/Categorias/getByName/${name}`);
            return res.data[0];
          })
        );

        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Función para desplazar el carrusel hacia la izquierda
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 200;
    }
  };

  // Función para desplazar el carrusel hacia la derecha
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 200;
    }
  };

  return (
    <div className="carousel-wrapper">
      <h1 className="text-4xl font-bold text-left mb-8">Categorías</h1>

      <div className="carousel-controls">
        {/* Botón para desplazarse a la izquierda */}
        <Button auto onClick={scrollLeft} className="carousel-button">
          <FaChevronLeft size={20} />
        </Button>

        <div className="carousel-container" ref={carouselRef}>
          {categories.length === 0 ? (
            <p>No hay categorías para mostrar</p>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="category-item">
                <Tooltip content={category.descripcion}>
                  <img
                    src={category.imagen}
                    alt={category.nombre}
                    className="carousel-image"
                  />
                </Tooltip>
                <h4 className="text-center mt-2">{category.nombre}</h4>
              </div>
            ))
          )}
        </div>

        {/* Botón para desplazarse a la derecha */}
        <Button auto onClick={scrollRight} className="carousel-button">
          <FaChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default CategoriesCarousel;













