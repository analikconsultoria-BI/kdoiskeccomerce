import React from 'react';
import dynamic from 'next/dynamic';

const CheckoutClient = dynamic(() => import('@/components/checkout/CheckoutClient'), {
  ssr: false,
  loading: () => <div className="min-h-screen flex items-center justify-center bg-warm-50">
    <div className="animate-pulse text-brand-300 font-black tracking-tighter text-4xl">KdoisK</div>
  </div>
});

export default function Page() {
  return <CheckoutClient />;
}
