"use client"
import { useContext } from "react";
import { AuthContext } from "app/app/context/AuthContext.js";
import { PublicationForm } from "./components/PublicationForm.jsx";

export default function NewDocument() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        isLoggedIn ? <PublicationForm /> : window.location.href = "/error404"
    );
}
