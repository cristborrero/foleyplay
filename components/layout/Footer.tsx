import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/5 mt-auto">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 flex flex-col items-center gap-8">

        {/* Logo */}
        <Image
          src="/logo-foleyplay.png"
          alt="FoleyPlay"
          width={160}
          height={50}
          className="object-contain opacity-80 hover:opacity-100 transition-opacity"
        />

        {/* Legal links */}
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <Link href="/legal/terms" className="hover:text-gray-300 transition-colors">
            Términos de Uso
          </Link>
          <span className="text-gray-700">·</span>
          <Link href="/legal/privacy" className="hover:text-gray-300 transition-colors">
            Política de Privacidad
          </Link>
          <span className="text-gray-700">·</span>
          <a href="mailto:contacto@foleyplay.com" className="hover:text-gray-300 transition-colors">
            Contacto
          </a>
        </div>

        {/* Disclaimer */}
        <div className="text-center space-y-2 max-w-2xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            FoleyPlay es un proyecto educativo sin fines comerciales, desarrollado con propósitos académicos y de demostración técnica. No aloja ni distribuye contenido audiovisual. Los metadatos son provistos por{' '}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2">
              TMDB
            </a>
            . Los reproductores embebidos son fuentes públicas de terceros ajenas a este proyecto.
          </p>
          <p className="text-[11px] text-gray-700">
            © {year} FoleyPlay. Todos los derechos de los contenidos pertenecen a sus respectivos titulares.
          </p>
        </div>

        {/* TMDB attribution — required by their ToS */}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-40 hover:opacity-70 transition-opacity"
        >
          <Image
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="Powered by TMDB"
            width={100}
            height={14}
            unoptimized
          />
        </a>

      </div>
    </footer>
  );
}
