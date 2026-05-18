import React, { useMemo } from 'react';
import { Language } from '../types';
import { t } from '../i18n';

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  language: Language;
}

const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ onSuggestionClick, language }) => {
  const allSuggestionsIt = [
    { emoji: '🍕', text: 'Dove mangiare a Bari', query: 'Dove posso mangiare a Bari?' },
    { emoji: '☕', text: 'Colazione a Lecce', query: 'Dove posso fare colazione a Lecce?' },
    { emoji: '🏨', text: 'B&B vegan-friendly', query: 'Quali sono i B&B vegan-friendly in Puglia?' },
    { emoji: '🛍️', text: 'Negozi bio', query: 'Dove posso trovare negozi bio in Puglia?' },
    { emoji: '🗺️', text: 'Tour del Salento', query: 'Pianificami un tour gastronomico vegano del Salento' },
    { emoji: '🌊', text: 'Locali sul mare', query: 'Quali locali vegani ci sono sul mare?' },
    { emoji: '🍝', text: 'Ristoranti a Foggia', query: 'Quali ristoranti vegani ci sono a Foggia?' },
    { emoji: '🥗', text: 'Pranzo veloce a Taranto', query: 'Dove posso fare un pranzo veloce vegano a Taranto?' },
    { emoji: '🍰', text: 'Dolci vegani', query: 'Dove posso trovare dolci vegani in Puglia?' },
    { emoji: '🍷', text: 'Aperitivo a Brindisi', query: 'Dove posso fare un aperitivo vegano a Brindisi?' },
    { emoji: '🌮', text: 'Cucina etnica', query: 'Ci sono ristoranti etnici vegani in Puglia?' },
    { emoji: '🏖️', text: 'Locali a Polignano', query: 'Quali locali vegani ci sono a Polignano a Mare?' },
    { emoji: '🎂', text: 'Pasticcerie vegane', query: 'Dove posso trovare pasticcerie vegane in Puglia?' },
    { emoji: '🥙', text: 'Street food vegano', query: 'Dove posso trovare street food vegano in Puglia?' },
    { emoji: '🌿', text: 'Ristoranti bio', query: 'Quali sono i ristoranti bio in Puglia?' },
    { emoji: '🍜', text: 'Cucina asiatica', query: 'Ci sono ristoranti asiatici vegani in Puglia?' },
    { emoji: '🥐', text: 'Colazione a Bari', query: 'Dove posso fare colazione vegana a Bari?' },
    { emoji: '🍔', text: 'Burger vegani', query: 'Dove posso trovare burger vegani in Puglia?' },
    { emoji: '🍨', text: 'Gelato vegano', query: 'Dove posso trovare gelato vegano in Puglia?' },
    { emoji: '🌯', text: 'Pranzo a Lecce', query: 'Dove posso pranzare a Lecce?' },
    { emoji: '🥘', text: 'Cucina mediterranea', query: 'Quali locali offrono cucina mediterranea vegana?' },
    { emoji: '🍱', text: 'Poke bowl vegani', query: 'Dove posso trovare poke bowl vegani in Puglia?' },
    { emoji: '🥤', text: 'Smoothie bar', query: 'Ci sono smoothie bar vegani in Puglia?' },
    { emoji: '🥣', text: 'Colazione e brunch', query: 'Dove posso fare colazione o brunch in Puglia?' },
    { emoji: '🥪', text: 'Panini vegani', query: 'Dove posso trovare panini vegani in Puglia?' },
    { emoji: '🍛', text: 'Cucina indiana', query: 'Ci sono ristoranti indiani vegani in Puglia?' },
    { emoji: '🥟', text: 'Ravioli vegani', query: 'Dove posso mangiare ravioli vegani in Puglia?' },
    { emoji: '🥙', text: 'Panzerotti vegani', query: 'Dove posso trovare panzerotti vegani in Puglia?' },
    { emoji: '🌱', text: 'Locali a Ostuni', query: 'Quali locali vegani ci sono a Ostuni?' },
    { emoji: '🍴', text: 'Cena romantica', query: 'Dove posso fare una cena romantica vegana in Puglia?' },
    { emoji: '🍲', text: 'Cucina tradizionale', query: 'Quali locali offrono cucina pugliese tradizionale vegana?' },
    { emoji: '🧃', text: 'Bar e caffetterie', query: 'Quali sono i migliori bar e caffetterie vegani?' },
    { emoji: '🥖', text: 'Focaccia vegana', query: 'Dove posso trovare focaccia vegana in Puglia?' },
    { emoji: '🍹', text: 'Cocktail bar', query: 'Dove posso trovare cocktail bar vegani in Puglia?' },
    { emoji: '🌮', text: 'Cucina messicana', query: 'Ci sono ristoranti messicani vegani in Puglia?' },
    { emoji: '🍜', text: 'Ramen e noodles', query: 'Dove posso trovare ramen vegani in Puglia?' },
    { emoji: '🥘', text: 'Locali a Monopoli', query: 'Quali locali vegani ci sono a Monopoli?' },
    { emoji: '🍕', text: 'Pizzerie vegane', query: 'Quali sono le migliori pizzerie vegane in Puglia?' },
    { emoji: '🥗', text: 'Insalate e bowl', query: 'Dove posso trovare insalate e bowl vegani in Puglia?' },
  ];

  const allSuggestionsEn = [
    { emoji: '🍕', text: 'Where to eat in Bari', query: 'Where can I eat in Bari?' },
    { emoji: '☕', text: 'Breakfast in Lecce', query: 'Where can I have breakfast in Lecce?' },
    { emoji: '🏨', text: 'Vegan-friendly B&Bs', query: 'What are the vegan-friendly B&Bs in Puglia?' },
    { emoji: '🛍️', text: 'Organic shops', query: 'Where can I find organic shops in Puglia?' },
    { emoji: '🗺️', text: 'Salento tour', query: 'Plan me a vegan gastronomic tour of Salento' },
    { emoji: '🌊', text: 'Seaside venues', query: 'What vegan venues are there by the sea?' },
    { emoji: '🍝', text: 'Restaurants in Foggia', query: 'What vegan restaurants are there in Foggia?' },
    { emoji: '🥗', text: 'Quick lunch in Taranto', query: 'Where can I have a quick vegan lunch in Taranto?' },
    { emoji: '🍰', text: 'Vegan desserts', query: 'Where can I find vegan desserts in Puglia?' },
    { emoji: '🍷', text: 'Aperitivo in Brindisi', query: 'Where can I have a vegan aperitivo in Brindisi?' },
    { emoji: '🌮', text: 'Ethnic cuisine', query: 'Are there vegan ethnic restaurants in Puglia?' },
    { emoji: '🏖️', text: 'Venues in Polignano', query: 'What vegan venues are there in Polignano a Mare?' },
    { emoji: '🎂', text: 'Vegan bakeries', query: 'Where can I find vegan bakeries in Puglia?' },
    { emoji: '🥙', text: 'Vegan street food', query: 'Where can I find vegan street food in Puglia?' },
    { emoji: '🌿', text: 'Organic restaurants', query: 'What are the organic restaurants in Puglia?' },
    { emoji: '🍜', text: 'Asian cuisine', query: 'Are there vegan Asian restaurants in Puglia?' },
    { emoji: '🥐', text: 'Breakfast in Bari', query: 'Where can I have vegan breakfast in Bari?' },
    { emoji: '🍔', text: 'Vegan burgers', query: 'Where can I find vegan burgers in Puglia?' },
    { emoji: '🍨', text: 'Vegan ice cream', query: 'Where can I find vegan ice cream in Puglia?' },
    { emoji: '🌯', text: 'Lunch in Lecce', query: 'Where can I have lunch in Lecce?' },
    { emoji: '🥘', text: 'Mediterranean cuisine', query: 'What venues offer vegan Mediterranean cuisine?' },
    { emoji: '🍱', text: 'Vegan poke bowls', query: 'Where can I find vegan poke bowls in Puglia?' },
    { emoji: '🥤', text: 'Smoothie bars', query: 'Are there vegan smoothie bars in Puglia?' },
    { emoji: '🥣', text: 'Breakfast and brunch', query: 'Where can I have breakfast or brunch in Puglia?' },
    { emoji: '🥪', text: 'Vegan sandwiches', query: 'Where can I find vegan sandwiches in Puglia?' },
    { emoji: '🍛', text: 'Indian cuisine', query: 'Are there vegan Indian restaurants in Puglia?' },
    { emoji: '🥟', text: 'Vegan ravioli', query: 'Where can I eat vegan ravioli in Puglia?' },
    { emoji: '🥙', text: 'Vegan panzerotti', query: 'Where can I find vegan panzerotti in Puglia?' },
    { emoji: '🌱', text: 'Venues in Ostuni', query: 'What vegan venues are there in Ostuni?' },
    { emoji: '🍴', text: 'Romantic dinner', query: 'Where can I have a romantic vegan dinner in Puglia?' },
    { emoji: '🍲', text: 'Traditional cuisine', query: 'What venues offer traditional Apulian vegan cuisine?' },
    { emoji: '🧃', text: 'Bars and cafes', query: 'What are the best vegan bars and cafes?' },
    { emoji: '🥖', text: 'Vegan focaccia', query: 'Where can I find vegan focaccia in Puglia?' },
    { emoji: '🍹', text: 'Cocktail bars', query: 'Where can I find vegan cocktail bars in Puglia?' },
    { emoji: '🌮', text: 'Mexican cuisine', query: 'Are there vegan Mexican restaurants in Puglia?' },
    { emoji: '🍜', text: 'Ramen and noodles', query: 'Where can I find vegan ramen in Puglia?' },
    { emoji: '🥘', text: 'Venues in Monopoli', query: 'What vegan venues are there in Monopoli?' },
    { emoji: '🍕', text: 'Vegan pizzerias', query: 'What are the best vegan pizzerias in Puglia?' },
    { emoji: '🥗', text: 'Salads and bowls', query: 'Where can I find vegan salads and bowls in Puglia?' },
  ];

  const suggestions = useMemo(() => {
    const allSuggestions = language === 'it' ? allSuggestionsIt : allSuggestionsEn;
    const shuffled = [...allSuggestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-start min-h-full px-4 py-6 sm:py-12">
      <div className="text-center mb-4 sm:mb-8 max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#465E32] dark:text-[#b5c589] mb-2 sm:mb-3 tracking-tight">
          {t('welcomeTitle', language)}
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed px-2">
          {t('welcomeSubtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full max-w-3xl mb-4 sm:mb-8 auto-rows-fr">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="flex items-center gap-2.5 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#b5c589] dark:hover:border-[#b5c589] hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150 text-left group shadow-sm"
            style={{ animation: `chipIn 120ms cubic-bezier(0.22,1,0.36,1) ${index * 25}ms backwards` }}
          >
            <span className="text-base sm:text-lg flex-shrink-0 leading-none">
              {suggestion.emoji}
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#465E32] dark:group-hover:text-[#b5c589] transition-colors leading-snug">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;
