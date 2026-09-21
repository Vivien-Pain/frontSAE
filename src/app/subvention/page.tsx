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
  const [formError, setFormError] = useState('');

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void,
  ) => {
    setter(event.target.files?.[0] ?? null);
    setSubmitted(false);
    setFormError('');
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    
    val = val.replace(/^0+(?=\d)/, '');
    
    if (Number(val) > 10000) {
      val = '10000';
    }
    
    setAmount(val);
    setSubmitted(false);
    setFormError('');
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSubmitted(false);

    if (!subventionFile) {
      setFormError('Le formulaire de subvention est obligatoire pour poursuivre la demande.');
      return;
    }
    
    if (!justificatifFile) {
      setFormError('Un document justificatif est obligatoire pour poursuivre la demande.');
      return;
    }

    const numericAmount = Number(amount);

    if (numericAmount < 100) {
      setFormError('Le montant de la subvention demandée doit être au minimum de 100 €.');
      return;
    }

    if (numericAmount > 10000) {
      setFormError('Le montant de la subvention demandée ne peut pas dépasser 10 000 €.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="subvention-page">
      <style dangerouslySetInnerHTML={{ __html: `
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />

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
          
          {formError && (
            <div className="mb-8 flex items-start gap-3 rounded-md border border-[#f3dada] bg-[#fdf2f2] p-4 text-[#b54b4b] shadow-sm animate-in fade-in">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-bold leading-relaxed">{formError}</p>
            </div>
          )}

          <div className="subvention-downloads">
            <div className="subvention-download-row">
              <span>Formulaire de subvention à charger</span>
              <Button type="button" variant="dark" className="subvention-small-button">Télécharger</Button>
            </div>
            <div className="subvention-download-row">
              <span>Notice</span>
              <Button type="button" variant="dark" className="subvention-small-button">Télécharger</Button>
            </div>
          </div>

          <div className="subvention-fieldset">
            <label className="subvention-label" htmlFor="subvention-file">Formulaire de subvention</label>
            <div className={`subvention-file ${subventionFile ? 'subvention-file-filled' : ''} relative`}>
              <input
                id="subvention-file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(event) => handleFileChange(event, setSubventionFile)}
              />
              <span>{subventionFile?.name ?? 'Ajoutez votre formulaire de subvention'}</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center border border-currentColor rounded-sm text-base font-medium leading-none pointer-events-none" aria-hidden="true">+</span>
            </div>
          </div>

          <div className="subvention-fieldset subvention-rib">
            <p className="subvention-label">Relevé identité bancaire (RIB)</p>
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
              minLength={27}
              maxLength={27}
              required
            />
          </div>

          <div className="subvention-extra-fields">
            <div className="subvention-fieldset">
              <label className="subvention-label" htmlFor="justificatif-file">Justificatif</label>
              <div className={`subvention-file ${justificatifFile ? 'subvention-file-filled' : ''} relative`}>
                <input
                  id="justificatif-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileChange(event, setJustificatifFile)}
                />
                <span>{justificatifFile?.name ?? 'Ajouter un justificatif'}</span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center border border-currentColor rounded-sm text-base font-medium leading-none pointer-events-none" aria-hidden="true">+</span>
              </div>
            </div>
            
            <div className="relative">
              <ValidatedInput
                label="Montant demandé"
                name="amount"
                type="number"
                min="100"
                max="10000"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={handleAmountChange}
                required
                className="pr-8"
              />
              <span className="absolute right-4 top-[35px] font-bold text-[#1e2420] pointer-events-none">€</span>
            </div>
          </div>

          <Button type="submit" variant="dark" className="subvention-submit">Envoyer</Button>

          {submitted && <p className="subvention-success" role="status">Votre demande est prête à être envoyée.</p>}
        </form>
      </section>
    </main>
  );
}