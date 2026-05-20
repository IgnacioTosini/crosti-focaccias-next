'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/sections/admin/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '@/components/sections/admin/Admin/AdminForm/AdminForm';
import { ProductList } from '@/components/sections/admin/Admin/ProductList/ProductList';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import type { FocacciaItem } from '@/types';
import '@/components/AbmPage/_abmPage.scss';

export default function AdminFocacciasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);

  const { data, isLoading, error } = useFocaccias(undefined, { live: true, refetchIntervalMs: 60_000 });
  const focacciasArray = Array.isArray(data) ? data : [];

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar focaccias.</p>;

  return (
    <main className='abmPage'>
      <AdminHeader
        onToggleForm={() => setIsOpen((prev) => !prev)}
        onNewFocaccia={() => {
          setFocacciaEdit(null);
          setIsOpen(true);
        }}
      />

      <div className='abmPageContent'>
        {isOpen && (
          <AdminForm
            focacciaEdit={focacciaEdit}
            onClose={() => setIsOpen(false)}
          />
        )}

        <ProductList
          focaccias={focacciasArray}
          onEdit={(item) => {
            setFocacciaEdit(item);
            setIsOpen(true);
          }}
        />
      </div>
    </main>
  );
}
