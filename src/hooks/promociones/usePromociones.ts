import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PromotionService, type Promotion, type PromotionPayload } from '@/services/PromotionService';

export const PROMOCIONES_KEY = ['promociones'] as const;

// ── Query ─────────────────────────────────────────────────────────────────────

type UsePromocionesOptions = { live?: boolean; refetchIntervalMs?: number };

export const usePromociones = (options?: UsePromocionesOptions) => {
  const isLive = options?.live ?? false;
  const refetchIntervalMs = options?.refetchIntervalMs;

  return useQuery({
    queryKey: PROMOCIONES_KEY,
    queryFn: PromotionService.getAll,
    staleTime: isLive ? 0 : 1000 * 60 * 10,
    refetchOnMount: isLive ? 'always' : true,
    refetchOnWindowFocus: true,
    refetchInterval: isLive ? 60_000 : (refetchIntervalMs ?? false),
    refetchIntervalInBackground: false,
  });
};

// ── Create ────────────────────────────────────────────────────────────────────

export const useCreatePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PromotionPayload) => PromotionService.create(payload),
    onSuccess: (created) => {
      queryClient.setQueryData<Promotion[]>(['promociones'], (prev = []) => [
        created,
        ...prev.filter((p) => p.id !== created.id),
      ]);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['promociones'] });
    },
  });
};

// ── Update ────────────────────────────────────────────────────────────────────

export const useUpdatePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PromotionPayload }) =>
      PromotionService.update(id, payload),
    onSuccess: (updated) => {
      // Actualización inmediata en caché — sin disparar refetch aquí
      queryClient.setQueryData<Promotion[]>(['promociones'], (prev = []) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
    },
    onSettled: () => {
      // Confirmación con el servidor solo después de que todo termine
      void queryClient.invalidateQueries({ queryKey: ['promociones'] });
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────────────────

export const useDeletePromocion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PromotionService.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Promotion[]>(['promociones'], (prev = []) =>
        prev.filter((p) => p.id !== deletedId)
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['promociones'] });
    },
  });
};

