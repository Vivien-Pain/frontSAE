'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const inventory = [
  { id: 'm1', name: 'Chaise pliante', category: 'Mobilier', stock: 200, color: 'bg-[#b6d0d3]' },
  { id: 'm2', name: 'Table rectangulaire (1.80m)', category: 'Mobilier', stock: 50, color: 'bg-[#b9d0bc]' },
  { id: 'm3', name: 'Mange-debout', category: 'Mobilier', stock: 15, color: 'bg-[#dfe9df]' },
  { id: 'm4', name: 'Barnum 3x3m', category: 'Logistique', stock: 10, color: 'bg-[#f0c28c]' },
  { id: 'm5', name: 'Grille d\'exposition', category: 'Logistique', stock: 30, color: 'bg-[#b6d0d3]' },
  { id: 'm6', name: 'Barrière Vauban', category: 'Logistique', stock: 40, color: 'bg-[#dfe9df]' },
  { id: 'm7', name: 'Sono portable avec micro', category: 'Son & Lumière', stock: 2, color: 'bg-[#b9d0bc]' },
  { id: 'm8', name: 'Projecteur LED', category: 'Son & Lumière', stock: 4, color: 'bg-[#f0c28c]' },
];

const categories = ['Toutes les catégories', 'Mobilier', 'Logistique', 'Son & Lumière'];
const roomOptions = ['Gymnase municipal', 'Salle des fêtes', 'Salle polyvalente', 'Salle annexe', 'Grande salle', 'Salle associative'];

