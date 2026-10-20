'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKisan } from '@/context/KisanContext';
import { 
  Tractor, 
  Stethoscope, 
  Store, 
  Radio,
  User
} from 'lucide-react';

export function FarmerBottomNav() {
  const pathname = usePathname();
  const { currentLanguage } = useKisan();

  const labels: Record<string, { farm: string; doc: string; sell: string; device: string; profile: string }> = {
    hi: { farm: 'खेत', doc: 'डॉक्टर', sell: 'बेचें', device: 'यंत्र', profile: 'प्रोफाइल' },
    pa: { farm: 'ਖੇਤ', doc: 'ਡਾਕਟਰ', sell: 'ਵੇਚੋ', device: 'ਯੰਤਰ', profile: 'ਪ੍ਰੋਫਾਈਲ' },
    mr: { farm: 'शेत', doc: 'डॉक्टर', sell: 'विक्री', device: 'यंत्र', profile: 'प्रोफाइल' },
    ta: { farm: 'பண்ணை', doc: 'மருத்துவர்', sell: 'விற்பனை', device: 'கருவி', profile: 'சுயவிவரம்' },
    en: { farm: 'Farm', doc: 'Doctor', sell: 'Sell', device: 'Stake', profile: 'Profile' },
  };

  const l = labels[currentLanguage] || labels.hi;

  const navItems = [
    { href: '/farmer', label: l.farm, icon: Tractor },
    { href: '/farmer/alert', label: l.doc, icon: Stethoscope },
    { href: '/farmer/sell', label: l.sell, icon: Store },
    { href: '/farmer/device', label: l.device, icon: Radio },
    { href: '/farmer/profile', label: l.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-black/[0.06] shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 h-[72px] px-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href === '/farmer/alert' && pathname === '/farmer/remedy');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'text-emerald-700 font-extrabold scale-105'
                  : 'text-stone-400 hover:text-stone-700 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] tracking-tight truncate">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
