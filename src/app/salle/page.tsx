'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';

const rooms = [
  { name: 'Gymnase municipal', capacity: '180 personnes', color: 'room-blue' },
  { name: 'Salle des fêtes', capacity: '120 personnes', color: 'room-green' },
  { name: 'Salle polyvalente', capacity: '60 personnes', color: 'room-orange' },
  { name: 'Salle annexe', capacity: '35 personnes', color: 'room-sage' },
  { name: 'Grande salle', capacity: '90 personnes', color: 'room-green' },
  { name: 'Salle associative', capacity: '35 personnes', color: 'room-blue' },
];

const times = ['09:00 - 12:00', '14:00 - 17:00', '18:00 - 22:00'];

function buildNovemberDays() {
  const days = [];
  const firstDay = new Date(2026, 10, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  for (let index = 0; index < offset; index += 1) days.push(null);
  for (let day = 1; day <= 30; day += 1) days.push(day);
  return days;
}

export default function SallePage() {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(17);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].name);
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [isDayMenuOpen, setIsDayMenuOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const [roomFilter, setRoomFilter] = useState('Toutes les salles');
  const days = useMemo(buildNovemberDays, []);
  const roomFilters = ['Toutes les salles', ...rooms.map((room) => room.name)];
  const visibleRooms = rooms.filter((room) => roomFilter === 'Toutes les salles' || room.name === roomFilter);

  const selectedDate = `${selectedDay} novembre 2026`;

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
          <section className="room-section" aria-labelledby="date-title">
            <div className="room-section-heading">
              <p className="room-eyebrow">Étape 1 sur 3</p>
              <h1 id="date-title">Choisissez une date</h1>
              <p>Sélectionnez le jour où vous souhaitez réserver une salle.</p>
            </div>
            <div className="room-calendar-toolbar">
              <div className="room-view-tabs" aria-label="Vue du calendrier">
                <button className={calendarView === 'month' ? 'room-view-active' : ''} type="button" onClick={() => setCalendarView('month')}>Mois</button>
                <button className={calendarView === 'week' ? 'room-view-active' : ''} type="button" onClick={() => setCalendarView('week')}>Semaine</button>
                <button type="button">Jour</button>
              </div>
              <div className="room-filter-tabs" aria-label="Filtrer les salles">
                {roomFilters.map((filter) => (
                  <button className={roomFilter === filter ? 'room-filter-active' : ''} type="button" key={filter} onClick={() => { setRoomFilter(filter); setIsDayMenuOpen(false); }}>{filter}</button>
                ))}
              </div>
            </div>
            <div className="room-calendar" aria-label="Calendrier novembre 2026">
              <div className="room-calendar-header">
                <button type="button" aria-label="Mois précédent">←</button>
                <strong>Novembre 2026</strong>
                <button type="button" aria-label="Mois suivant">→</button>
              </div>
              <div className="room-weekdays">{(calendarView === 'month' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] : ['Lun 16', 'Mar 17', 'Mer 18', 'Jeu 19', 'Ven 20', 'Sam 21', 'Dim 22']).map((day) => <span key={day}>{day}</span>)}</div>
              <div className={`room-days ${calendarView === 'week' ? 'room-week-view' : ''}`}>
                {(calendarView === 'month' ? days : [16, 17, 18, 19, 20, 21, 22]).map((day, index) => day ? (
                  <button className={selectedDay === day ? 'room-day-selected' : ''} type="button" key={day} onClick={() => { setSelectedDay(day); setIsDayMenuOpen(true); }}>
                    <span>{day}</span>
                    <small>{roomFilter === 'Toutes les salles' ? `${rooms.length} salles` : 'Disponible'}</small>
                  </button>
                ) : <span key={`empty-${index}`} />)}
              </div>
            </div>
            {isDayMenuOpen && (
              <div className="room-day-popover">
                <button className="room-popover-close" type="button" onClick={() => setIsDayMenuOpen(false)}>×</button>
                <p>Disponibilités du {selectedDate}</p>
                <strong>{visibleRooms[0]?.name ?? rooms[0].name}</strong>
                <span>09:00 - 12:00 disponible</span>
                <button className="room-popover-action" type="button" onClick={() => { setIsDayMenuOpen(false); setStep(2); }}>Voir les salles</button>
              </div>
            )}
            <div className="room-selection-line"><span>Date choisie</span><strong>{selectedDate}</strong></div>
          </section>
        )}

        {step === 2 && (
          <section className="room-section" aria-labelledby="room-choice-title">
            <div className="room-section-heading">
              <p className="room-eyebrow">Étape 2 sur 3</p>
              <h1 id="room-choice-title">Choisissez une salle</h1>
              <p>Les disponibilités sont affichées pour le {selectedDate}.</p>
            </div>
            <div className="room-card-grid">
              {visibleRooms.map((room) => (
                <button className={`room-card ${room.color} ${selectedRoom === room.name ? 'room-card-selected' : ''}`} type="button" key={room.name} onClick={() => setSelectedRoom(room.name)}>
                  <span className="room-card-visual" aria-hidden="true" />
                  <strong>{room.name}</strong>
                  <span>{room.capacity}</span>
                </button>
              ))}
            </div>
            <div className="room-times">
              <p className="room-label">Créneau disponible</p>
              <div>{times.map((time) => <button className={selectedTime === time ? 'room-time-selected' : ''} type="button" key={time} onClick={() => setSelectedTime(time)}>{time}</button>)}</div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="room-section room-confirmation" aria-labelledby="confirmation-title">
            <p className="room-eyebrow">Étape 3 sur 3</p>
            <h1 id="confirmation-title">Votre réservation</h1>
            <p>Vérifiez les informations avant de confirmer votre demande.</p>
            <div className="room-summary">
              <div><span>Date</span><strong>{selectedDate}</strong></div>
              <div><span>Salle</span><strong>{selectedRoom}</strong></div>
              <div><span>Créneau</span><strong>{selectedTime}</strong></div>
            </div>
            <p className="room-confirmation-note">Votre demande sera transmise à la mairie pour validation.</p>
          </section>
        )}

        <div className="room-navigation">
          {step > 1 ? <button className="room-previous" type="button" onClick={() => setStep((value) => value - 1)}>← Retour</button> : <span />}
          {step < 3 ? <Button type="button" variant="dark" className="room-next" onClick={() => setStep((value) => value + 1)}>Continuer →</Button> : <Button type="button" variant="dark" className="room-next" onClick={() => setStep(1)}>Confirmer la demande</Button>}
        </div>
      </section>
    </main>
  );
}
