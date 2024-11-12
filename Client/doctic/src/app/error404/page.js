import Image from "react-bootstrap/Image";

export default function Error404() {
  return (
    <div className="flex  items-center justify-center">
      <Image src="/Error404.jpg" className="w-full h-96 object-fit-contain" />
      <div>
        <h1 className="text-5xl text-blue-500">Auch</h1>
        <h3>No pudimos encontrar lo que estabas buscando :(</h3>
      </div>
    </div>
  );
}
