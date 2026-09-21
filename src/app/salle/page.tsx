'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import RoomCalendar, { monthNames, getMockReservations } from '@/components/ui/RoomCalendar';

const rooms = [
  { name: 'Gymnase municipal', capacity: '180 personnes', color: 'room-blue' },
  { name: 'Salle des fêtes', capacity: '120 personnes', color: 'room-green' },
  { name: 'Salle polyvalente', capacity: '60 personnes', color: 'room-orange' },
  { name: 'Salle annexe', capacity: '35 personnes', color: 'room-sage' },
  { name: 'Grande salle', capacity: '90 personnes', color: 'room-green' },
  { name: 'Salle associative', capacity: '35 personnes', color: 'room-blue' },
];

export default function SallePage() {
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState('');
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [standardEndDate, setStandardEndDate] = useState('');
  
  const [isRegularBooking, setIsRegularBooking] = useState(false);
  const [bookingFrequency, setBookingFrequency] = useState('hebdomadaire');
  const [regularStartDate, setRegularStartDate] = useState('');
  const [regularEndDate, setRegularEndDate] = useState('');

  const selectedDateFull = selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()].toLowerCase()} ${selectedDate.getFullYear()}` : '';
  const selectedDateISO = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '';
  
  const maxStandardEndDate = selectedDate ? new Date(selectedDate) : new Date();
  maxStandardEndDate.setDate(maxStandardEndDate.getDate() + 2);
  const maxStandardEndDateISO = new Date(maxStandardEndDate.getTime() - maxStandardEndDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  const handleNextStep = () => {
    setStepError('');
    if (step === 2) {
      if (!selectedRoom) {
        setStepError("Veuillez sélectionner une salle disponible avant de continuer.");
        return;
      }

      if (isRegularBooking) {
        if (!regularStartDate || !regularEndDate) {
          setStepError('Veuillez renseigner les dates de début et de fin pour la réservation régulière.');
          return;
        }
        
        const start = new Date(regularStartDate);
        const end = new Date(regularEndDate);
        
        if (start < today) {
          setStepError('Erreur de planification : la date de début de la réservation régulière ne peut pas être dans le passé.');
          return;
        }

        if (start > end) {
          setStepError('Erreur de planification : la date de fin de la réservation régulière ne peut pas précéder sa date de début.');
          return;
        }
        
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 2 && bookingFrequency === 'quotidienne') {
          setStepError("Une réservation régulière quotidienne ne peut pas excéder 3 jours consécutifs au total.");
          return;
        }
      } else if (standardEndDate) {
        const start = selectedDate!;
        const end = new Date(standardEndDate);

        if (end < start) {
          setStepError("La date de fin ne peut pas précéder la date de début sélectionnée dans le calendrier.");
          return;
        }

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 2) {
          setStepError("Une réservation standard ne peut pas excéder 3 jours consécutifs au total.");
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const reservationsJour = selectedDate ? getMockReservations(selectedDate, 'Toutes les salles', rooms) : [];
  const reservedRoomNames = reservationsJour.map(r => r.name);

  return (
    <main className="room-page">
      <section className="room-panel" aria-labelledby="room-title">
        <Link className="room-back" href="/">
          <span aria-hidden="true">←</span> Retour
        </Link>

        <div className="room-breadcrumb">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">-</span>
          <strong id="room-title">Demande de salle</strong>
        </div>

        <div className="room-stepper" aria-label="Étapes de réservation">
          {[['01', 'Date'], ['02', 'Salle'], ['03', 'Confirmation']].map(([number, label], index) => (
            <div className={`room-step ${step === index + 1 ? 'room-step-active' : ''}`} key={number}>
              <span>{number}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>

        {stepError && (
          <div className="mb-8 mt-4 flex items-start gap-3 rounded-md border border-[#f3dada] bg-[#fdf2f2] p-4 text-[#b54b4b] shadow-sm animate-in fade-in w-full max-w-5xl mx-auto">
            <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold leading-relaxed">{stepError}</p>
          </div>
        )}

        {step === 1 && (
          <section className="room-section !w-full !max-w-5xl mx-auto" aria-labelledby="date-title">
            <div className="room-section-heading">
              <p className="room-eyebrow">Étape 1 sur 3</p>
              <h1 id="date-title">Choisissez une date</h1>
              <p>Sélectionnez le jour où vous souhaitez réserver une salle.</p>
            </div>
            
            <RoomCalendar 
              rooms={rooms}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onNextStep={() => {
                setStepError('');
                setStep(2);
                setSelectedRoom(null);
                setStandardEndDate('');
                setIsRegularBooking(false);
              }}
            />
          </section>
        )}

        {step === 2 && (
          <section className="room-section" aria-labelledby="room-choice-title">
            <div className="room-section-heading">
              <p className="room-eyebrow">Étape 2 sur 3</p>
              <h1 id="room-choice-title">Choisissez une salle</h1>
              <p>Sélectionnez la salle pour la journée du {selectedDateFull}.</p>
            </div>
            
            <div className="room-card-grid">
              {rooms.map((room) => {
                const isReserved = reservedRoomNames.includes(room.name);
                
                return (
                  <button 
                    className={`room-card relative overflow-hidden transition-all ${room.color} ${isReserved ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' : selectedRoom === room.name ? 'ring-2 ring-inset ring-[#0b644d]' : 'hover:border-[#0b644d] border-2 border-transparent'}`} 
                    type="button" 
                    key={room.name} 
                    disabled={isReserved}
                    onClick={() => {
                      setSelectedRoom(room.name);
                      setStepError('');
                    }}
                  >
                    <span className={`room-card-visual ${isReserved ? '!bg-[#d9ded9] opacity-50' : ''}`} aria-hidden="true" />
                    <strong className={isReserved ? 'text-[#6d746e]' : ''}>{room.name}</strong>
                    <span className={isReserved ? 'text-[#a1a6a2]' : ''}>{room.capacity}</span>

                    {isReserved && (
                      <span className="absolute top-3 right-3 text-[10px] font-black text-[#1e2420] bg-white border border-[#1e2420] px-2.5 py-1 rounded-sm shadow-sm uppercase tracking-widest">
                        Indisponible
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-10 border-t border-[#d9ded9] pt-8">
              {!isRegularBooking && (
                <div className="mb-8 flex flex-col gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e2420]">
                    Date de fin (jusqu'à 3 jours consécutifs max)
                  </label>
                  <input 
                    type="date" 
                    value={standardEndDate || selectedDateISO} 
                    min={selectedDateISO}
                    max={maxStandardEndDateISO}
                    onChange={(e) => {
                      setStandardEndDate(e.target.value);
                      setStepError('');
                    }} 
                    className="border border-[#d9ded9] bg-[#f7f8f4] px-4 py-3 text-sm rounded-md outline-none focus:border-[#0b644d] w-full max-w-xs" 
                  />
                </div>
              )}

              <label className="flex items-center gap-3 cursor-pointer mb-6 border-t border-[#d9ded9] pt-8">
                <input 
                  type="checkbox" 
                  checked={isRegularBooking}
                  onChange={(e) => {
                    setIsRegularBooking(e.target.checked);
                    setStandardEndDate('');
                    setStepError('');
                  }}
                  className="w-4 h-4 accent-[#0b644d]"
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e2420]">
                  Convertir en réservation régulière
                </span>
              </label>

              {isRegularBooking && (
                <div className="flex flex-col gap-5 pl-7 border-l-2 border-[#f2f7f5]">
                  <div className="flex flex-col gap-3 text-sm text-[#4f5851]">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="frequency" value="quotidienne" checked={bookingFrequency === 'quotidienne'} onChange={(e) => setBookingFrequency(e.target.value)} className="w-3.5 h-3.5 accent-[#0b644d]" />
                      <span>Quotidienne</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="frequency" value="hebdomadaire" checked={bookingFrequency === 'hebdomadaire'} onChange={(e) => setBookingFrequency(e.target.value)} className="w-3.5 h-3.5 accent-[#0b644d]" />
                      <span>Hebdomadaire</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="frequency" value="mensuelle" checked={bookingFrequency === 'mensuelle'} onChange={(e) => setBookingFrequency(e.target.value)} className="w-3.5 h-3.5 accent-[#0b644d]" />
                      <span>Mensuelle</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-[#6d746e] uppercase">Début</span>
                      <input 
                        type="date" 
                        value={regularStartDate} 
                        min={todayStr}
                        onChange={(e) => {
                          setRegularStartDate(e.target.value);
                          setStepError('');
                        }} 
                        className="border border-[#d9ded9] bg-[#f2f7f5] px-3 py-2 text-xs w-32 outline-none focus:border-[#0b644d]" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-[#6d746e] uppercase">Fin</span>
                      <input 
                        type="date" 
                        value={regularEndDate} 
                        min={regularStartDate || todayStr}
                        onChange={(e) => {
                          setRegularEndDate(e.target.value);
                          setStepError('');
                        }} 
                        className="border border-[#d9ded9] bg-[#f2f7f5] px-3 py-2 text-xs w-32 outline-none focus:border-[#0b644d]" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="room-section room-confirmation" aria-labelledby="confirmation-title">
            <p className="room-eyebrow">Étape 3 sur 3</p>
            <h1 id="confirmation-title">Votre réservation</h1>
            <p>Vérifiez les informations avant de confirmer votre demande.</p>
            
            <div className="room-summary">
              <div>
                <span>Date</span>
                <strong>
                  {selectedDateFull} 
                  {standardEndDate && standardEndDate !== selectedDateISO ? ` au ${new Date(standardEndDate).toLocaleDateString('fr-FR')} (Journées complètes)` : ' (Journée complète)'}
                </strong>
              </div>
              <div><span>Salle</span><strong>{selectedRoom}</strong></div>
              {isRegularBooking && (
                <>
                  <div><span>Récurrence</span><strong className="capitalize">{bookingFrequency}</strong></div>
                  <div><span>Période</span><strong>Du {regularStartDate ? new Date(regularStartDate).toLocaleDateString('fr-FR') : '...'} au {regularEndDate ? new Date(regularEndDate).toLocaleDateString('fr-FR') : '...'}</strong></div>
                </>
              )}
            </div>
            
            <p className="room-confirmation-note mt-6">Votre demande sera transmise à la mairie pour validation sous 48h ouvrées.</p>
          </section>
        )}

        <div className="room-navigation">
          {step > 1 ? <button className="room-previous" type="button" onClick={() => { setStep((value) => value - 1); setStepError(''); }}>← Retour</button> : <span />}
          {step < 3 ? (
            <Button type="button" variant="dark" className="room-next" onClick={handleNextStep} disabled={step === 1 && !selectedDate}>
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