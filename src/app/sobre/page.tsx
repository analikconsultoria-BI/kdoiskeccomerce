import * as React from "react";
import { Target, Eye, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Benefits } from "@/components/home/Sections";
import Link from "next/link";

export default function Sobre() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-brand-50 py-16 md:py-24 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6">Sobre a KdoisK</h1>
          <p className="text-lg md:text-xl text-gray-600">Soluções essenciais para o seu dia a dia de forma rápida e prática.</p>
        </div>
      </section>

      {/* História */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 aspect-video bg-gray-100 rounded-2xl md:order-1 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-900/10"></div>
          </div>
          <div className="w-full md:w-1/2 md:order-2">
            <h2 className="text-3xl font-bold text-brand-900 mb-6">Nossa História</h2>
            <div className="prose prose-brand text-gray-700 leading-relaxed space-y-4">
              <p>
                A KdoisK nasceu da necessidade de encontrar soluções rápidas e essenciais para problemas cotidianos. 
                Percebemos que muitas vezes as pessoas perdem tempo procurando itens básicos, como pilhas, ou utilidades 
                que deveriam ser fáceis de adquirir.
              </p>
              <p>
                Nossa filosofia é simples: <strong>achou rápido, resolveu, comprou.</strong> Reduzimos o atrito da compra 
                para que você possa focar no que realmente importa na sua vida. Selecionamos cuidadosamente cada produto 
                do nosso catálogo, garantindo qualidade e confiabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MVV */}
      <section className="py-16 md:py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-brand-700" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Fornecer acesso rápido, seguro e descomplicado a produtos de utilidade essencial para o dia a dia.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-brand-700" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser o e-commerce de referência em facilidade e agilidade de compra para demandas rotineiras.
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-brand-700" />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-4">Valores</h3>
              <p className="text-gray-600">
                Praticidade, Honestidade, Exceder expectativas, Qualidade em cada detalhe.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios Reutilizados */}
      <Benefits />

      {/* CTA Final */}
      <section className="bg-brand-900 text-white py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Pronto para resolver seu problema?</h2>
          <p className="text-brand-200 mb-10 text-lg">
            Navegue por nossas categorias e encontre a solução que você precisa.
          </p>
          <Link href="/loja">
            <Button size="lg" className="px-10 text-lg shadow-xl shadow-orange-500/20">
              Conheça nossos produtos
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
