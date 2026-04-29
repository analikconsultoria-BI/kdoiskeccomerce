"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('pedidos').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setPedidos(data);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center text-gray-500">
        {pedidos.length === 0 ? 'Nenhum pedido encontrado.' : 'Lista de pedidos aqui...'}
      </div>
    </div>
  );
}
