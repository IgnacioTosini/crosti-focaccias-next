'use client';

import { useState } from 'react';
import { AdminHeader } from '../../components/Admin/AdminHeader/AdminHeader';
import { AdminForm } from '../../components/Admin/AdminForm/AdminForm';
import { ProductList } from '../../components/Admin/ProductList/ProductList';
import { PedidosList } from '../../components/Admin/PedidosList/PedidosList';
import { useFocaccias } from '@/hooks/focaccia/useFocaccias';
import type { FocacciaItem } from '@/types';
import './_abmPage.scss';

export const AbmPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focacciaEdit, setFocacciaEdit] = useState<FocacciaItem | null>(null);

  const { data, isLoading, error } = useFocaccias();

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
          focaccias={data?.data}
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
