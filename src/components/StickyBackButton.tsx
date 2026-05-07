import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StickyBackButtonProps {
  href: string;
  label: string;
}

export default function StickyBackButton({ href, label }: StickyBackButtonProps) {
  return (
    <div className="sticky top-0 z-[99] bg-charcoal-800/95 backdrop-blur-md border-b border-charcoal-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <Link
          to={href}
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/30 rounded-full text-sm text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {label}
        </Link>
      </div>
    </div>
  );
}
