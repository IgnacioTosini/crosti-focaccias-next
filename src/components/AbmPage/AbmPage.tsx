'use client';

import { useState } from 'react';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import type { FocacciaItem } from '@/types';
import { AdminHeader } from '../sections/admin/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '../sections/admin/Admin/AdminForm/AdminForm';
import { AdminState } from '../sections/admin/Admin/AdminState/AdminState';
import { PedidosList } from '../sections/admin/Admin/PedidosList/PedidosList';
import { ProductList } from '../sections/admin/Admin/ProductList/ProductList';
import './_abmPage.scss';

export const AbmPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);

  const { data, isLoading, error } = useFocaccias();
  const focacciasArray = Array.isArray(data) ? data : [];
  if (isLoading) {
    return (
      <main className='abmPage'>
        <AdminState
          variant='loading'
          title='Cargando panel'
          description='Estamos trayendo los datos para administrar el catálogo.'
        />
      </main>
    );
  }

  if (error) {
    return (
      <main className='abmPage'>
        <AdminState
          variant='error'
          title='No se pudo cargar el panel'
          description='Revisá la conexión o intentá nuevamente en unos segundos.'
        />
      </main>
    );
  }

  return (
    <main className='abmPage'>
      <AdminHeader
        onToggleForm={() => setIsOpen(o => !o)}
        onNewFocaccia={() => {
          setFocacciaEdit(null);
          setIsOpen(true);
        }}
      />
      <div className="abmPageContent">
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
        <PedidosList />
      </div>
    </main>
  );
};
