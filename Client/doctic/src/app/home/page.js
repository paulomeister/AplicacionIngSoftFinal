import RecentDocuments from './components/RecentDocuments';
import Hero from './components/Hero.jsx';

export default function HomePage() {
  return (
    <div className="container min-h-screen text-black flex flex-col w-full">
      <section className='container'>
        <Hero/>
      </section>
      <section className="container px-6 py-8">
      <RecentDocuments />
      </section>
      
    </div>
  );
}
