"use client";
// page.js
import React, { useContext, useEffect, useState } from "react";
import CategoriesManager from "./components/categoriagestion"; // Importa el componente
import { AuthContext } from "../context/AuthContext";

export default function Page() {
  const { user } = useContext(AuthContext);
  const [esAdmin, setEsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user.esAdmin) {
      setEsAdmin(true);
    }

    setIsLoading(false);
  }, [user]);

  return (
    !isLoading && (
      <div>
        <CategoriesManager />
      </div>
    )
  );
}
