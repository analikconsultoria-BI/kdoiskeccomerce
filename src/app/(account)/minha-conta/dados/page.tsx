export const metadata = {
  title: 'Meus Dados | KdoisK',
}

export default function DadosPage() {
  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Meus Dados</h2>
      <p className="text-gray-500 text-sm mb-8">Gerencie suas informações pessoais e segurança da conta.</p>
      
      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">E-mail</p>
          <p className="font-bold text-gray-700 italic">Oculto por segurança</p>
        </div>
        <button className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl text-sm">Alterar Senha</button>
      </div>
    </div>
  )
}
