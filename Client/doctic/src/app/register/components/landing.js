import Image from "next/image";

export default function Landing() {
  return (
    <section className="w-1/2 h-screen fixed left-0 top-0 bg-gradient-to-br from-blue-900 to-blue-500">
      <div className="flex flex-col justify-center items-center h-full px-8 py-12 text-white">
        <div className="max-w-xl text-center">
          <h1 className="text-5xl font-bold mb-6">Únete a nuestra comunidad</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Comparte tus ideas y contribuye a proyectos innovadores.
            Únete hoy y haz una diferencia en la tecnología.
          </p>
          <div className="relative w-full max-w-md mx-auto mb-8">
            <Image
              src="/Hero_icons.png"
              alt="Community"
              width={400}
              height={400}
              className="rounded-xl shadow-2xl"
              priority
            />
          </div>
          <p className="text-lg italic">
            Explora lo que puedes lograr al compartir tus conocimientos.
          </p>
        </div>
      </div>
    </section>
  );
}
