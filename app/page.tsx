import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold">
        AasaMedChem
      </h1>

      <p className="mt-4 text-lg">
        Inventory & Order Management System
      </p>

      <Link
        href="/login"
        className="mt-8 border px-6 py-3 rounded"
      >
        Login
      </Link>

    </div>
  );
}