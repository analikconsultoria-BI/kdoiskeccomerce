'use client';

import dynamic from 'next/dynamic';

const CarrinhoClient = dynamic(() => import('@/components/carrinho/CarrinhoClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-4xl">Carregando...</div>
    </div>
  ),
});

export default function Page() {
  return <CarrinhoClient />;
}
