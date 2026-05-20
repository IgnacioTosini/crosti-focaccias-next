'use client';

import { useState } from 'react';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import type { FocacciaItem } from '@/types';
import { AdminHeader } from '../sections/admin/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '../sections/admin/Admin/AdminForm/AdminForm';
import { PedidosList } from '../sections/admin/Admin/PedidosList/PedidosList';
import { ProductList } from '../sections/admin/Admin/ProductList/ProductList';
import './_abmPage.scss';

export const AbmPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);

  const { data, isLoading, error } = useFocaccias();
  const focacciasArray = Array.isArray(data) ? data : [];
  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error...</p>;

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
