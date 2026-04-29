'use client';

import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const CarrinhoClient = dynamicImport(() => import('@/components/carrinho/CarrinhoClient'), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-4xl text-brand-300 font-black">Carregando...</div>
      </div>
    }>
      <CarrinhoClient />
    </Suspense>
  );
}
