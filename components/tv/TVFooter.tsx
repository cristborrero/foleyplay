import Image from 'next/image';
import Link from 'next/link';

export default function TVFooter() {
  return (
    <footer className="flex items-center justify-between px-8 py-2 border-t border-[#111] shrink-0">
      <Image src="/logo.webp" alt="FoleyPlay" width={70} height={20} className="h-4 w-auto object-contain opacity-20" />
      <div className="flex gap-4">
        <Link href="/legal/terms" className="text-[9px] text-gray-800 hover:text-gray-600 transition-colors">Términos</Link>
        <Link href="/legal/privacy" className="text-[9px] text-gray-800 hover:text-gray-600 transition-colors">Privacidad</Link>
      </div>
    </footer>
  );
}
