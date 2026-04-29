'use client';

import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';

const CheckoutClient = dynamicImport(() => import('@/components/checkout/CheckoutClient'), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-4xl">Carregando...</div>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}
