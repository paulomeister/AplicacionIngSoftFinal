import {Button} from "@nextui-org/button";
import FormPassword from "./components/FormPassword";
import Link from "next/link";

export default function forgotPasswordPage () {
  return (
    <div className="container w-full flex justify-center align-content-center">
      <section>
        <p>Recuperar contraseña</p>
        <FormPassword/>
        <Button color="primary" variant="light"><Link href={"/login"}>Regresar al Login</Link></Button>
      </section>
    </div>
  );
}