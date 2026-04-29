import dynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';

const CarrinhoClient = dynamic(() => import('@/components/carrinho/CarrinhoClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-warm-50">
      <div className="animate-pulse text-brand-300 font-black tracking-tighter text-4xl">KdoisK</div>
    </div>
  ),
});

export default function Page() {
  return <CarrinhoClient />;
}
