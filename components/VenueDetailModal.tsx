import React from 'react';
import { X, MapPin, Globe, Leaf, Sprout, ShieldCheck, Handshake, ExternalLink, Bike, ShoppingBag } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { t } from '../i18n';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface VenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  address: string;
  type?: string;
  vvf?: 'v' | 'vf';
  verified?: string;
  partner?: string;
  description?: string;
  tags?: string;
  website?: string;
}

const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  isOpen,
  onClose,
  name,
  address,
  type,
  vvf,
  verified,
  partner,
  description,
  tags,
  website
}) => {
  const { settings } = useSettings();
  const trapRef = useFocusTrap(isOpen, onClose);

  if (!isOpen) return null;

  const query = encodeURIComponent(`${name}, ${address}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${query}&zoom=15`;
  
  const lang = settings.language;
  const vvfLabel = vvf === 'v' ? t('veganFull', lang) : t('veganFriendly', lang);
  
  const isVerified = verified === 'sì';
  const isPartner = partner === 'sì';
  
  const tagList = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
  
  const hasDelivery = tagList.some(tag => 
    tag.toLowerCase().includes('delivery') || 
    tag.toLowerCase().includes('consegna') ||
    tag.toLowerCase().includes('domicilio')
  );
  
  const hasTakeaway = tagList.some(tag => 
    tag.toLowerCase().includes('take') || 
    tag.toLowerCase().includes('asporto') ||
    tag.toLowerCase().includes('takeaway')
  );
  
  const otherTags = tagList.filter(tag => {
    const lower = tag.toLowerCase();
    return !lower.includes('delivery') && 
           !lower.includes('consegna') && 
           !lower.includes('domicilio') &&
           !lower.includes('take') && 
           !lower.includes('asporto') &&
           !lower.includes('takeaway');
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={name}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-dialogIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0" strokeWidth={2} />
              <span>{address}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {vvf && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${
                  vvf === 'v' 
                    ? 'bg-[#2d4521] text-white' 
                    : 'bg-[#a5b579] text-white'
                }`}>
                  {vvf === 'v' ? (
                    <Leaf className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Sprout className="h-3.5 w-3.5" strokeWidth={2.5} />
                  )}
                  {vvfLabel}
                </span>
              )}
              
              {type && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                  {type}
                </span>
              )}
              
              {isVerified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#5C6F3C]/20 dark:bg-[#5C6F3C]/30 text-[#5C6F3C] dark:text-[#8a9a68]">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {t('verified', lang)}
                </span>
              )}
              
              {isPartner && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#CE9A18]/20 dark:bg-[#CE9A18]/30 text-[#CE9A18] dark:text-[#e5b347]">
                  <Handshake className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {t('partner', lang)}
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={t('close', lang)}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {(hasDelivery || hasTakeaway) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                {t('availableServices', lang)}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {hasDelivery && (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gradient-to-br from-[#b5c589]/10 to-[#b5c589]/5 border border-[#b5c589]/20">
                    <div className="p-2 rounded-lg bg-[#465E32]/10">
                      <Bike className="h-4 w-4 text-[#465E32] dark:text-[#b5c589]" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('delivery', lang)}
                    </span>
                  </div>
                )}
                {hasTakeaway && (
                  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-gradient-to-br from-[#b5c589]/10 to-[#b5c589]/5 border border-[#b5c589]/20">
                    <div className="p-2 rounded-lg bg-[#465E32]/10">
                      <ShoppingBag className="h-4 w-4 text-[#465E32] dark:text-[#b5c589]" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('takeaway', lang)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                {t('descriptionLabel', lang)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
            </div>
          )}

          {otherTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                {t('otherFeatures', lang)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherTags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#b5c589]/20 text-[#465E32] dark:bg-[#465E32]/30 dark:text-[#b5c589]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
              {t('locationLabel', lang)}
            </h3>
            <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative group">
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${t('mapOf', lang)} ${name}`}
              />
              <div className="absolute inset-0 bg-transparent cursor-pointer" onClick={() => window.open(mapsUrl, '_blank')} />
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {t('clickToOpenMaps', lang)}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#465E32] hover:bg-[#3a4f28] text-white text-sm font-medium rounded-xl transition-colors duration-150"
            >
              <Globe className="h-4 w-4" strokeWidth={2} />
              {t('visitWebsite', lang)}
            </a>
          )}
          
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl transition-colors duration-150 border border-gray-200 dark:border-gray-600"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2} />
            {t('openInMaps', lang)}
          </a>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailModal;

