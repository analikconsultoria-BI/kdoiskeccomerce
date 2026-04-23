import * as React from "react";
import { MessageCircle, Phone, Headphones } from "lucide-react";
import { Button } from "../ui/Button";

export const SupportCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-warm-50/50 border-t border-warm-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-200 shrink-0">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-warm-900 mb-2">Ainda tem dúvidas sobre este produto?</h3>
              <p className="text-warm-500 font-medium">Nossos especialistas estão prontos para te ajudar a escolher a melhor solução.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="h-14 px-8 border-warm-200 hover:border-brand-300 text-warm-700 bg-white shadow-sm">
              <Phone className="w-4 h-4 mr-2 text-brand-600" /> (11) 9999-9999
            </Button>
            <Button className="h-14 px-8 bg-success hover:bg-success/90 shadow-lg shadow-green-100 translate-y-0 hover:-translate-y-1 transition-all">
              <MessageCircle className="w-4 h-4 mr-2" /> Chamar no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
