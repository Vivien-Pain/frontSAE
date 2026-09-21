'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import Button from '@/components/ui/Button';
import ValidatedInput from '@/components/ui/ValidatedInput';

export default function SubventionPage() {
  const [subventionFile, setSubventionFile] = useState<File | null>(null);
  const [justificatifFile, setJustificatifFile] = useState<File | null>(null);
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    setter(event.target.files?.[0] ?? null);
    setSubmitted(false);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (subventionFile && justificatifFile && amount) {
      setSubmitted(true);
    }
  }

  return (
    <main className="subvention-page">
      <section className="subvention-panel" aria-labelledby="subvention-title">
        <Link className="subvention-back" href="/">
          <span aria-hidden="true">←</span> Retour
        </Link>

        <div className="subvention-breadcrumb">
          <Link href="/">Accueil</Link>
          <span aria-hidden="true">-</span>
          <strong id="subvention-title">Demande de subvention</strong>
        </div>

        <form className="subvention-form" onSubmit={handleSubmit}>
          <div className="subvention-downloads">
            <div className="subvention-download-row">
              <span>Formulaire de subvention à télécharger</span>
              <Button type="button" variant="dark" className="subvention-small-button">Télécharger</Button>
            </div>
            <div className="subvention-download-row">
              <span>Notice</span>
              <Button type="button" variant="dark" className="subvention-small-button">Télécharger</Button>
            </div>
          </div>

          <div className="subvention-fieldset">
            <label className="subvention-label" htmlFor="subvention-file">Formulaire de subvention</label>
            <div className={`subvention-file ${subventionFile ? 'subvention-file-filled' : ''}`}>
              <input
                id="subvention-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleFileChange(event, setSubventionFile)}
              />
              <span>{subventionFile?.name ?? 'Ajoutez votre formulaire de subvention'}</span>
              <span className="subvention-file-icon" aria-hidden="true">⌕</span>
            </div>
          </div>

          <div className="subvention-fieldset subvention-rib">
            <p className="subvention-label">Relevé d’identité bancaire (RIB)</p>
            <ValidatedInput
              label="BIC"
              name="bic"
              placeholder="XXXXFRPPXXX"
              maxLength={11}
              required
            />
            <ValidatedInput
              label="IBAN"
              name="iban"
              placeholder="FRXX XXXX XXXX XXXX XXXX XXXX XXX"
              required
            />
          </div>

          <div className="subvention-extra-fields">
            <div className="subvention-fieldset">
              <label className="subvention-label" htmlFor="justificatif-file">Justificatif</label>
              <div className={`subvention-file ${justificatifFile ? 'subvention-file-filled' : ''}`}>
                <input
                  id="justificatif-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileChange(event, setJustificatifFile)}
                />
                <span>{justificatifFile?.name ?? 'Ajouter un justificatif'}</span>
                <span className="subvention-file-icon" aria-hidden="true">⌕</span>
              </div>
            </div>
            <ValidatedInput
              label="Montant demandé"
              name="amount"
              type="number"
              placeholder="0,00 €"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setSubmitted(false);
              }}
              required
            />
          </div>

          <Button type="submit" variant="dark" className="subvention-submit">Envoyer</Button>
          {submitted && <p className="subvention-success" role="status">Votre demande est prête à être envoyée.</p>}
        </form>
      </section>
    </main>
  );
}
