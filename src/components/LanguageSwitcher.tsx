import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: string;
  onChange: (lang: string) => void;
}

const languages = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LanguageSwitcher({ currentLang, onChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{languages.find(l => l.code === currentLang)?.flag}</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-2 w-32 rounded-xl bg-[#1A1A3E] border border-white/10 shadow-xl overflow-hidden z-50"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors ${
                currentLang === lang.code ? 'bg-white/10 text-[#00D2FF]' : 'text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
