import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CreditCard, 
  ShieldAlert, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* --- SIDEBAR SECTION --- */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-30 hidden lg:flex flex-col">
        
        {/* 1. Logo Area */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#1e2746] p-1.5 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1e2746]">FraudGuard</span>
          </Link>
        </div>

        {/* 2. Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 mt-2">
          
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Core System
          </div>

          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-medium group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:text-blue-600" />
            Dashboard
          </Link>

          <Link 
            href="/transactions" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-medium group"
          >
            <CreditCard className="w-5 h-5 group-hover:text-blue-600" />
            Transactions
          </Link>

          <Link 
            href="/alerts" 
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-medium group"
          >
            <ShieldAlert className="w-5 h-5 group-hover:text-blue-600" />
            Security Alerts
          </Link>

        </nav>

        {/* 3. User / Logout Area (Optional Footer) */}
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-medium">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* --- MAIN CONTENT SECTION --- */}
      {/* The ml-64 pushes content right to make room for the fixed sidebar */}
      <main className="flex-1 lg:ml-64 p-8">
        {children}
      </main>

    </div>
  );
}