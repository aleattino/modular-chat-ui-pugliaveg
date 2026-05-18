import React from 'react';
import type { Message as MessageType, UserAvatar as UserAvatarType } from '../types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import MapPreviewCard from './MapPreviewCard';
import MapCardSkeleton from './MapCardSkeleton';
import ComparisonTable from './ComparisonTable';
import UserAvatar from './UserAvatar';
import { useSettings } from '../hooks/useSettings';

interface MessageProps {
  message: MessageType;
  isLast: boolean;
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1.5 px-1 py-2">
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="block h-[5px] w-[5px] rounded-full bg-gray-400 dark:bg-gray-500"
        style={{ animation: `dotPulse 1.2s ease-in-out ${i * 0.15}s infinite` }}
      />
    ))}
  </div>
);

const AssistantAvatar: React.FC = () => (
  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-[#465E32] flex items-center justify-center">
    <span className="text-white text-xs sm:text-sm font-semibold select-none">AI</span>
  </div>
);

const UserAvatarBubble: React.FC<{ avatar: UserAvatarType }> = ({ avatar }) => (
  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
    <UserAvatar avatar={avatar} className="w-full h-full object-cover" />
  </div>
);

const Message: React.FC<MessageProps> = ({ message, isLast, isLoading }) => {
  const { settings } = useSettings();
  const isUser = message.role === 'user';
  const showTypingIndicator = !isUser && isLast && isLoading && message.content === '';

  const bubble = isUser
    ? 'bg-[#b5c589] text-black'
    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-gray-600';

  const renderContent = () => {
    let content = message.content;

    content = content.replace(/\n(?!\n)/g, '\n\n');
    content = content.replace(/\.\s+(Oggi|Ecco|Purtroppo|Inoltre|Per|A [A-Z][a-zà-ù]+:|Nel|Nella|Se|Ho|Ti|Vuoi|Puoi|Sai|Mo'|Spostandoci|Spostandoti)/g, '.\n\n$1');
    content = content.replace(/\.\s+(Today|Here|Unfortunately|Also|For|In|If|I|You|Want|Can|Know|Moving)/g, '.\n\n$1');

    const components: { index: number; component: React.ReactElement }[] = [];
    let componentIndex = 0;

    const extractBalancedJSON = (text: string, startIndex: number): string | null => {
      let braceCount = 0;
      let inString = false;
      let escape = false;
      let jsonStart = -1;

      for (let i = startIndex; i < text.length; i++) {
        const char = text[i];
        if (escape) { escape = false; continue; }
        if (char === '\\') { escape = true; continue; }
        if (char === '"') { inString = !inString; continue; }
        if (inString) continue;
        if (char === '{') { if (braceCount === 0) jsonStart = i; braceCount++; }
        else if (char === '}') { braceCount--; if (braceCount === 0) return text.substring(jsonStart, i + 1); }
      }
      return null;
    };

    let searchIndex = 0;
    while (true) {
      const compIndex = content.indexOf('[COMPARISON]', searchIndex);
      if (compIndex === -1) break;

      const jsonStr = extractBalancedJSON(content, compIndex + '[COMPARISON]'.length);
      if (jsonStr) {
        try {
          const data = JSON.parse(jsonStr);
          if (data.venues && Array.isArray(data.venues) && data.venues.length > 0) {
            const placeholder = `__COMPONENT_${componentIndex}__`;
            components.push({
              index: componentIndex,
              component: <ComparisonTable key={`comparison-${componentIndex}`} venues={data.venues} />
            });
            content = content.substring(0, compIndex) + placeholder + content.substring(compIndex + '[COMPARISON]'.length + jsonStr.length);
            searchIndex = compIndex + placeholder.length;
            componentIndex++;
            continue;
          }
        } catch (e) {
          console.error('Errore parsing comparazione:', e);
        }
      }
      searchIndex = compIndex + 1;
    }

    const mapsRegex = /\[MAPS_PREVIEW\]\{[^}]*?\}/g;
    content = content.replace(mapsRegex, (match) => {
      try {
        const jsonString = match.replace('[MAPS_PREVIEW]', '');
        const data = JSON.parse(jsonString);
        if (data.name && data.address) {
          const placeholder = `__COMPONENT_${componentIndex}__`;
          components.push({
            index: componentIndex,
            component: <MapPreviewCard
              key={`map-${componentIndex}`}
              name={data.name}
              address={data.address}
              type={data.type}
              vvf={data.vvf}
              verified={data.verified}
              partner={data.partner}
              description={data.description}
              tags={data.tags}
              website={data.website}
              autoCorrectVVF={true}
            />
          });
          componentIndex++;
          return placeholder;
        }
      } catch (e) {
        console.error('Errore parsing mappa:', e);
      }
      return match;
    });

    const parts = content.split(/(__COMPONENT_\d+__)/);

    return parts.map((part, index) => {
      const componentMatch = part.match(/__COMPONENT_(\d+)__/);
      if (componentMatch) {
        const idx = parseInt(componentMatch[1]);
        const comp = components.find(c => c.index === idx);
        return comp ? comp.component : null;
      }

      const cleanPart = part.trim();
      if (cleanPart && cleanPart !== '`') {
        const raw = marked(cleanPart, { breaks: true, gfm: true }) as string;
        return <div key={index} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(raw) }} />;
      }
      return null;
    });
  };

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-msgIn`}
    >
      {!isUser && <AssistantAvatar />}
      <div className={`max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-2xl px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl break-words ${bubble}`}>
        {showTypingIndicator ? <TypingIndicator /> : (
          <div className="prose prose-sm max-w-none text-inherit dark:text-inherit prose-p:my-4 sm:prose-p:my-5 prose-ul:my-4 sm:prose-ul:my-5 prose-li:my-1 sm:prose-li:my-1.5 prose-strong:text-inherit dark:prose-strong:text-inherit prose-em:text-inherit dark:prose-em:text-inherit text-[15px] sm:text-base leading-relaxed">
            {isUser ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content.replace(/\n/g, '<br />')) }} />
            ) : (
              <>
                {renderContent()}
                {message.pendingCard && <MapCardSkeleton />}
              </>
            )}
          </div>
        )}
      </div>
      {isUser && <UserAvatarBubble avatar={settings.userAvatar} />}
    </div>
  );
};

export default Message;
