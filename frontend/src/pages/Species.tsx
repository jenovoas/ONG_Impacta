import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Leaf, 
  X, 
  MoreVertical,
  Camera,
  Loader2,
  Check
} from 'lucide-react';
import client from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';

const speciesStatusLabels: Record<string, string> = {
  ACTIVE: 'Saludable',
  THREATENED: 'Amenazada',
  ENDANGERED: 'En peligro',
};

export const Species: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Fetch Species
  const { data: species = [], isLoading, isError } = useQuery({
    queryKey: ['species'],
    queryFn: async () => {
      const { data } = await client.get('/species');
      return data;
    },
  });

  // Create Species Mutation
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await client.post('/species', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['species'] });
      setIsModalOpen(false);
    },
  });

  const filteredSpecies = species.filter((s: any) => 
    s.commonName.toLowerCase().includes(search.toLowerCase()) ||
    s.scientificName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-secondary">Conservación</p>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-white sm:text-4xl">Especies</h1>
          <p className="mt-3 max-w-2xl text-on-surface-variant">Catálogo de biodiversidad monitoreada por tu organización.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-on-secondary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <Plus className="w-5 h-5" />
          Registrar Especie
        </button>
      </header>

      <div className="relative max-w-lg rounded-2xl bg-surface-container p-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="search"
          aria-label="Buscar especie por nombre común o científico"
          placeholder="Buscar especie por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-surface-container-high py-3.5 pl-12 pr-4 text-white placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        />
      </div>

      {isLoading ? (
        <div role="status" className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-2xl bg-error-container/40 p-5 text-sm text-error">No pudimos cargar las especies. Vuelve a intentarlo.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <AnimatePresence>
            {filteredSpecies.map((s: any) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card overflow-hidden rounded-2xl"
              >
                <div className="group relative h-48 overflow-hidden bg-surface-container-highest">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.commonName} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                      <Leaf className="w-12 h-12 text-secondary/30" />
                    </div>
                  )}
                  <span aria-hidden="true" className="absolute right-4 top-4 rounded-xl bg-black/50 p-2 text-white opacity-70 backdrop-blur-md transition-opacity group-hover:opacity-100">
                    <MoreVertical className="h-5 w-5" />
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="font-headline text-lg font-semibold text-white">{s.commonName}</h3>
                    <span className="shrink-0 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                      {speciesStatusLabels[s.status] || s.status}
                    </span>
                  </div>
                  <p className="mb-3 text-sm italic text-on-surface-variant">{s.scientificName || 'Nombre científico no registrado'}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                    {s.description || 'Sin descripción disponible.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredSpecies.length === 0 && (
            <div className="col-span-full rounded-2xl bg-surface-container px-6 py-12 text-center">
              <Leaf aria-hidden="true" className="mx-auto h-7 w-7 text-secondary" />
              <p className="mt-3 font-medium text-white">{species.length ? 'No encontramos especies' : 'Aún no hay especies registradas'}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{species.length ? 'Prueba otra búsqueda.' : 'Agrega una especie para comenzar el catálogo.'}</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Registro */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface-container shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div><p className="text-sm font-semibold text-secondary">Conservación</p><h2 className="mt-1 font-headline text-2xl font-semibold text-white">Registrar especie</h2></div>
                  <button aria-label="Cerrar formulario" onClick={() => setIsModalOpen(false)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-surface-bright hover:text-white focus-visible:outline-2 focus-visible:outline-secondary">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <SpeciesForm 
                  onSubmit={(fd: FormData) => createMutation.mutate(fd)} 
                  loading={createMutation.isPending}
                />
                {createMutation.isError && <p role="alert" className="mt-4 text-sm text-error">No pudimos guardar la especie. Revisa los datos e inténtalo de nuevo.</p>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SpeciesForm = ({ onSubmit, loading }: any) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    if (file) formData.set('image', file);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Nombre común</label>
            <input name="commonName" required className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Nombre científico</label>
            <input name="scientificName" className="w-full rounded-xl bg-surface-container-high px-4 py-3.5 text-white italic focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-on-surface">Estado de conservación</label>
            <select name="status" className="w-full appearance-none rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
              <option value="ACTIVE" className="bg-surface">Activa / Saludable</option>
              <option value="THREATENED" className="bg-surface">Amenazada</option>
              <option value="ENDANGERED" className="bg-surface">En Peligro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-on-surface">Fotografía de referencia</label>
          <label className="relative block aspect-square cursor-pointer overflow-hidden rounded-2xl bg-surface-container-high focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2">
                <Camera className="w-10 h-10 opacity-30" />
                <span className="text-sm font-medium">Seleccionar imagen</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="Seleccionar fotografía de referencia"
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="mb-2 block text-sm font-medium text-on-surface">Descripción y hábitat</label>
        <textarea name="description" rows={3} className="w-full resize-y rounded-xl bg-surface-container-high px-4 py-3.5 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" />
      </div>

      <button
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3.5 font-semibold text-on-secondary transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
          <>
            <Check className="w-6 h-6" />
            Finalizar Registro de Especie
          </>
        )}
      </button>
    </form>
  );
};
