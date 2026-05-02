import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header — Same brand color as store */}
      <header className="bg-brand-600 py-5">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-black text-white tracking-tight group-hover:opacity-90 transition-opacity">
              KdoisK
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Ambiente seguro
          </div>
          
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="/termos" className="hover:text-brand-600 transition-colors">Termos</Link>
            <Link href="/privacidade" className="hover:text-brand-600 transition-colors">Privacidade</Link>
            <Link href="/contato" className="hover:text-brand-600 transition-colors">Ajuda</Link>
          </div>

          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} KdoisK
          </p>
        </div>
      </footer>
    </div>
  );
}
