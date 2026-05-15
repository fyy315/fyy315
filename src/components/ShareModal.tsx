import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Share2, Download, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url?: string;
}

export default function ShareModal({ isOpen, onClose, title, description, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { name: '微信', color: '#07C160', icon: 'WeChat' },
    { name: '微博', color: '#E6162D', icon: 'Weibo' },
    { name: 'QQ', color: '#12B7F5', icon: 'QQ' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1A1A3E] rounded-2xl border border-white/20 p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#00D2FF]" />
                分享
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#6C5CE7]/30 to-[#00D2FF]/30 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-white font-medium mb-1">{title}</p>
              {description && <p className="text-white/60 text-sm">{description}</p>}
            </div>

            <div className="flex gap-3 mb-6">
              {shareOptions.map((opt) => (
                <button
                  key={opt.name}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium"
                  style={{ borderLeft: `3px solid ${opt.color}` }}
                >
                  {opt.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white/80 text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-3 bg-[#6C5CE7] hover:bg-[#5a4dd0] rounded-xl text-white transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
              </button>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#00D2FF] rounded-xl text-white font-medium flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              生成分享海报
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
