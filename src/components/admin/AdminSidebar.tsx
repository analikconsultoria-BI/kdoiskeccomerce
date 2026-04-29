"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Settings, 
  Image as ImageIcon, 
  Ticket, 
  Package, 
  LogOut,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

const menuItems = [
  { href: '/admin/produtos', label: 'Produtos', icon: ShoppingBag },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/cupons', label: 'Cupons', icon: Ticket },
  { href: '/admin/pedidos', label: 'Pedidos', icon: Package },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/admin/bling-connect', label: 'Integração Bling', icon: RefreshCw },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-100">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Admin</h1>
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">KdoisK Store</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-6">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 p-3.5 rounded-2xl font-bold transition-all group ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-xl shadow-brand-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50 bg-slate-50/30">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
}
