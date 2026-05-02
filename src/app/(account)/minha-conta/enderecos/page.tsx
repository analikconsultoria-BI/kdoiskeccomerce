import { AddressForm } from '@/components/account/AddressForm'

export const metadata = {
  title: 'Meus Endereços | Minha Conta',
}

export default function EnderecosPage() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-100">
      <h2 className="text-2xl font-bold text-warm-900 mb-6">Meus Endereços</h2>
      
      <div className="mb-8">
        <h3 className="font-bold text-lg text-warm-800 mb-4">Adicionar Novo Endereço</h3>
        <AddressForm />
      </div>
      
      <hr className="my-8 border-brand-100" />
      
      <div>
        <h3 className="font-bold text-lg text-warm-800 mb-4">Endereços Salvos</h3>
        <p className="text-warm-600">Nenhum endereço salvo ainda.</p>
      </div>
    </div>
  )
}