export default function MaterielPage() {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');
  
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [activeCategory, setActiveCategory] = useState('Toutes les catégories');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});

  const filteredInventory = inventory.filter(
    (item) => activeCategory === 'Toutes les catégories' || item.category === activeCategory
  );

  const setQuantityExact = (id: string, value: number, max: number) => {
    setSelectedItems((prev) => {
      const next = Math.max(0, Math.min(value, max));
      const updated = { ...prev };
      if (next === 0) {
        delete updated[id];
      } else {
        updated[id] = next;
      }
      return updated;
    });
  };

  const getSelectedTotalCount = () => {
    return Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const handleNextStep = () => {
    setStepError('');
    if (step === 1) {
      if (!eventName || !location || !startDate || !endDate) {
        setStepError("Veuillez remplir l'intégralité des champs avant de passer à l'étape suivante.");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start < today) {
        setStepError("Erreur de planification : la date de début ne peut pas être dans le passé.");
        return;
      }

      if (start > end) {
        setStepError("Erreur de planification : la date de fin de l'événement ne peut pas précéder la date de début.");
        return;
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 2) {
        setStepError("Une demande de matériel ne peut excéder 3 jours consécutifs au total.");
        return;
      }
    }
    
    if (step === 2 && getSelectedTotalCount() === 0) {
      setStepError("Veuillez sélectionner au moins un article dans le catalogue.");
      return;
    }

    setStep(step + 1);
  };

  return (
    <main className="room-page">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5ce transparent; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5ce; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9eaaa3; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />

      <section className="room-panel" aria-labelledby="materiel-title">
        <Link className="room-back" href="/">
          <span aria-hidden="true">←</span> Retour
        </Link>

        <div className="room-breadcrumb">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">-</span>
          <strong id="materiel-title">Demande de matériel</strong>
        </div>

        <div className="room-stepper" aria-label="Étapes de réservation">
          {[['01', 'Événement'], ['02', 'Matériel'], ['03', 'Confirmation']].map(([number, label], index) => (
            <div className={`room-step ${step === index + 1 ? 'room-step-active' : ''}`} key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>

        {stepError && (
          <div className="mb-8 mt-4 flex items-start gap-3 rounded-md border border-[#f3dada] bg-[#fdf2f2] p-4 text-[#b54b4b] shadow-sm animate-in fade-in w-full max-w-3xl mx-auto">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold leading-relaxed">{stepError}</p>
          </div>
        )}

        {step === 1 && (
          <section className="room-section !w-full !max-w-3xl mx-auto" aria-labelledby="event-title">
            <div className="room-section-heading">
              <p className="room-eyebrow">Étape 1 sur 3</p>
              <h1 id="event-title">Détails de l'événement</h1>
              <p>Renseignez les informations concernant l'événement pour lequel vous avez besoin de matériel.</p>
            </div>
            
            <div className="flex flex-col gap-6 mt-10">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#1e2420]">Nom de l'événement *</label>
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => { setEventName(e.target.value); setStepError(''); }}
                  placeholder="Ex: Fête de la musique, Loto de printemps..." 
                  className="w-full border border-[#d9ded9] bg-[#f7f8f4] px-4 py-3.5 text-sm outline-none focus:border-[#0b644d] focus:ring-1 focus:ring-[#0b644d] rounded-md"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#1e2420]">Lieu d'utilisation *</label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setStepError(''); }}
                    className="w-full appearance-none border border-[#d9ded9] bg-[#f7f8f4] px-4 py-3.5 text-sm outline-none focus:border-[#0b644d] focus:ring-1 focus:ring-[#0b644d] rounded-md text-[#1e2420]"
                  >
                    <option value="" disabled>Sélectionnez une salle</option>
                    {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#1e2420]">
                    <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#1e2420]">Date de début *</label>
                  <input 
                    type="date" 
                    value={startDate}
                    min={todayStr}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setStepError('');
                    }}
                    className="w-full border border-[#d9ded9] bg-[#f7f8f4] px-4 py-3.5 text-sm outline-none focus:border-[#0b644d] focus:ring-1 focus:ring-[#0b644d] rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-[#1e2420]">Date de fin *</label>
                  <input 
                    type="date" 
                    value={endDate}
                    min={startDate || todayStr}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setStepError('');
                    }}
                    className="w-full border border-[#d9ded9] bg-[#f7f8f4] px-4 py-3.5 text-sm outline-none focus:border-[#0b644d] focus:ring-1 focus:ring-[#0b644d] rounded-md"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="room-section !w-full !max-w-4xl mx-auto" aria-labelledby="catalog-title">
            <div className="room-section-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="room-eyebrow">Étape 2 sur 3</p>
                <h1 id="catalog-title">Catalogue du matériel</h1>
                <p>Sélectionnez les équipements et les quantités nécessaires.</p>
              </div>
              <div className="bg-[#f2f7f5] border border-[#0b644d] px-4 py-3 rounded-lg flex items-center gap-3 shrink-0">
                <span className="text-[#0b644d] font-bold text-lg">{getSelectedTotalCount()}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1e2420]">Article(s)</span>
              </div>
            </div>
            
            <div className="mt-8 mb-6">
              <div className="hidden sm:flex overflow-x-auto gap-3 pb-3 custom-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] border rounded-[6px] transition-all ${
                      activeCategory === cat
                        ? 'bg-[#0b644d] text-white border-[#0b644d] shadow-md'
                        : 'bg-white text-[#1e2420] border-[#d9ded9] hover:border-[#0b644d] hover:bg-[#f2f7f5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="sm:hidden relative">
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full appearance-none bg-white border-2 border-[#1e2420] text-[#1e2420] text-xs font-bold uppercase tracking-[0.15em] rounded-[6px] px-5 py-4 outline-none focus:border-[#0b644d] focus:ring-2 focus:ring-[#0b644d]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-[#1e2420]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredInventory.map((item) => {
                const qty = selectedItems[item.id] || 0;
                
                return (
                  <div key={item.id} className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${qty > 0 ? 'border-[#0b644d] bg-[#f2f7f5]' : 'border-[#d9ded9] bg-white hover:border-[#a1a6a2]'}`}>
                    <div className="flex gap-4 items-center w-full overflow-hidden">
                      <div className={`w-14 h-14 rounded-lg shrink-0 ${item.color} shadow-inner flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-black/20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM12 22.27L5 18.23V9.77L12 13.8l7-4.03v8.46l-7 4.04zM12 11.5L5 7.46l7-4.04 7 4.04-7 4.04z"/></svg>
                      </div>
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-black text-[#1e2420] uppercase text-xs sm:text-sm tracking-tight truncate">{item.name}</span>
                        <span className="text-[10px] sm:text-xs font-bold text-[#6d746e] tracking-widest uppercase mt-0.5">{item.stock} dispo</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 bg-white border border-[#d9ded9] rounded-lg p-1 shadow-sm shrink-0">
                      <button 
                        type="button" 
                        onClick={() => {
                          setQuantityExact(item.id, qty - 1, item.stock);
                          setStepError('');
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-lg transition-colors ${qty > 0 ? 'text-[#1e2420] hover:bg-[#f2f7f5]' : 'text-[#d9ded9] cursor-not-allowed'}`}
                        disabled={qty === 0}
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        min="0"
                        max={item.stock}
                        value={qty === 0 ? '' : qty}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            setQuantityExact(item.id, val, item.stock);
                            setStepError('');
                          }
                        }}
                        placeholder="0"
                        className="w-8 text-center text-sm font-black text-[#1e2420] outline-none"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          setQuantityExact(item.id, qty + 1, item.stock);
                          setStepError('');
                        }}
                        className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-lg transition-colors ${qty < item.stock ? 'text-[#1e2420] hover:bg-[#f2f7f5]' : 'text-[#d9ded9] cursor-not-allowed'}`}
                        disabled={qty === item.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="room-section room-confirmation !w-full !max-w-3xl mx-auto" aria-labelledby="confirmation-title">
            <p className="room-eyebrow">Étape 3 sur 3</p>
            <h1 id="confirmation-title">Votre demande de matériel</h1>
            <p>Vérifiez le récapitulatif avant de confirmer la demande.</p>
            
            <div className="bg-[#f7f8f4] border border-[#d9ded9] p-6 rounded-xl mt-8 mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#1e2420] mb-4 border-b border-[#d9ded9] pb-4">L'événement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#6d746e] uppercase tracking-widest">Nom</span>
                  <strong className="text-[#1e2420]">{eventName || 'Non renseigné'}</strong>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#6d746e] uppercase tracking-widest">Lieu</span>
                  <strong className="text-[#1e2420]">{location || 'Non renseigné'}</strong>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#6d746e] uppercase tracking-widest">Période</span>
                  <strong className="text-[#1e2420]">Du {startDate ? new Date(startDate).toLocaleDateString('fr-FR') : '...'} au {endDate ? new Date(endDate).toLocaleDateString('fr-FR') : '...'}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#0b644d] rounded-xl overflow-hidden">
              <div className="bg-[#0b644d] text-white px-6 py-4 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest">Matériel sélectionné</h3>
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">{getSelectedTotalCount()} article(s)</span>
              </div>
              <div className="flex flex-col divide-y divide-[#d9ded9]">
                {Object.entries(selectedItems).length > 0 ? (
                  Object.entries(selectedItems).map(([id, qty]) => {
                    const item = inventory.find(i => i.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="flex justify-between items-center px-6 py-4">
                        <div className="flex flex-col">
                          <strong className="text-[#1e2420] text-sm uppercase font-black">{item.name}</strong>
                          <span className="text-[10px] text-[#6d746e] font-bold uppercase tracking-widest mt-0.5">{item.category}</span>
                        </div>
                        <span className="text-lg font-black text-[#0b644d]">x {qty}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-6 py-8 text-center text-[#6d746e] text-sm italic">
                    Aucun matériel sélectionné.
                  </div>
                )}
              </div>
            </div>
            
            <p className="room-confirmation-note mt-8">La demande de matériel doit être soumise au minimum 15 jours avant la date de l'événement pour traitement par nos services logistiques.</p>
          </section>
        )}

        <div className="room-navigation">
          {step > 1 ? (
            <button className="room-previous" type="button" onClick={() => { setStep((value) => value - 1); setStepError(''); }}>← Retour</button>
          ) : <span />}
          
          {step < 3 ? (
            <Button 
              type="button" 
              variant="dark" 
              className="room-next" 
              onClick={handleNextStep} 
            >
              Continuer →
            </Button>
          ) : (
            <Button type="button" variant="dark" className="room-next" onClick={() => setStep(1)}>
              Confirmer la demande
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}