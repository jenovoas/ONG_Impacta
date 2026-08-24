import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pause, Play, XCircle, Loader2, Repeat } from 'lucide-react';
import client from '../api/client';

export type RecurrenceStatus = 'ACTIVE' | 'PAUSED' | 'CANCELLED';

export interface RecurrenceToggleProps {
  donationId: string;
  currentStatus?: RecurrenceStatus | string | null;
  isRecurring?: boolean;
}

export const RecurrenceToggle: React.FC<RecurrenceToggleProps> = ({
  donationId,
  currentStatus,
  isRecurring = true,
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (status: RecurrenceStatus) => {
      const response = await client.patch(`/donations/recurring/${donationId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['donations-me'] });
    },
  });

  if (!isRecurring || !currentStatus) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400">
        Puntual
      </span>
    );
  }

  const normalizedStatus = (currentStatus.toUpperCase() as RecurrenceStatus) || 'ACTIVE';

  const handleUpdate = (nextStatus: RecurrenceStatus) => {
    if (mutation.isPending) return;
    mutation.mutate(nextStatus);
  };

  const getStatusBadge = () => {
    switch (normalizedStatus) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
            <Repeat className="w-3 h-3" />
            Activa
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-tertiary/10 text-tertiary border border-tertiary/20">
            <Pause className="w-3 h-3" />
            Pausada
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-error/10 text-error border border-error/20">
            <XCircle className="w-3 h-3" />
            Cancelada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400">
            {normalizedStatus}
          </span>
        );
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getStatusBadge()}

      {mutation.isPending && (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      )}

      {!mutation.isPending && (
        <div className="flex items-center gap-1">
          {normalizedStatus === 'ACTIVE' && (
            <>
              <button
                type="button"
                onClick={() => handleUpdate('PAUSED')}
                title="Pausar donación recurrente"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-tertiary/20 text-gray-400 hover:text-tertiary transition-colors border border-white/5"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('CANCELLED')}
                title="Cancelar donación recurrente"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-error/20 text-gray-400 hover:text-error transition-colors border border-white/5"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {normalizedStatus === 'PAUSED' && (
            <>
              <button
                type="button"
                onClick={() => handleUpdate('ACTIVE')}
                title="Reanudar donación recurrente"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-secondary/20 text-gray-400 hover:text-secondary transition-colors border border-white/5"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('CANCELLED')}
                title="Cancelar donación recurrente"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-error/20 text-gray-400 hover:text-error transition-colors border border-white/5"
              >
                <XCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {normalizedStatus === 'CANCELLED' && (
            <button
              type="button"
              onClick={() => handleUpdate('ACTIVE')}
              title="Reactivar donación recurrente"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-secondary/20 text-gray-400 hover:text-secondary transition-colors border border-white/5"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
