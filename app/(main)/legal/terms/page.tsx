export const metadata = { title: 'Términos de Uso — FoleyPlay' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Términos de Uso</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: abril de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Naturaleza del proyecto</h2>
            <p>
              FoleyPlay es un proyecto de demostración técnica y educativa desarrollado exclusivamente con fines académicos y de aprendizaje en desarrollo de software. No tiene fines comerciales, no genera ingresos de ningún tipo, no está afiliado a ninguna plataforma de streaming comercial, ni pretende sustituir o competir con ningún servicio de entretenimiento licenciado.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Contenido de terceros</h2>
            <p>
              FoleyPlay no aloja, almacena, distribuye ni transmite ningún contenido audiovisual. Los metadatos del catálogo (títulos, descripciones, imágenes) son provistos por <strong className="text-gray-200">The Movie Database (TMDB)</strong> bajo su API pública. Los reproductores de video embebidos son iframes que apuntan a fuentes públicas de terceros sobre las cuales FoleyPlay no tiene control, responsabilidad editorial ni relación contractual.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Exención de responsabilidad</h2>
            <p>
              El desarrollador de FoleyPlay no asume ninguna responsabilidad por el contenido, la disponibilidad, la legalidad ni la calidad de los recursos embebidos provenientes de sitios de terceros. El uso de dichos recursos es responsabilidad exclusiva del usuario final. FoleyPlay no garantiza que el contenido embebido esté libre de derechos de autor ni que su visualización sea legal en la jurisdicción del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Propiedad intelectual</h2>
            <p>
              Todos los títulos, marcas, imágenes y descripciones del catálogo son propiedad de sus respectivos titulares de derechos. Su aparición en esta plataforma es únicamente a través de la API pública de TMDB y no implica ningún tipo de licencia, cesión de derechos ni asociación con los titulares.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. Limitación de responsabilidad</h2>
            <p>
              En la máxima medida permitida por la ley aplicable, el desarrollador de FoleyPlay no será responsable por ningún daño directo, indirecto, incidental, especial o consecuente derivado del uso o la imposibilidad de uso de esta plataforma, incluyendo pero no limitado a pérdida de datos, interrupción del servicio o acceso a contenido de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. Uso permitido</h2>
            <p>
              El acceso a esta plataforma está destinado únicamente a revisión técnica, demostraciones académicas y evaluación de habilidades de desarrollo. Queda prohibido cualquier uso comercial, redistribución o explotación del proyecto sin autorización expresa del desarrollador.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">7. Modificaciones</h2>
            <p>
              El desarrollador se reserva el derecho de modificar o discontinuar FoleyPlay en cualquier momento y sin previo aviso. Estas condiciones pueden actualizarse sin notificación previa.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">8. Ley aplicable</h2>
            <p>
              Estos términos se rigen por la legislación del país de residencia del desarrollador. Cualquier disputa será sometida a la jurisdicción de los tribunales competentes de dicha localidad.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
