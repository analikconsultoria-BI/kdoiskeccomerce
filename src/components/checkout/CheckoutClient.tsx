"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, CreditCard, QrCode, ClipboardCheck, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutClient() {
  const { cart, subtotal } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = React.useState<"pix" | "card">("pix");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted && cart.length === 0) {
      router.push('/carrinho');
    }
  }, [cart, router, mounted]);

  if (!mounted) return null;

  // Itens do pedido do carrinho real
  const orderItems = cart.map((item) => ({
    id: item.id,
    name: item.product?.name || "Produto",
    quantity: item.quantity
  }));

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      console.log("Verificando estoque em tempo real...");
      
      const stockChecks = await Promise.all(
        orderItems.map(async (item) => {
          const res = await fetch(`/api/produtos/${item.id}`, { cache: 'no-store' });
          if (!res.ok) return { id: item.id, name: item.name, inStock: false };
          const data = await res.json();
          return { id: item.id, name: item.name, inStock: data.inStock };
        })
      );

      const outOfStockItems = stockChecks.filter(item => !item.inStock);

      if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems.map(i => i.name).join(", ");
        throw new Error(`Infelizmente os seguintes itens acabaram de esgotar: ${itemNames}`);
      }

      window.location.href = "/sucesso";
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const freight = subtotal > 250 ? 0 : 19.90;
  const discount = paymentMethod === "pix" ? subtotal * 0.05 : 0;
  const total = subtotal + freight - discount;

  if (cart.length === 0) return null;

  return (
    <div className="bg-warm-50 min-h-screen py-8 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 animate-shake">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between mb-10 pb-6 border-b border-brand-100/50">
          <Link href="/carrinho" className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-900 transition-colors uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Voltar ao carrinho
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-xl font-black text-brand-900 tracking-tighter">KdoisK</span>
             <span className="text-[7px] text-warm-400 font-bold uppercase tracking-[0.3em] -mt-0.5">Checkout Seguro</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" /> Encriptado
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-black text-sm">1</div>
                <h2 className="text-xl font-bold text-brand-900">Identificação</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">Seu E-mail</label>
                  <input type="email" placeholder="email@exemplo.com" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">Nome Completo</label>
                  <input type="text" placeholder="Como no documento" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-black text-sm">2</div>
                <h2 className="text-xl font-bold text-brand-900">Endereço de Entrega</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">CEP</label>
                  <input type="text" placeholder="00000-000" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">Rua / Logradouro</label>
                  <input type="text" placeholder="Ex: Av. Central" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">Número</label>
                  <input type="text" placeholder="123" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-warm-500 uppercase tracking-wide px-1">Bairro</label>
                  <input type="text" placeholder="Seu bairro" className="w-full h-12 px-4 rounded-xl border border-warm-200 bg-warm-50/50 focus:bg-white focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-all outline-none font-medium text-brand-900" />
                </div>
              </div>

              <div className="mt-8 p-5 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-between group cursor-pointer hover:bg-brand-100 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-accent-400" />
                   </div>
                   <div>
                      <p className="font-bold text-brand-900 text-sm">Transportadora Premium</p>
                      <p className="text-[11px] text-brand-600 font-medium">Entrega em até 3 dias úteis</p>
                   </div>
                </div>
                <div className="text-sm font-black text-brand-900">GRÁTIS</div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-brand-900 text-white flex items-center justify-center font-black text-sm">3</div>
                <h2 className="text-xl font-bold text-brand-900">Pagamento</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === "pix" ? "border-brand-600 bg-brand-50/50 shadow-md" : "border-warm-200 hover:border-brand-200"}`}
                >
                  <QrCode className={`w-8 h-8 ${paymentMethod === "pix" ? "text-brand-600" : "text-warm-400"}`} />
                  <div>
                    <p className="font-bold text-brand-900">Pix</p>
                    <p className="text-xs text-success font-bold">5% de desconto</p>
                  </div>
                </button>
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${paymentMethod === "card" ? "border-brand-600 bg-brand-50/50 shadow-md" : "border-warm-200 hover:border-brand-200"}`}
                >
                  <CreditCard className={`w-8 h-8 ${paymentMethod === "card" ? "text-brand-600" : "text-warm-400"}`} />
                  <div>
                    <p className="font-bold text-brand-900">Cartão de Crédito</p>
                    <p className="text-xs text-warm-500 font-medium">Até 10x sem juros</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="animate-fade-in space-y-4">
                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-warm-500 uppercase tracking-wide">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full h-12 px-4 rounded-xl border border-warm-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-500 uppercase tracking-wide">Validade</label>
                      <input type="text" placeholder="MM/AA" className="w-full h-12 px-4 rounded-xl border border-warm-200 outline-none font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-warm-500 uppercase tracking-wide">CVV</label>
                      <input type="text" placeholder="123" className="w-full h-12 px-4 rounded-xl border border-warm-200 outline-none font-medium" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="animate-fade-in p-6 bg-warm-100 rounded-2xl border border-warm-200/50 text-center">
                   <p className="text-sm text-warm-600 mb-2 font-medium">O QR Code será gerado após clicar em concluir.</p>
                   <p className="text-xs text-brand-500 font-bold uppercase tracking-widest">Aprovação instantânea</p>
                </div>
              )}
            </Card>
          </div>

          <aside className="sticky top-28 space-y-4">
            <Card className="p-6 border-brand-100/40 bg-warm-white shadow-(--shadow-card)">
              <h3 className="font-bold text-brand-900 mb-6 uppercase tracking-widest text-xs">Resumo do Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-bold text-warm-400 uppercase tracking-widest">
                  <span>Itens ({orderItems.length})</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-warm-400 uppercase tracking-widest">
                  <span>Frete</span>
                  <span className="text-success uppercase">Grátis</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-success uppercase tracking-widest">
                    <span>Desconto Pix</span>
                    <span>-{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discount)}</span>
                  </div>
                )}
              </div>
              
              <div className="divider-fade mb-6 opacity-40" />
              
              <div className="flex justify-between items-end mb-8">
                <span className="text-[10px] font-black text-warm-400 uppercase tracking-widest leading-none mb-1">Total à pagar</span>
                <span className="text-2xl font-black text-brand-900 leading-none">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </span>
              </div>

              <Button 
                size="lg" 
                fullWidth 
                className="h-14 tracking-[0.2em] font-black text-xs"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? "PROCESSANDO..." : "CONCLUIR PEDIDO"}
                {!isProcessing && <ClipboardCheck className="w-4 h-4 ml-2" />}
              </Button>
            </Card>

            <div className="p-6 rounded-2xl border-brand-100/50 bg-white/50 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <span className="text-[10px] font-black text-brand-900 uppercase tracking-widest">Segurança de Dados</span>
               </div>
               <p className="text-[10px] text-warm-500 leading-relaxed font-medium">
                Padrão de criptografia SSL 256 bits. Seus dados de pagamento não são armazenados em nossos servidores.
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
