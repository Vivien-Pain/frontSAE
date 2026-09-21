// app/signup/step2/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Stepper from '@/components/shared/Stepper';
import ValidatedInput from '@/components/ui/ValidatedInput';
import PasswordRequirements, { isPasswordValid } from '@/components/ui/PasswordRequirements';
import TermsModal from '@/components/ui/TermsModal';
import VerificationModal from '@/components/ui/VerificationModal';
import Link from 'next/link';

export default function ContactsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phone, setPhone] = useState('');
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPasswordValid(password) && password === passwordConfirmation && hasAcceptedTerms) {
      setIsVerificationOpen(true);
      console.log('Envoi du code SMS au :', phone);
    }
  };

  const handleVerifyCode = (code: string) => {
    console.log('Vérification du code SMS :', code);
    setIsVerificationOpen(false);
    router.push('/signup/step3');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Stepper currentStep={2} />

        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="rounded-xl border border-[#d9ded9] p-4 shadow-sm sm:p-8">
            
            <div className="mb-8">
              <h2 className="mb-6 border-l-4 border-[#0b644d] pl-3 text-xs font-bold uppercase tracking-widest text-[#1e2420] sm:mb-8">
                CONTACT DE L&apos;ASSOCIATION *
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                <ValidatedInput 
                  label="Nom *" 
                  name="nom" 
                  defaultValue="Dupont" 
                  required 
                  isValid={true} 
                />
                <ValidatedInput 
                  label="Prénom *" 
                  name="prenom" 
                  defaultValue="Jean" 
                  required 
                  isValid={true} 
                />
                
                <ValidatedInput 
                  label="Téléphone *" 
                  type="tel"
                  name="telephone" 
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                  isValid={phone.length >= 10}
                />

                <div className="flex flex-col">
                  <ValidatedInput 
                    label="Mot de passe *" 
                    type="password"
                    name="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    isValid={password.length > 0 && isPasswordValid(password)}
                  >
                    <PasswordRequirements password={password} />
                  </ValidatedInput>
                </div>

                <div className="flex flex-col">
                  <ValidatedInput 
                    label="Confirmation mot de passe *" 
                    type="password"
                    name="password_confirmation" 
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required 
                    isValid={passwordConfirmation.length > 0 && password === passwordConfirmation}
                  />
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <input
                    id="contact-terms"
                    type="checkbox"
                    checked={hasAcceptedTerms}
                    onChange={(event) => setHasAcceptedTerms(event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0b644d]"
                  />
                  <label htmlFor="contact-terms" className="text-xs leading-relaxed text-[#6d746e]">
                    J&apos;accepte les <button type="button" onClick={() => setIsTermsOpen(true)} className="font-bold text-[#0b644d] underline">conditions générales d&apos;utilisation</button>.
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-between gap-6 border-t border-[#d9ded9] pt-6 sm:mt-12 sm:flex-row sm:items-center">
                <a href="#" className="text-center text-xs text-[#6d746e] hover:text-[#1e2420] hover:underline sm:text-left">
                ❔ Besoin d&apos;aide ? Contactez la mairie →
              </a>
              
              <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
                <div className="flex w-full gap-3 sm:w-auto">
                  <Link 
                    href="/signup"
                    className="flex-1 rounded-md border border-[#d9ded9] bg-white px-4 py-3 text-center text-xs font-bold text-[#1e2420] transition-colors hover:bg-[#f7f8f4] sm:flex-none sm:px-6"
                  >
                    ← Retour
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 rounded-md bg-[#0b644d] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#084e3c] sm:flex-none sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!phone || !isPasswordValid(password) || password !== passwordConfirmation || !hasAcceptedTerms}
                  >
                    Continuer →
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onVerify={handleVerifyCode}
        recipient={phone}
        channel="sms"
      />
      {isTermsOpen && <TermsModal onClose={() => setIsTermsOpen(false)} />}
    </div>
  );
}