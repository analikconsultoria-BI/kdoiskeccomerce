'use client';

import dynamicImport from 'next/dynamic';

export const dynamic = 'force-dynamic';

const CheckoutClient = dynamicImport(() => import('@/components/checkout/CheckoutClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-4xl">Carregando...</div>
    </div>
  ),
});

export default function Page() {
  return <CheckoutClient />;
}
