"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.scss';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const handleBackToSite = () => {
    window.location.href = '/';
  };
  const isActive = (href: string) => pathname === href;

  return (
    <div className="admin-panel-layout">
      <aside className="admin-sidebar">
        <h2>Panel de Control</h2>
        <nav>
          <ul>
            <li>
              <button
                className="adminHeaderButton"
                onClick={handleBackToSite}
              >
                Volver al sitio
              </button>
            </li>
            <li>
              <Link href="/admin" className="admin-logo">
                <span className="admin-logo-icon">🍕</span>
                <span className="admin-logo-text">Centro de Control</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/focaccias"
                className={isActive('/admin/focaccias') ? 'active' : ''}
                aria-current={isActive('/admin/focaccias') ? 'page' : undefined}
              >
                Focaccias
              </Link>
            </li>
            <li>
              <Link
                href="/admin/combos"
                className={isActive('/admin/combos') ? 'active' : ''}
                aria-current={isActive('/admin/combos') ? 'page' : undefined}
              >
                Combos
              </Link>
            </li>
            <li>
              <Link
                href="/admin/pedidos"
                className={isActive('/admin/pedidos') ? 'active' : ''}
                aria-current={isActive('/admin/pedidos') ? 'page' : undefined}
              >
                Pedidos
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        {children}
      </main>
    </div>
  );
}
