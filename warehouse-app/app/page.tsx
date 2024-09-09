import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Warehouse Dashboard
          </h1>
          <div className="flex flex-col space-y-4">
            <Link href="/picking" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all">
              Picking List
            </Link>
            <Link href="/packing" className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all">
              Packing Orders
            </Link>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p>
          Cozey Assessment
        </p>
      </footer>
    </div>
  );
}
