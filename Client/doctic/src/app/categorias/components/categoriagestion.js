"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Input, Textarea, Button } from "@nextui-org/react";
import { AuthContext } from "app/app/context/AuthContext";

const CategoriesManager = () => {
  const { notificacionDeExito, notificacionDeError } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    subcategorias: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategoriesWithSubcategories(); // Cargar categorías y subcategorías una vez al inicio
  }, []);

  const fetchCategoriesWithSubcategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/Categorias/allDistinct"
      );
      const distinctCategories = response.data;

      const categoriesWithSubcategories = await Promise.all(
        distinctCategories.map(async (categoryName) => {
          const categoryResponse = await axios.get(
            `http://localhost:8080/api/Categorias/getByName/${categoryName}`
          );
          const categoryData = categoryResponse.data[0];

          const subcategoriesWithNames = categoryData.subcategorias.map(
            (subcat) => ({
              categoriaId: subcat.categoriaId,
              nombre: subcat.nombre,
            })
          );

          return {
            _id: categoryData._id,
            nombre: categoryData.nombre,
            descripcion: categoryData.descripcion,
            imagen: categoryData.imagen,
            subcategorias: subcategoriesWithNames,
          };
        })
      );

      setCategories(categoriesWithSubcategories);
    } catch (error) {
      console.error("Error fetching categories with subcategories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubcategorySelection = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = categories.find((cat) => cat._id === selectedId);
    if (selectedCategory) {
      setForm((prevForm) => ({
        ...prevForm,
        subcategorias: [
          ...prevForm.subcategorias,
          {
            categoriaId: selectedCategory._id,
            nombre: selectedCategory.nombre,
          },
        ],
      }));
    }
  };

  const createCategory = async () => {
    const newCategoryData = {
      ...form,
      subcategorias: form.subcategorias.map((sub) => ({
        categoriaId: sub.categoriaId,
      })),
    };

    console.log("Datos enviados para creación de categoría:", newCategoryData);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/Categorias/create",
        newCategoryData
      );
      setCategories([...categories, response.data]);
      setForm({ nombre: "", descripcion: "", imagen: "", subcategorias: [] });
      notificacionDeExito("Categoría creada");
    } catch (error) {
      notificacionDeError("Categoría no fue creada");
      console.error("Error creating category:", error);
    }
  };

  const startEditing = (category) => {
    setForm({
      _id: category._id,
      nombre: category.nombre,
      descripcion: category.descripcion,
      imagen: category.imagen,
      subcategorias: category.subcategorias.map((sub) => ({
        categoriaId: sub.categoriaId,
        nombre: sub.nombre,
      })),
    });
    setEditId(category._id);
    setIsEditing(true);
  };

  const updateCategory = async () => {
    const updatedCategoryData = {
      ...form,
      subcategorias: form.subcategorias.map((sub) => ({
        categoriaId: sub.categoriaId,
      })),
    };

    console.log(
      "Datos enviados para actualización de categoría:",
      updatedCategoryData
    );

    try {
      const response = await axios.put(
        `http://localhost:8080/api/Categorias/update/${editId}`,
        updatedCategoryData
      );
      setCategories(
        categories.map((cat) => (cat._id === editId ? response.data : cat))
      );
      setForm({ nombre: "", descripcion: "", imagen: "", subcategorias: [] });
      setIsEditing(false);
      setEditId(null);
      notificacionDeExito(
        "Categoría actualizada: ",
        updatedCategoryData.nombre
      );
      setTimeout(() => (window.location.href = "/categorias"), 5000);
    } catch (error) {
      console.error("Error updating category:", error);
      notificacionDeError(
        "No se pudo actualizar la categoría " + updatedCategoryData.nombre
      );
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta categoría?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/Categorias/delete/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      notificacionDeExito("Categoría eliminada correctamente");
      setTimeout(() => (window.location.href = "/categorias"), 5000);
    } catch (error) {
      console.error("Error deleting category:", error);
      notificacionDeError("No se pudo eliminar la categoría :( ");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Gestión de Categorías</h1>

      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3>{isEditing ? "Actualizar Categoría" : "Crear Categoría"}</h3>
          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre de la categoría"
            size="lg"
            className="mb-4"
          />
          <Textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción de la categoría"
            size="lg"
            className="mb-4"
          />
          <Input
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            placeholder="URL de la imagen"
            size="lg"
            className="mb-4"
          />
          <label>Subcategorías</label>
          <select
            onChange={handleSubcategorySelection}
            className="mb-4"
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">Selecciona una subcategoría</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-center">
            {isEditing ? (
              <Button
                onClick={updateCategory}
                className="bg-green-700 text-white"
                size="lg"
              >
                Actualizar
              </Button>
            ) : (
              <Button onClick={createCategory} color="primary" size="lg">
                Crear
              </Button>
            )}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
          }}
        >
          <h3>Categorías y Subcategorías</h3>
          {categories.map((category) => (
            <div
              key={category._id}
              className="mb-4"
              style={{
                marginBottom: "16px",
                padding: "8px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <h4>{category.nombre}</h4>
              <p>{category.descripcion}</p>
              <ul>
                {category.subcategorias.length === 0 ? (
                  <li>No hay subcategorías</li>
                ) : (
                  category.subcategorias.map((sub, index) => (
                    <li key={index}>{sub.nombre}</li>
                  ))
                )}
              </ul>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Button
                  onClick={() => startEditing(category)}
                  color="primary"
                  size="sm"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => deleteCategory(category._id)}
                  color="error"
                  size="sm"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesManager;
