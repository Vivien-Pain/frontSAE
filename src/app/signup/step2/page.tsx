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
  const [formError, setFormError] = useState('');
  
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = event.target.value.replace(/\D/g, '');
    setPhone(onlyNums.slice(0, 10));
    setFormError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (phone.length !== 10) {
      setFormError("Erreur : le numéro de téléphone doit contenir exactement 10 chiffres (ex: 0612345678).");
      return;
    }

    if (!isPasswordValid(password)) {
       setFormError("Erreur : le mot de passe ne respecte pas les critères de sécurité exigés.");
       return;
    }

    if (password !== passwordConfirmation) {
      setFormError("Erreur : la confirmation du mot de passe ne correspond pas.");
      return;
    }

    if (!hasAcceptedTerms) {
      setFormError("Erreur : vous devez accepter les conditions générales d'utilisation pour continuer.");
      return;
    }

    setIsVerificationOpen(true);
  };

  const handleVerifyCode = (code: string) => {
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
            
            {formError && (
              <div className="mb-8 flex items-start gap-3 rounded-md border border-[#f3dada] bg-[#fdf2f2] p-4 text-[#b54b4b] shadow-sm animate-in fade-in">
                <svg className="mt-0.5 h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-bold leading-relaxed">{formError}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="mb-6 border-l-4 border-[#0b644d] pl-3 text-xs font-bold uppercase tracking-widest text-[#1e2420] sm:mb-8">
                CONTACT DE L'ASSOCIATION *
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
                  onChange={handlePhoneChange}
                  placeholder="0612345678"
                  required
                  isValid={phone.length === 10}
                />

                <div className="flex flex-col">
                  <ValidatedInput 
                    label="Mot de passe *" 
                    type="password"
                    name="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormError('');
                    }}
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
                    onChange={(e) => {
                      setPasswordConfirmation(e.target.value);
                      setFormError('');
                    }}
                    required 
                    isValid={passwordConfirmation.length > 0 && password === passwordConfirmation}
                  />
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <input
                    id="contact-terms"
                    type="checkbox"
                    checked={hasAcceptedTerms}
                    onChange={(event) => {
                      setHasAcceptedTerms(event.target.checked);
                      setFormError('');
                    }}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#0b644d]"
                  />
                  <label htmlFor="contact-terms" className="text-xs leading-relaxed text-[#6d746e]">
                    J'accepte les <button type="button" onClick={() => setIsTermsOpen(true)} className="font-bold text-[#0b644d] underline">conditions générales d'utilisation</button>.
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse justify-between gap-6 border-t border-[#d9ded9] pt-6 sm:mt-12 sm:flex-row sm:items-center">
                <a href="#" className="text-center text-xs text-[#6d746e] hover:text-[#1e2420] hover:underline sm:text-left">
                  Besoin d'aide ? Contactez la mairie 
               </a>
              
              <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
                <div className="flex w-full gap-3 sm:w-auto">
                  <Link 
                    href="/signup"
                    className="flex-1 rounded-md border border-[#d9ded9] bg-white px-4 py-3 text-center text-xs font-bold text-[#1e2420] transition-colors hover:bg-[#f7f8f4] sm:flex-none sm:px-6"
                  >
                      Retour
                  </Link>
                  <button
                    type="submit"
                    className="flex-1 rounded-md bg-[#0b644d] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#084e3c] sm:flex-none sm:px-6 disabled:opacity-50 disabled:cursor-not-allowed"
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