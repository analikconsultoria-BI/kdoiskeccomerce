"use client";

import * as React from "react";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { mockFaqs } from "@/lib/mockData";

export default function Contato() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white py-12 md:py-16 text-center border-b border-gray-100 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-4">Fale com a gente</h1>
        <p className="text-lg text-gray-600">Estamos aqui para resolver e responder suas dúvidas</p>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Formulário (Esquerda) */}
          <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-brand-900 mb-6">Envie sua mensagem</h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <Input placeholder="Seu nome" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <Input placeholder="(00) 00000-0000" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                  <option>Dúvida sobre produto</option>
                  <option>Status do meu pedido</option>
                  <option>Trocas e Devoluções</option>
                  <option>Outros assuntos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea 
                  rows={5}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
                  placeholder="Escreva sua mensagem aqui..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="terms" className="w-5 h-5 rounded border-gray-300 text-brand-700 focus:ring-brand-500" />
                <label htmlFor="terms" className="text-sm text-gray-600">Aceito receber comunicações da KdoisK.</label>
              </div>

              <Button size="lg" fullWidth type="submit" className="mt-4">
                Enviar Mensagem
              </Button>
            </form>
          </Card>


          {/* Informações (Direita) */}
          <div className="flex flex-col gap-6">
            <Card hoverable className="p-6 md:p-8 bg-green-500 text-white border-none relative overflow-hidden group">
              <div className="relative z-10">
                <MessageCircle className="w-12 h-12 mb-4" />
                <h4 className="text-2xl font-bold mb-2">Atendimento rápido</h4>
                <p className="mb-6 opacity-90 text-sm md:text-base">A forma mais rápida de falar conosco é pelo WhatsApp. Respondemos em poucos minutos.</p>
                <Button className="bg-white text-green-600 hover:bg-gray-100" size="md">
                  Chamar no WhatsApp
                </Button>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="w-48 h-48" />
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <Card hoverable className="p-6 flex flex-col items-start gap-4">
                 <div className="bg-brand-100 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-brand-700" />
                 </div>
                 <div>
                   <h5 className="font-bold text-gray-900 mb-1">Telefone</h5>
                   <p className="text-brand-700 font-medium">(11) 4002-8922</p>
                   <p className="text-sm text-gray-500 mt-1">Seg a Sex, 08h às 18h</p>
                 </div>
               </Card>

               <Card hoverable className="p-6 flex flex-col items-start gap-4">
                 <div className="bg-brand-100 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-brand-700" />
                 </div>
                 <div>
                   <h5 className="font-bold text-gray-900 mb-1">E-mail</h5>
                   <p className="text-brand-700 font-medium">contato@kdoisk.com.br</p>
                   <p className="text-sm text-gray-500 mt-1">Resposta em até 24h</p>
                 </div>
               </Card>
            </div>

            <Card hoverable className="p-6 flex items-start gap-5">
               <div className="bg-brand-100 p-3 rounded-full shrink-0">
                  <MapPin className="w-6 h-6 text-brand-700" />
               </div>
               <div>
                 <h5 className="font-bold text-gray-900 mb-2">Endereço Comercial</h5>
                 <p className="text-gray-700 mb-3">
                   Av. Paulista, 1000 - Bela Vista<br />
                   São Paulo - SP, 01310-100
                 </p>
                 <a href="#" className="font-medium text-brand-700 hover:underline">Ver no mapa &rarr;</a>
               </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-brand-900 mb-4">Perguntas Frequentes</h2>
            <p className="text-lg text-gray-600">Tudo o que você precisa saber.</p>
          </div>

          <Accordion>
            {mockFaqs.map((faq, idx) => (
              <AccordionItem key={idx} title={faq.question} defaultOpen={idx === 0}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
