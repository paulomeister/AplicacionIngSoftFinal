// src/app/page.js
import Navbar from './components/NavBar'; // Asegúrate de que la ruta sea correcta

export default function Home() {
  return (
    <div>
      <Navbar /> {/* Aquí se integra el Navbar */}
      <h1>This is the homepage</h1>
    </div>
  );
}
