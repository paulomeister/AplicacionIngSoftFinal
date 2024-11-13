import { Button } from "@nextui-org/button";
import FormPassword from "./components/FormPassword";
import Link from "next/link";

export default function forgotPasswordPage() {
  return (
    <div className="container w-full flex justify-center align-content-center mb-32 shadow-lg p-3">
      <section className=" flex items-center justify-center flex-col">
        <p className="text-3xl bg-blue-600 text-white p-5 rounded-lg">Recuperar contraseña🔑</p>
        <FormPassword />
        <Button color="primary" variant="light">
          <Link className="text-base mt-4" href={"/login"}>
            Regresar al Login
          </Link>
        </Button>
      </section>
    </div>
  );
}
