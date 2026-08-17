import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080A09] border-t border-white/[0.08] mt-auto">
      <div className="container-editorial py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/browse" className="inline-block mb-4">
              <Image
                src="/logo.webp"
                alt="FoleyPlay"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#9CA39D] leading-relaxed max-w-sm">
              Plataforma editorial de entretenimiento y descubrimiento para explorar las mejores películas, series y canales en vivo.
            </p>
          </div>

          {/* Col 2: Contenido */}
          <div>
            <h3 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider mb-4">
              Explorar
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9CA39D]">
              <li>
                <Link href="/browse" className="hover:text-fp-lime transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-fp-lime transition-colors">
                  Películas
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-fp-lime transition-colors">
                  Series
                </Link>
              </li>
              <li>
                <Link href="/tv-en-vivo" className="hover:text-fp-lime transition-colors">
                  TV en Vivo
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-fp-lime transition-colors">
                  Búsqueda avanzada
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Biblioteca Personal */}
          <div>
            <h3 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider mb-4">
              Tu Espacio
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9CA39D]">
              <li>
                <Link href="/watchlist" className="hover:text-fp-lime transition-colors">
                  Mi Lista
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-fp-lime transition-colors">
                  Continuar Viendo
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Atribución */}
          <div>
            <h3 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider mb-4">
              Legal y Datos
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9CA39D]">
              <li>
                <Link href="/legal/terms" className="hover:text-fp-lime transition-colors">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-fp-lime transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Metadatos provistos por The Movie Database"
                >
                  <Image
                    src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                    alt="Powered by TMDB"
                    width={90}
                    height={14}
                    style={{ height: 'auto' }}
                    unoptimized
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#636B64]">
          <p className="text-center md:text-left max-w-2xl leading-relaxed">
            FoleyPlay es un proyecto educativo y de investigación técnica sin fines comerciales. No almacena ni transmite contenido protegido en servidores propios; los metadatos provienen de TMDB.
          </p>
          <p className="shrink-0">
            © {year} FoleyPlay. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
