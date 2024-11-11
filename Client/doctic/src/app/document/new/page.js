"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "app/app/context/AuthContext.js";
import { PublicationForm } from "./components/PublicationForm.jsx";

export default function NewDocument() {
  return <PublicationForm />;
  //
  //   ) : (
  //     (window.location.href = "/error404")
  //   );
}
