export type PromotionType = 'focaccias' | 'prepizzas' | 'combos';
export type PromotionItemType = 'focaccia' | 'prepizza' | 'extra';
export type PromotionSize = 'MEDIANA' | 'GRANDE';

export type PromotionItem = {
  id?: number;
  itemType: PromotionItemType;
  label?: string | null;
  quantity: number;
  size?: PromotionSize | null;
  order: number;
};

export type Promotion = {
  id: number;
  people: number;
  title: string;
  description: string;
  price: number;
  type: PromotionType;
  items: PromotionItem[];
};

export type PromotionPayload = {
  people: number;
  title: string;
  description: string;
  price: number;
  type: PromotionType;
  items: PromotionItem[];
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const json = (await res.json()) as { data: T; success: boolean; message?: string };
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? `Error ${res.status}`);
  }
  return json.data;
}

export const PromotionService = {
  getAll: () =>
    request<Promotion[]>('/api/promociones', { cache: 'no-store' }),

  create: (payload: PromotionPayload) =>
    request<Promotion>('/api/promociones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: PromotionPayload) =>
    request<Promotion>(`/api/promociones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),

  delete: (id: number) =>
    request<null>(`/api/promociones/${id}`, { method: 'DELETE' }),
};
