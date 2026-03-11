// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Find your next career move
        </h1>
        <p className="mt-4 text-gray-600">
          Search thousands of jobs — apply in one click.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded"
          >
            Browse Jobs
          </Link>
          <Link href="/register" className="px-6 py-3 border rounded">
            Get Started
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Popular categories</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded">Frontend</div>
          <div className="p-4 border rounded">Backend</div>
          <div className="p-4 border rounded">DevOps</div>
          <div className="p-4 border rounded">Design</div>
        </div>
      </section>
    </div>
  );
}
