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

export const Species: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  // Fetch Species
  const { data: species = [], isLoading } = useQuery({
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Biblioteca de <span className="text-secondary">Especies</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Catálogo de biodiversidad y biodiversidad local.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-on-secondary px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform shadow-lg shadow-secondary/20"
        >
          <Plus className="w-5 h-5" />
          Registrar Especie
        </button>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar especie por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface-container-low border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-secondary/50 transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredSpecies.map((s: any) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card rounded-3xl overflow-hidden border border-white/5 group"
              >
                <div className="h-48 bg-surface-container-highest relative overflow-hidden">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.commonName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                      <Leaf className="w-12 h-12 text-secondary/30" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{s.commonName}</h3>
                    <span className="bg-secondary/20 text-secondary text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      {s.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm italic font-medium mb-4">{s.scientificName || 'N/A'}</p>
                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {s.description || 'Sin descripción disponible.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
              className="relative w-full max-w-2xl glass-card rounded-[40px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-white uppercase italic">Registrar <span className="text-secondary">Especie</span></h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <SpeciesForm 
                  onSubmit={(fd: FormData) => createMutation.mutate(fd)} 
                  loading={createMutation.isPending}
                />
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
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Nombre Común</label>
            <input name="commonName" required className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Nombre Científico</label>
            <input name="scientificName" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white italic focus:outline-none focus:border-secondary/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Estado</label>
            <select name="status" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors appearance-none">
              <option value="ACTIVE" className="bg-surface">Activa / Saludable</option>
              <option value="THREATENED" className="bg-surface">Amenazada</option>
              <option value="ENDANGERED" className="bg-surface">En Peligro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Fotografía de Referencia</label>
          <div className="aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-white/5 overflow-hidden relative group cursor-pointer">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2">
                <Camera className="w-10 h-10 opacity-30" />
                <span className="text-xs font-bold uppercase tracking-wider">Subir Imagen</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest">Descripción / Hábitat</label>
        <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-secondary/50 transition-colors" />
      </div>

      <button
        disabled={loading}
        className="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform disabled:opacity-50"
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
