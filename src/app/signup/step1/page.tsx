'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import HelpSidebar from '@/components/shared/HelpSidebar';
import Stepper from '@/components/shared/Stepper';
import ValidatedInput from '@/components/ui/ValidatedInput';
import CategorySelector from '@/components/ui/CategorySelector';
import Link from 'next/link';

export default function AssociationPage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push('/signup/step2');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <Stepper currentStep={1} />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <form onSubmit={handleSubmit} className="rounded-xl border border-[#d9ded9] p-4 shadow-sm sm:p-8">
            
            <div className="mb-8">
              <h2 className="mb-6 border-l-4 border-[#0b644d] pl-3 text-xs font-bold uppercase tracking-widest text-[#1e2420] sm:mb-8">
                INFORMATIONS GÉNÉRALES
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                <ValidatedInput 
                  label="Nom de l&apos;association *" 
                  name="associationName" 
                  placeholder="Ex. Les amis du parc" 
                  required
                />
                <ValidatedInput 
                  label="Numéro RNA ou SIRET *" 
                  name="registrationNumber" 
                  placeholder="W872001234" 
                  required
                />
                
                <ValidatedInput 
                  label="Date de création *" 
                  type="date"
                  name="creationDate" 
                  required
                />
                <ValidatedInput 
                  label="Nombre de membres *" 
                  type="number"
                  name="memberCount" 
                  min="1"
                  required
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-[#1e2420]">Catégorie d&apos;activité *</label>
                  <CategorySelector />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="purpose" className="mb-2 block text-xs font-bold text-[#1e2420]">Objet de l&apos;association *</label>
                  <textarea id="purpose" name="purpose" required rows={3} placeholder="Décrivez brièvement les activités de votre association..." className="w-full resize-y rounded-md border border-[#d9ded9] bg-white px-3 py-3 text-sm outline-none focus:border-[#0b644d] focus:ring-1 focus:ring-[#0b644d]" />
                </div>

                <div className="sm:col-span-2">
                  <ValidatedInput label="Adresse du siège social *" name="headOfficeAddress" placeholder="12 rue des Lilas, 87220 Feytiat" required />
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
                    href="/"
                    className="flex-1 rounded-md border border-[#d9ded9] bg-white px-4 py-3 text-center text-xs font-bold text-[#1e2420] transition-colors hover:bg-[#f7f8f4] sm:flex-none sm:px-6"
                  >
                    ← Retour
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
          <HelpSidebar />
        </div>
      </main>
    </div>
  );
}