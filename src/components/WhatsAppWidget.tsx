import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const phoneNumber = '+33666377526';
  const message = 'Bonjour, je suis intéressé par vos services';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-24 right-8 z-40 flex flex-col items-center gap-3">
      <span className="hidden md:block text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-md text-center max-w-xs">
        Contactez-nous sur WhatsApp
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactez-nous sur WhatsApp"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
