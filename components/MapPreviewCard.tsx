import React, { useState, useEffect } from 'react';
import { MapPin, Globe, Leaf, Sprout, ShieldCheck, Handshake } from 'lucide-react';
import { t } from '../i18n';
import { useSettings } from '../hooks/useSettings';
import VenueDetailModal from './VenueDetailModal';

interface MapPreviewCardProps {
  name: string;
  address: string;
  type?: string;
  vvf?: 'v' | 'vf';
  verified?: string;
  partner?: string;
  description?: string;
  tags?: string;
  website?: string;
  autoCorrectVVF?: boolean;
}

const MapPreviewCard: React.FC<MapPreviewCardProps> = ({ name, address, type, vvf, verified, partner, description, tags, website, autoCorrectVVF = false }) => {
  const { settings } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullDescription, setFullDescription] = useState(description || '');
  const [fullTags, setFullTags] = useState(tags || '');
  const [correctedVVF, setCorrectedVVF] = useState<'v' | 'vf' | undefined>(vvf);
  
  useEffect(() => {
    if (autoCorrectVVF && name) {
      const correctVVF = async () => {
        try {
          const response = await fetch(`/api/venue-details?name=${encodeURIComponent(name)}`);
          if (!response.ok) return;
          const data = await response.json();
          const correctValue = data.vvf === 'v' ? 'v' : 'vf';
          if (correctValue !== vvf) setCorrectedVVF(correctValue);
        } catch (error) {
          console.error('Errore correzione vvf:', error);
        }
      };
      
      correctVVF();
    }
  }, [name, vvf, autoCorrectVVF]);
  
  const query = encodeURIComponent(`${name}, ${address}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${query}&zoom=15`;
  
  const lang = settings.language;
  const finalVVF = correctedVVF || vvf;
  const vvfLabel = finalVVF === 'v' ? t('veganFull', lang) : t('veganFriendly', lang);
  
  const isVerified = verified === 'sì';
  const isPartner = partner === 'sì';
  
  const fetchVenueDetails = async () => {
    if (fullDescription && fullTags) return;

    try {
      const response = await fetch(`/api/venue-details?name=${encodeURIComponent(name)}`);
      if (!response.ok) return;
      const data = await response.json();
      const descriptionField = settings.language === 'it' ? data.description : data.description_en;
      setFullDescription(descriptionField || '');
      setFullTags(data.tags || '');
      if (data.vvf === 'v' || data.vvf === 'vf') setCorrectedVVF(data.vvf);
    } catch (error) {
      console.error('Errore caricamento dettagli locale:', error);
    }
  };
  
  const handleCardClick = () => {
    fetchVenueDetails();
    setIsModalOpen(true);
  };

  return (
    <>
      <VenueDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name}
        address={address}
        type={type}
        vvf={finalVVF}
        verified={verified}
        partner={partner}
        description={fullDescription}
        tags={fullTags}
        website={website}
      />
      
      <div className="not-prose my-3">
        <div 
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm transition-colors duration-150 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
          onClick={handleCardClick}
        >
          
          <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-3 lg:p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base lg:text-lg text-gray-900 dark:text-gray-100 mb-1 truncate">{name}</h3>
                <div className="flex items-center gap-1.5 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-3.5 w-3.5 lg:h-4 lg:w-4 flex-shrink-0" strokeWidth={2} />
                  <span className="truncate">{address}</span>
                </div>
              </div>
              
              {finalVVF && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                  finalVVF === 'v' 
                    ? 'bg-[#2d4521] dark:bg-[#2d4521] text-white' 
                    : 'bg-[#a5b579] dark:bg-[#8a9a68] text-white'
                }`}>
                  {finalVVF === 'v' ? (
                    <Leaf className="h-3 w-3" strokeWidth={2.5} />
                  ) : (
                    <Sprout className="h-3 w-3" strokeWidth={2.5} />
                  )}
                  {vvfLabel}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {type && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                  {type}
                </span>
              )}
              
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#5C6F3C]/20 dark:bg-[#5C6F3C]/30 text-[#5C6F3C] dark:text-[#8a9a68]">
                  <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                  {t('verified', lang)}
                </span>
              )}
              
              {isPartner && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#CE9A18]/20 dark:bg-[#CE9A18]/30 text-[#CE9A18] dark:text-[#e5b347]">
                  <Handshake className="h-3 w-3" strokeWidth={2.5} />
                  {t('partner', lang)}
                </span>
              )}
            </div>
            
            {website && (
              <div>
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 lg:px-4 lg:py-2.5 bg-[#465E32] hover:bg-[#3a4f28] text-white text-xs lg:text-sm font-medium rounded-lg transition-colors duration-150"
                >
                  <Globe className="h-3.5 w-3.5 lg:h-4 lg:w-4" strokeWidth={2} />
                  {t('visitWebsite', lang)}
                </a>
              </div>
            )}
          </div>

          <div className="lg:w-[280px] h-[120px] lg:h-[160px] relative group flex-shrink-0">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0 pointer-events-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${t('mapOf', lang)} ${name}`}
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {t('clickForDetails', lang)}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MapPreviewCard;
