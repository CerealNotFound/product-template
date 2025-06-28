import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-1 py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
        <Image
          src="/next.svg"
          alt="Product Logo"
          width={48}
          height={48}
          className="mb-6"
        />
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
          The [Product] workspace
          <br />
          that works for you.
        </h1>
        <p className="text-lg sm:text-2xl text-gray-600 mb-8 max-w-2xl">
          One place where teams find every answer, automate the busywork, and
          get projects done.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="#"
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Get [Product] free
          </a>
          <a
            href="#"
            className="bg-gray-100 text-black px-6 py-3 rounded-full font-semibold border border-gray-300 hover:bg-gray-200 transition"
          >
            Request a demo
          </a>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6 opacity-80 mt-4">
          {/* Dummy trusted by logos */}
          <Image src="/vercel.svg" alt="Logo1" width={80} height={24} />
          <Image src="/next.svg" alt="Logo2" width={80} height={24} />
          <Image src="/globe.svg" alt="Logo3" width={40} height={40} />
          <Image src="/file.svg" alt="Logo4" width={40} height={40} />
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src="/file.svg" alt="Feature 1" width={32} height={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">AI Meeting Notes</h3>
            <p className="text-gray-600 text-sm">
              Perfect notes every time. Let AI handle your meeting summaries.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src="/globe.svg" alt="Feature 2" width={32} height={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Enterprise Search</h3>
            <p className="text-gray-600 text-sm">
              One search for everything. Find docs, people, and projects
              instantly.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="mb-4">
              <Image src="/window.svg" alt="Feature 3" width={32} height={32} />
            </div>
            <h3 className="font-bold text-lg mb-2">Automate Workflows</h3>
            <p className="text-gray-600 text-sm">
              Automate repetitive tasks and focus on what matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-100 mt-auto">
        © {new Date().getFullYear()} [Product]. All rights reserved.
      </footer>
    </div>
  );
}
