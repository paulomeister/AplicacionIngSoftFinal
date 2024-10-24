import RecentDocuments from './components/RecentDocuments';

export default function HomePage() {
  return (
    <div className="container min-h-screen  text-black flex flex-col w-full">
      
      <main className="container px-6 py-8 flex-grow max-w-6xl ">
      <RecentDocuments />
      </main>
      
    </div>
  );
}
