'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Button from '@/components/ui/Button';

function EditIcon() {
  return (
    <svg aria-hidden="true" className="profile-edit-icon" viewBox="0 0 24 24" fill="none">
      <path d="m15.5 5.5 3 3M4 20l4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProfilePage() {
  const [phone, setPhone] = useState('06 XX XX XX XX');
  const [email, setEmail] = useState('monadresse@domaine.fr');
  const [password, setPassword] = useState('');
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaved(true);
  }

  return (
    <main className="profile-page">
      <section className="profile-panel" aria-labelledby="profile-title">
        <Link className="profile-back" href="/">
          <span aria-hidden="true">←</span> Retour
        </Link>

        <div className="profile-breadcrumb">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">-</span>
          <strong id="profile-title">Mon profil</strong>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <h1>Modifier votre profil</h1>

          <label className="profile-field">
            <span>Numéro de téléphone</span>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} />
          </label>

          <label className="profile-field">
            <span>Adresse électronique</span>
            <span className="profile-input-wrap">
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <EditIcon />
            </span>
          </label>

          <div className="profile-field">
            <span>Mot de passe</span>
            <button className="profile-input-wrap profile-password-button" type="button" onClick={() => setIsPasswordOpen(true)}>
              <input type="password" value="********" readOnly aria-label="Mot de passe masqué" />
              <EditIcon />
            </button>
          </div>

          <Button type="submit" variant="dark" className="profile-submit">Valider</Button>
          {isSaved && <p className="profile-notice" role="status">Vos informations ont bien été enregistrées.</p>}
        </form>
      </section>

      {isPasswordOpen && (
        <div className="profile-modal-backdrop" role="presentation" onClick={() => setIsPasswordOpen(false)}>
          <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="password-title" onClick={(event) => event.stopPropagation()}>
            <button className="profile-modal-close" type="button" aria-label="Fermer" onClick={() => setIsPasswordOpen(false)}>×</button>
            <h2 id="password-title">Confirmer votre mot de passe</h2>
            <input
              autoFocus
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button type="button" variant="dark" className="profile-modal-submit" onClick={() => setIsPasswordOpen(false)}>
              Confirmer
            </Button>
          </section>
        </div>
      )}
    </main>
  );
}
