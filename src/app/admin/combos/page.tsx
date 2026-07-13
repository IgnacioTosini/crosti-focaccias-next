'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { FaEdit, FaPlus, FaSave, FaTimes, FaTrash, FaUsers } from 'react-icons/fa';
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

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const typeLabels: Record<PromotionType, string> = {
  combos: 'Combos',
  focaccias: 'Focaccias',
  prepizzas: 'Prepizzas',
};

const itemTypeLabels: Record<PromotionItemType, string> = {
  focaccia: 'Focaccia',
  prepizza: 'Prepizza',
  extra: 'Extra',
};

const sizeLabels: Record<PromotionSize, string> = {
  MEDIANA: 'Mediana',
  GRANDE: 'Grande',
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
  const totalItems = combos.reduce((acc, combo) => acc + (combo.items?.length ?? 0), 0);

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

  const handleSave = (event: FormEvent) => {
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
          <span className='adminCombosEyebrow'>Catálogo</span>
          <h1>Combos</h1>
          <p>Creá, editá y organizá promociones para el menú.</p>
        </div>
        <button className='primaryAction' onClick={handleNew} type='button'>
          <FaPlus />
          <span>Nuevo Combo</span>
        </button>
      </header>

      {isOpen && (
        <form className='comboForm' onSubmit={handleSave}>
          <div className='comboFormHeader'>
            <div>
              <span>{editingId ? 'Edición' : 'Alta'}</span>
              <h2>{formTitle}</h2>
              <p>Definí composición, precio y presentación pública.</p>
            </div>
            <button className='iconAction' type='button' onClick={resetForm} aria-label='Cerrar formulario'>
              <FaTimes />
            </button>
          </div>

          <section className='comboFormSection'>
            <div className='comboFormSectionHeader'>
              <span>1</span>
              <div>
                <h3>Datos principales</h3>
                <p>Título, descripción y precio del combo.</p>
              </div>
            </div>

            <div className='comboFormGrid'>
              <label className='formField formFieldWide'>
                <span>Título</span>
                <input
                  value={form.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder='Ej: Combo 5 pax'
                  required
                />
              </label>
              <label className='formField'>
                <span>Tipo</span>
                <select
                  value={form.type}
                  onChange={(e) => handleFormChange('type', e.target.value as PromotionType)}
                >
                  <option value='combos'>Combos</option>
                  <option value='focaccias'>Focaccias</option>
                  <option value='prepizzas'>Prepizzas</option>
                </select>
              </label>
              <label className='formField'>
                <span>Personas</span>
                <input
                  type='number'
                  min={0}
                  value={form.people}
                  onChange={(e) => handleFormChange('people', Number(e.target.value))}
                />
              </label>
              <label className='formField'>
                <span>Precio</span>
                <input
                  type='number'
                  min={0}
                  step='0.01'
                  value={form.price}
                  onChange={(e) => handleFormChange('price', Number(e.target.value))}
                />
              </label>
              <label className='formField formFieldFull'>
                <span>Descripción</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder='Contá qué incluye y para qué ocasión sirve.'
                  required
                />
              </label>
            </div>
          </section>

          <section className='comboFormSection'>
            <div className='comboFormSectionHeader comboFormSectionHeaderWithAction'>
              <span>2</span>
              <div>
                <h3>Items del combo</h3>
                <p>Agregá focaccias, prepizzas o extras incluidos.</p>
              </div>
              <button className='secondaryAction' type='button' onClick={addItem}>
                <FaPlus />
                Agregar item
              </button>
            </div>

            <div className='comboItems'>
              {form.items.length === 0 && <p className='muted'>No hay items cargados.</p>}

              {form.items.map((item, index) => (
                <div key={`${item.id ?? 'new'}-${index}`} className='comboItemRow'>
                  <span className='comboItemIndex'>{index + 1}</span>
                  <label className='formField'>
                    <span>Tipo</span>
                    <select
                      value={item.itemType}
                      onChange={(e) => updateItem(index, 'itemType', e.target.value as PromotionItemType)}
                    >
                      <option value='focaccia'>Focaccia</option>
                      <option value='prepizza'>Prepizza</option>
                      <option value='extra'>Extra</option>
                    </select>
                  </label>
                  <label className='formField'>
                    <span>Etiqueta</span>
                    <input
                      placeholder='Opcional'
                      value={item.label ?? ''}
                      onChange={(e) => updateItem(index, 'label', e.target.value)}
                    />
                  </label>
                  <label className='formField'>
                    <span>Cant.</span>
                    <input
                      type='number'
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                    />
                  </label>
                  <label className='formField'>
                    <span>Tamaño</span>
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
                  </label>
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
          </section>

          <div className='formActions'>
            <button type='button' className='secondaryAction' onClick={resetForm}>
              <FaTimes />
              Cancelar
            </button>
            <button type='submit' className='primaryAction' disabled={isSaving}>
              <FaSave />
              {isSaving ? 'Guardando...' : 'Guardar combo'}
            </button>
          </div>
        </form>
      )}

      <div className='combosPanel'>
        <div className='combosPanelHeader'>
          <div>
            <span className='adminCombosEyebrow'>Inventario</span>
            <h2>Combos existentes</h2>
          </div>
          <div className='combosPanelStats'>
            <span>{combos.length} combos</span>
            <span>{totalItems} items</span>
          </div>
        </div>

        <div className='combosList'>
          {isLoading && <p className='combosState'>Cargando combos...</p>}
          {!isLoading && error && <p className='combosState combosStateError'>{(error as Error).message ?? 'Error al cargar combos'}</p>}
          {!isLoading && !error && combos.length === 0 && <p className='combosState'>No hay combos registrados.</p>}

          {!isLoading && !error && combos.map((combo) => (
            <article key={combo.id} className='comboCardAdmin'>
              <div className='comboCardTop'>
                <div>
                  <span className='comboTypeTag'>{typeLabels[combo.type] ?? combo.type}</span>
                  <h3>{combo.title}</h3>
                </div>
                <strong>{currencyFormatter.format(combo.price)}</strong>
              </div>

              <p>{combo.description}</p>

              <div className='comboMeta'>
                <span><FaUsers /> {combo.people} pax</span>
                <span>{combo.items?.length ?? 0} items</span>
              </div>

              <ul>
                {(combo.items ?? []).map((item) => (
                  <li key={item.id ?? `${combo.id}-${item.order}`}>
                    <span>{item.quantity} x {itemTypeLabels[item.itemType] ?? item.itemType}</span>
                    {item.label && <small>{item.label}</small>}
                    {item.size && <small>{sizeLabels[item.size] ?? item.size}</small>}
                  </li>
                ))}
              </ul>

              <div className='comboCardActions'>
                <button className='secondaryAction' type='button' onClick={() => handleEdit(combo)}>
                  <FaEdit />
                  Editar
                </button>
                <button className='dangerAction' type='button' onClick={() => handleDelete(combo.id, combo.title)}>
                  <FaTrash />
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
