import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { MapPin, Star, GitCompare } from 'lucide-react';
import { t } from '../i18n';

interface Venue {
  name: string;
  address: string;
  type: string;
  cuisine?: string[];
  priceRange?: string;
  features?: string[];
  hours?: string;
  rating?: number;
}

interface ComparisonTableProps {
  venues: Venue[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ venues }) => {
  const { settings } = useSettings();
  const lang = settings.language;

  const displayVenues = venues.slice(0, 3);

  const l = {
    type: lang === 'it' ? 'Tipo' : 'Type',
    cuisine: lang === 'it' ? 'Cucina' : 'Cuisine',
    price: lang === 'it' ? 'Prezzo' : 'Price',
    features: lang === 'it' ? 'Caratteristiche' : 'Features',
    hours: lang === 'it' ? 'Orari' : 'Hours',
    rating: lang === 'it' ? 'Valutazione' : 'Rating',
    noData: lang === 'it' ? 'N/D' : 'N/A',
  };

  const openMap = (venue: Venue) => {
    const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="not-prose my-4">
      <div className="flex items-center gap-2 mb-3">
        <GitCompare className="h-5 w-5 text-[#6a7f4a] dark:text-[#b5c589]" strokeWidth={2} />
        <h3 className="text-base font-semibold text-[#6a7f4a] dark:text-[#b5c589]">
          {t('venueComparison', lang)}
        </h3>
      </div>

      <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="inline-block min-w-full">
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${displayVenues.length}, 1fr)` }}>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 sticky left-0"></div>
            {displayVenues.map((venue, idx) => (
              <div key={idx} className={`bg-gradient-to-br from-[#b5c589] to-[#a5b579] p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700`}>
                <h4 className="font-bold text-black text-base mb-1 line-clamp-2">{venue.name}</h4>
                <p className="text-xs text-black/70 line-clamp-1 flex items-center gap-1">
                  <MapPin className="h-3 w-3" strokeWidth={2.5} />
                  {venue.address}
                </p>
              </div>
            ))}

            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-center sticky left-0">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.type}</span>
            </div>
            {displayVenues.map((venue, idx) => (
              <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700 flex items-center`}>
                <span className="text-sm text-gray-800 dark:text-gray-200">{venue.type || l.noData}</span>
              </div>
            ))}

            {displayVenues.some(v => v.cuisine && v.cuisine.length > 0) && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-center sticky left-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.cuisine}</span>
                </div>
                {displayVenues.map((venue, idx) => (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700 flex items-center`}>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {venue.cuisine && venue.cuisine.length > 0 ? venue.cuisine.join(', ') : l.noData}
                    </span>
                  </div>
                ))}
              </>
            )}

            {displayVenues.some(v => v.priceRange) && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-center sticky left-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.price}</span>
                </div>
                {displayVenues.map((venue, idx) => (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700 flex items-center`}>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{venue.priceRange || l.noData}</span>
                  </div>
                ))}
              </>
            )}

            {displayVenues.some(v => v.features && v.features.length > 0) && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-start sticky left-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.features}</span>
                </div>
                {displayVenues.map((venue, idx) => (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700`}>
                    {venue.features && venue.features.length > 0 ? (
                      <ul className="text-sm text-gray-800 dark:text-gray-200 space-y-1.5">
                        {venue.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <span className="text-[#6a7f4a] dark:text-[#b5c589] mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{l.noData}</span>
                    )}
                  </div>
                ))}
              </>
            )}

            {displayVenues.some(v => v.hours) && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-center sticky left-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.hours}</span>
                </div>
                {displayVenues.map((venue, idx) => (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700 flex items-center`}>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{venue.hours || l.noData}</span>
                  </div>
                ))}
              </>
            )}

            {displayVenues.some(v => v.rating) && (
              <>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-r border-gray-200 dark:border-gray-700 flex items-center sticky left-0">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{l.rating}</span>
                </div>
                {displayVenues.map((venue, idx) => (
                  <div key={idx} className={`bg-white dark:bg-gray-800 p-4 border-b ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700 flex items-center gap-2`}>
                    {venue.rating ? (
                      <>
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{venue.rating}/5</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{l.noData}</span>
                    )}
                  </div>
                ))}
              </>
            )}

            <div className="bg-gray-50 dark:bg-gray-900 p-4 border-r border-gray-200 dark:border-gray-700 sticky left-0"></div>
            {displayVenues.map((venue, idx) => (
              <div key={idx} className={`bg-white dark:bg-gray-800 p-4 ${idx < displayVenues.length - 1 ? 'border-r' : ''} border-gray-200 dark:border-gray-700`}>
                <button
                  onClick={() => openMap(venue)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#465E32] hover:bg-[#3a4f28] text-white text-sm font-medium rounded-lg transition-colors duration-150"
                >
                  <MapPin className="h-4 w-4" strokeWidth={2} />
                  {t('viewMap', lang)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {displayVenues.map((venue, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-[#b5c589] to-[#a5b579] p-4">
              <h4 className="font-bold text-black text-base mb-1">{venue.name}</h4>
              <p className="text-sm text-black/70">{venue.address}</p>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.type}</span>
                <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{venue.type || l.noData}</p>
              </div>

              {venue.cuisine && venue.cuisine.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.cuisine}</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{venue.cuisine.join(', ')}</p>
                </div>
              )}

              {venue.priceRange && (
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.price}</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{venue.priceRange}</p>
                </div>
              )}

              {venue.features && venue.features.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.features}</span>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 mt-1 space-y-1">
                    {venue.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1">
                        <span className="text-[#b5c589]">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {venue.hours && (
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.hours}</span>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{venue.hours}</p>
                </div>
              )}

              {venue.rating && (
                <div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{l.rating}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{venue.rating}/5</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => openMap(venue)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#465E32] hover:bg-[#3a4f28] text-white text-sm font-medium rounded-lg transition-colors duration-150 mt-4"
              >
                <MapPin className="h-4 w-4" strokeWidth={2} />
                {t('viewMap', lang)}
              </button>
            </div>
          </div>
        ))}

        {displayVenues.length > 1 && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            {displayVenues.length} {t('venuesCompared', lang)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonTable;

