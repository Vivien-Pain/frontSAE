'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import RoomCalendar, { monthNames } from '@/components/ui/RoomCalendar';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 10, 17));
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].name);
  
  const [isRegularBooking, setIsRegularBooking] = useState(false);
  const [bookingFrequency, setBookingFrequency] = useState('hebdomadaire');
  const [regularStartDate, setRegularStartDate] = useState('');
  const [regularEndDate, setRegularEndDate] = useState('');

  const selectedDateFull = selectedDate ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()].toLowerCase()} ${selectedDate.getFullYear()}` : '';

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
              onNextStep={() => setStep(2)}
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
              {rooms.map((room) => (
                <button className={`room-card ${room.color} ${selectedRoom === room.name ? 'room-card-selected' : ''}`} type="button" key={room.name} onClick={() => setSelectedRoom(room.name)}>
                  <span className="room-card-visual" aria-hidden="true" />
                  <strong>{room.name}</strong>
                  <span>{room.capacity}</span>
                </button>
              ))}
            </div>

            <div className="mt-10 border-t border-[#d9ded9] pt-8">
              <label className="flex items-center gap-3 cursor-pointer mb-6">
                <input 
                  type="checkbox" 
                  checked={isRegularBooking}
                  onChange={(e) => setIsRegularBooking(e.target.checked)}
                  className="w-4 h-4 accent-[#0b644d]"
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1e2420]">
                  Réservation régulière
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
                      <input type="text" placeholder="jj/mm/AAAA" value={regularStartDate} onChange={(e) => setRegularStartDate(e.target.value)} className="border border-[#d9ded9] bg-[#f2f7f5] px-3 py-2 text-xs w-32 outline-none focus:border-[#0b644d]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-[#6d746e] uppercase">Fin</span>
                      <input type="text" placeholder="jj/mm/AAAA" value={regularEndDate} onChange={(e) => setRegularEndDate(e.target.value)} className="border border-[#d9ded9] bg-[#f2f7f5] px-3 py-2 text-xs w-32 outline-none focus:border-[#0b644d]" />
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
              <div><span>Date</span><strong>{selectedDateFull} (Journée complète)</strong></div>
              <div><span>Salle</span><strong>{selectedRoom}</strong></div>
              {isRegularBooking && (
                <>
                  <div><span>Récurrence</span><strong className="capitalize">{bookingFrequency}</strong></div>
                  <div><span>Période</span><strong>Du {regularStartDate || '...'} au {regularEndDate || '...'}</strong></div>
                </>
              )}
            </div>
            
            <p className="room-confirmation-note mt-6">Votre demande sera transmise à la mairie pour validation sous 48h ouvrées.</p>
          </section>
        )}

        <div className="room-navigation">
          {step > 1 ? <button className="room-previous" type="button" onClick={() => setStep((value) => value - 1)}>← Retour</button> : <span />}
          {step < 3 ? (
            <Button type="button" variant="dark" className="room-next" onClick={() => setStep((value) => value + 1)} disabled={step === 1 && !selectedDate}>
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