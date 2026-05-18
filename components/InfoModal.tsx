import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import CloseIcon from './icons/CloseIcon';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { t } from '../i18n';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, language }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'privacy'>('info');

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setActiveTab('info');
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    const isMobile = window.innerWidth < 640;
    setTimeout(() => onClose(), isMobile ? 200 : 120);
  };

  const trapRef = useFocusTrap(isOpen && !isClosing, handleClose);

  if (!isOpen && !isClosing) return null;

  const it = {
    title: 'Informazioni',
    subtitle: 'Assistente AI per locali vegani',
    tabInfo: 'Informazioni',
    tabPrivacy: 'Privacy e AI',
    close: 'Chiudi',
    version: 'Versione',

    about: "Cos'è questo assistente?",
    aboutText: "Un assistente AI che ti aiuta a trovare locali vegani e vegan-friendly in Puglia. Attraverso una conversazione naturale puoi cercare ristoranti, bar, negozi, B&B e molto altro con anteprime di mappa e informazioni dettagliate per ogni locale.",

    featuresTitle: 'Cosa puoi fare',
    features: [
      'Cercare locali vegani e vegan-friendly in tutta la Puglia',
      'Ricevere suggerimenti personalizzati in base alle tue preferenze',
      'Visualizzare anteprime Google Maps per ogni locale',
      'Pianificare itinerari gastronomici',
      'Confrontare locali tra loro',
      'Salvare le conversazioni per ritrovare i tuoi posti preferiti',
    ],

    dbTitle: 'I dati',
    dbText: 'Tutti i dati provengono da un database curato che cataloga attività vegane e vegan-friendly in Puglia. L\'assistente usa questo database come unica fonte di informazioni.',

    privacyIntro: 'Questa pagina spiega in modo trasparente come l\'assistente gestisce i tuoi dati e quale tecnologia AI utilizza.',

    aiTitle: 'Tecnologia AI',
    aiText: "L'assistente utilizza le API di Mistral AI, un'azienda francese con sede a Parigi soggetta alla normativa europea sulla protezione dei dati (GDPR). I messaggi che invii vengono elaborati dai server di Mistral per generare le risposte. Ti consigliamo di non inserire dati personali sensibili nelle conversazioni.",
    aiLinkLabel: 'Leggi la privacy policy di Mistral AI',

    dataTitle: 'Dati raccolti e conservati',
    dataItems: [
      { label: 'Messaggi della chat', value: 'Inviati a Mistral AI per generare le risposte. Non vengono salvati su server esterni.' },
      { label: 'Impostazioni (nome, tema, lingua)', value: 'Salvate esclusivamente nel tuo browser (localStorage). Non vengono mai trasmesse a server esterni.' },
      { label: 'Cronologia delle chat', value: 'Salvata esclusivamente nel tuo browser (localStorage). Puoi cancellarla in qualsiasi momento dalle impostazioni.' },
      { label: 'Dati analitici', value: 'Nessuno. L\'assistente non utilizza cookie di tracciamento né strumenti di analytics.' },
    ],

    rightsTitle: 'I tuoi diritti (GDPR)',
    rightsText: "Ai sensi del Regolamento UE 2016/679 (GDPR) hai diritto di accesso, rettifica, cancellazione e portabilità dei tuoi dati. Poiché i dati personali sono conservati solo nel tuo browser puoi esercitare questi diritti direttamente cancellando i dati del browser o la cronologia dalle impostazioni.",
  };

  const en = {
    title: 'About',
    subtitle: 'AI assistant for vegan venues',
    tabInfo: 'Information',
    tabPrivacy: 'Privacy & AI',
    close: 'Close',
    version: 'Version',

    about: 'What is this assistant?',
    aboutText: 'An AI assistant that helps you find vegan and vegan-friendly venues in Puglia. Through natural conversation you can search for restaurants, cafes, shops, B&Bs and more, with map previews and detailed information for each venue.',

    featuresTitle: 'What you can do',
    features: [
      'Search for vegan and vegan-friendly venues across Puglia',
      'Receive personalized suggestions based on your preferences',
      'View Google Maps previews for every venue',
      'Plan gastronomic itineraries',
      'Compare venues with each other',
      'Save conversations to find your favorite places again',
    ],

    dbTitle: 'The data',
    dbText: 'All data comes from a curated database that catalogs vegan and vegan-friendly businesses in Puglia. The assistant uses this database as its sole source of information.',

    privacyIntro: 'This page transparently explains how the assistant handles your data and what AI technology it uses.',

    aiTitle: 'AI technology',
    aiText: "The assistant uses the Mistral AI API, a French company headquartered in Paris, subject to European data protection regulations (GDPR). The messages you send are processed by Mistral's servers to generate responses. We recommend not entering sensitive personal data in conversations.",
    aiLinkLabel: "Read Mistral AI's privacy policy",

    dataTitle: 'Data collected and stored',
    dataItems: [
      { label: 'Chat messages', value: 'Sent to Mistral AI to generate responses. Not saved on external servers.' },
      { label: 'Settings (name, theme, language)', value: 'Saved exclusively in your browser (localStorage). Never transmitted to external servers.' },
      { label: 'Chat history', value: 'Saved exclusively in your browser (localStorage). You can delete it at any time from settings.' },
      { label: 'Analytics data', value: 'None. The assistant does not use tracking cookies or analytics tools.' },
    ],

    rightsTitle: 'Your rights (GDPR)',
    rightsText: 'Under EU Regulation 2016/679 (GDPR), you have the right of access, rectification, erasure and portability of your data. Since personal data is stored only in your browser, you can exercise these rights directly by clearing your browser data or chat history from settings.',
  };

  const c = language === 'it' ? it : en;

  const tabClass = (tab: 'info' | 'privacy') =>
    `py-2 px-5 text-sm font-medium rounded-lg transition-colors duration-150 ${
      activeTab === tab
        ? 'bg-white dark:bg-gray-700 text-[#465E32] dark:text-[#b5c589] shadow-sm ring-1 ring-[#465E32]/20 dark:ring-[#b5c589]/20'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
    }`;

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center sm:p-4"
      onClick={handleClose}
      style={{ animation: isClosing ? 'fadeOut 80ms ease-out' : 'fadeIn 80ms ease-out', opacity: isClosing ? 0 : 1 }}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        className={`bg-[#f4f3ee] dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl flex flex-col h-[92vh] sm:h-[600px] sm:max-h-[90vh] ${isClosing ? 'modal-panel-closing' : 'modal-panel'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-shrink-0 relative p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-3" />
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors duration-150"
            aria-label={t('close', language)}
          >
            <CloseIcon />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#465E32] dark:text-[#b5c589]">{c.title}</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{c.subtitle}</p>
          </div>
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex gap-2">
            <button className={tabClass('info')} onClick={() => setActiveTab('info')}>{c.tabInfo}</button>
            <button className={tabClass('privacy')} onClick={() => setActiveTab('privacy')}>{c.tabPrivacy}</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 sm:space-y-7">

          {activeTab === 'info' && (
            <>
              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-2">{c.about}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{c.aboutText}</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-3">{c.featuresTitle}</h3>
                <ul className="space-y-2">
                  {c.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-[#b5c589]/40 dark:bg-[#b5c589]/20 flex items-center justify-center">
                        <span className="block h-1.5 w-1.5 rounded-full bg-[#465E32] dark:bg-[#b5c589]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-2">{c.dbTitle}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{c.dbText}</p>
              </section>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500">{c.version} 1.0.0</p>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">{c.privacyIntro}</p>

              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-2">{c.aiTitle}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{c.aiText}</p>
                <a
                  href="https://legal.mistral.ai/terms/privacy-policy?language=it-IT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#465E32] dark:text-[#b5c589] hover:underline"
                >
                  {c.aiLinkLabel} →
                </a>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-3">{c.dataTitle}</h3>
                <div className="space-y-2">
                  {c.dataItems.map((item, i) => (
                    <div key={i} className="rounded-xl bg-white/60 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-700/50 p-3 sm:p-4">
                      <p className="text-xs font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-1">{item.label}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-[#465E32] dark:text-[#b5c589] uppercase tracking-wide mb-2">{c.rightsTitle}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{c.rightsText}</p>
              </section>
            </>
          )}

        </div>

        <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={handleClose}
            className="w-full py-2.5 sm:py-3 px-4 bg-[#465E32] hover:bg-[#3a4f28] text-white font-semibold text-sm sm:text-base rounded-xl shadow-sm transition-colors duration-150"
          >
            {c.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
