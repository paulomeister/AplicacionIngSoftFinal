import Image from 'react-bootstrap/Image';
import NextImage from "next/image";
import {Divider} from "@nextui-org/divider";
import {Button} from "@nextui-org/react";
import {Link} from "@nextui-org/link";

export default function Hero() {
  return (
    <>
    <div className="container flex flex-col md:flex-row gap-8 md:gap-x-12 w-full">
      <div className="flex flex-col justify-center md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-black  mb-4">Comparte tu conocimiento con el mundo</h1>
        <p className="text-lg md:text-xl mb-4">
          Publica tus documentos más valiosos y únete a la comunidad de innovadores en tecnología. Desde desarrollos en inteligencia artificial hasta análisis de datos, cada aporte cuenta.
          Haz clic en el botón de abajo y empieza a generar impacto hoy mismo.
        </p>
        <Button as={Link}  href="/document/new" color="primary" size="lg">Sube tu documento ahora</Button>
      </div>
      <div className="md:w-1/2">
        <Image
          src="/Hero_icons_large.png" 
          className="w-full h-auto object-fit-cover"
        />
      </div>
    </div>
    <Divider className="my-4" />
    </>
  );
}