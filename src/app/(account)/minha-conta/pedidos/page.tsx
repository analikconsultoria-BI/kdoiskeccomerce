export const metadata = {
  title: 'Meus Pedidos | KdoisK',
}

export default function PedidosPage() {
  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Meus Pedidos</h2>
      <p className="text-gray-500">Você ainda não realizou nenhum pedido.</p>
    </div>
  )
}
