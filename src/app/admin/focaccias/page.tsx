'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/sections/admin/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '@/components/sections/admin/Admin/AdminForm/AdminForm';
import { ProductList } from '@/components/sections/admin/Admin/ProductList/ProductList';
import { AdminState } from '@/components/sections/admin/Admin/AdminState/AdminState';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import type { FocacciaItem } from '@/types';
import '@/components/AbmPage/_abmPage.scss';

export default function AdminFocacciasPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);

  const { data, isLoading, error } = useFocaccias(undefined, { live: true, refetchIntervalMs: 60_000 });
  const focacciasArray = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <main className='abmPage'>
        <AdminState
          variant='loading'
          title='Cargando focaccias'
          description='Estamos preparando el catálogo para editarlo.'
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className='abmPage'>
        <AdminState
          variant='error'
          title='No se pudieron cargar las focaccias'
          description='Revisá la conexión o intentá nuevamente en unos segundos.'
        />
      </main>
    );
  }

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
