'use client';

import { useMemo, useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {
  usePromociones,
  useCreatePromocion,
  useUpdatePromocion,
  useDeletePromocion,
} from '@/hooks/promociones/usePromociones';
import type {
  Promotion,
  PromotionItem,
  PromotionItemType,
  PromotionPayload,
  PromotionSize,
  PromotionType,
} from '@/services/PromotionService';
import './_combosAdmin.scss';

const emptyForm: PromotionPayload = {
  people: 0,
  title: '',
  description: '',
  price: 0,
  type: 'combos',
  items: [],
};

export default function AdminCombosPage() {
  const { data: combos = [], isLoading, error } = usePromociones({ live: true });
  const createPromocion = useCreatePromocion();
  const updatePromocion = useUpdatePromocion();
  const deletePromocion = useDeletePromocion();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PromotionPayload>(emptyForm);

  const isSaving = createPromocion.isPending || updatePromocion.isPending;

  const formTitle = useMemo(
    () => (editingId ? 'Editar combo' : 'Nuevo combo'),
    [editingId]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsOpen(false);
  };

  const handleNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsOpen(true);
  };

  const handleEdit = (combo: Promotion) => {
    setEditingId(combo.id);
    setForm({
      people: combo.people,
      title: combo.title,
      description: combo.description,
      price: combo.price,
      type: combo.type,
      items: (combo.items ?? []).map((item, index) => ({
        ...item,
        order: Number.isInteger(item.order) ? item.order : index,
      })),
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number, title: string) => {
    const confirmed = window.confirm(`¿Eliminar el combo "${title}"?`);
    if (!confirmed) return;
    deletePromocion.mutate(id);
  };

  const handleFormChange = <K extends keyof PromotionPayload>(key: K, value: PromotionPayload[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemType: 'focaccia',
          label: '',
          quantity: 1,
          size: 'MEDIANA',
          order: prev.items.length,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i })),
    }));
  };

  const updateItem = <K extends keyof PromotionItem>(index: number, key: K, value: PromotionItem[K]) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      alert('Completá título y descripción.');
      return;
    }

    const payload: PromotionPayload = {
      people: Number(form.people),
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      type: form.type,
      items: form.items.map((item, index) => ({
        itemType: item.itemType,
        label: item.label?.trim() || undefined,
        quantity: Number(item.quantity),
        size: item.size ?? undefined,
        order: index,
      })),
    };

    if (editingId) {
      updatePromocion.mutate(
        { id: editingId, payload },
        { onSuccess: resetForm, onError: (err) => alert(err.message) }
      );
    } else {
      createPromocion.mutate(payload, {
        onSuccess: resetForm,
        onError: (err) => alert(err.message),
      });
    }
  };

  return (
    <section className='adminCombos'>
      <header className='adminCombosHeader'>
        <div>
          <h1>Panel de Administración - Combos</h1>
          <p>Creá, editá y eliminá combos/promociones.</p>
        </div>
        <button className='primaryAction' onClick={handleNew} type='button'>
          <FaPlus />
          <span>Nuevo Combo</span>
        </button>
      </header>

      {isOpen && (
        <form className='comboForm' onSubmit={handleSave}>
          <h2>{formTitle}</h2>
          <div className='gridTwo'>
            <label>
              Título
              <input
                value={form.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                required
              />
            </label>
            <label>
              Tipo
              <select
                value={form.type}
                onChange={(e) => handleFormChange('type', e.target.value as PromotionType)}
              >
                <option value='combos'>Combos</option>
                <option value='focaccias'>Focaccias</option>
                <option value='prepizzas'>Prepizzas</option>
              </select>
            </label>
            <label>
              Personas
              <input
                type='number'
                min={0}
                value={form.people}
                onChange={(e) => handleFormChange('people', Number(e.target.value))}
              />
            </label>
            <label>
              Precio
              <input
                type='number'
                min={0}
                step='0.01'
                value={form.price}
                onChange={(e) => handleFormChange('price', Number(e.target.value))}
              />
            </label>
          </div>

          <label>
            Descripción
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              required
            />
          </label>

          <div className='comboItems'>
            <div className='comboItemsHeader'>
              <h3>Items del combo</h3>
              <button className='secondaryAction' type='button' onClick={addItem}>
                + Agregar item
              </button>
            </div>

            {form.items.length === 0 && <p className='muted'>No hay items cargados.</p>}

            {form.items.map((item, index) => (
              <div key={`${item.id ?? 'new'}-${index}`} className='comboItemRow'>
                <select
                  value={item.itemType}
                  onChange={(e) => updateItem(index, 'itemType', e.target.value as PromotionItemType)}
                >
                  <option value='focaccia'>Focaccia</option>
                  <option value='prepizza'>Prepizza</option>
                  <option value='extra'>Extra</option>
                </select>

                <input
                  placeholder='Etiqueta (opcional)'
                  value={item.label ?? ''}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                />

                <input
                  type='number'
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                />

                <select
                  value={item.size ?? ''}
                  onChange={(e) =>
                    updateItem(
                      index,
                      'size',
                      e.target.value ? (e.target.value as PromotionSize) : null
                    )
                  }
                >
                  <option value=''>Sin tamaño</option>
                  <option value='MEDIANA'>Mediana</option>
                  <option value='GRANDE'>Grande</option>
                </select>

                <button
                  type='button'
                  className='dangerAction iconOnly'
                  onClick={() => removeItem(index)}
                  aria-label={`Eliminar item ${index + 1}`}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className='formActions'>
            <button type='button' className='secondaryAction' onClick={resetForm}>
              Cancelar
            </button>
            <button type='submit' className='primaryAction' disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar combo'}
            </button>
          </div>
        </form>
      )}

      <div className='combosList'>
        {isLoading && <p>Cargando combos...</p>}
        {!isLoading && error && <p>{(error as Error).message ?? 'Error al cargar combos'}</p>}

        {!isLoading && !error && combos.length === 0 && <p>No hay combos registrados.</p>}

        {!isLoading && !error && combos.map((combo) => (
          <article key={combo.id} className='comboCardAdmin'>
            <div className='comboCardTop'>
              <h3>{combo.title}</h3>
              <span className='comboTypeTag'>{combo.type}</span>
            </div>

            <p>{combo.description}</p>

            <div className='comboMeta'>
              <span>Personas: {combo.people}</span>
              <span>Precio: ${combo.price}</span>
            </div>

            <ul>
              {(combo.items ?? []).map((item) => (
                <li key={item.id ?? `${combo.id}-${item.order}`}>
                  {item.quantity} x {item.itemType}
                  {item.label ? ` (${item.label})` : ''}
                  {item.size ? ` - ${item.size}` : ''}
                </li>
              ))}
            </ul>

            <div className='comboCardActions'>
              <button className='secondaryAction' type='button' onClick={() => handleEdit(combo)}>
                Editar
              </button>
              <button className='dangerAction' type='button' onClick={() => handleDelete(combo.id, combo.title)}>
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
