export const metadata = { title: 'Política de Privacidad — FoleyPlay' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300">
      <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-gray-500 text-sm mb-10">Última actualización: abril de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-white font-semibold text-base mb-2">1. Información que recopilamos</h2>
            <p>
              FoleyPlay recopila únicamente la información mínima necesaria para el funcionamiento de sus funcionalidades:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li><strong className="text-gray-300">Datos de cuenta:</strong> nombre de usuario y correo electrónico, usados exclusivamente para autenticación.</li>
              <li><strong className="text-gray-300">Historial de reproducción:</strong> títulos vistos y progreso, almacenados localmente en la cuenta del usuario.</li>
              <li><strong className="text-gray-300">Lista de seguimiento:</strong> títulos guardados por el usuario.</li>
            </ul>
            <p className="mt-2">No recopilamos datos de pago, datos biométricos, ni información de contacto adicional.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">2. Uso de la información</h2>
            <p>
              Los datos recopilados se utilizan exclusivamente para:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li>Autenticar al usuario y mantener su sesión activa.</li>
              <li>Mostrar el historial personal y lista de seguimiento dentro de la plataforma.</li>
              <li>Mejorar la experiencia de usuario dentro del contexto del proyecto educativo.</li>
            </ul>
            <p className="mt-2">No vendemos, cedemos ni comercializamos información personal a terceros bajo ninguna circunstancia.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">3. Almacenamiento de datos</h2>
            <p>
              Los datos de usuario se almacenan en una base de datos MongoDB con acceso restringido. Las contraseñas se almacenan exclusivamente en formato hash (bcrypt). No almacenamos contraseñas en texto plano.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">4. Servicios de terceros</h2>
            <p>
              FoleyPlay utiliza los siguientes servicios externos, cada uno con sus propias políticas de privacidad:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
              <li><strong className="text-gray-300">TMDB (The Movie Database):</strong> proveedor de metadatos del catálogo.</li>
              <li><strong className="text-gray-300">YouTube (Google):</strong> reproductores de trailers embebidos.</li>
              <li><strong className="text-gray-300">Proveedores de stream embebidos:</strong> fuentes de terceros para reproducción de contenido; sus políticas de datos son independientes y ajenas a FoleyPlay.</li>
            </ul>
            <p className="mt-2">FoleyPlay no controla ni es responsable de las prácticas de privacidad de estos servicios.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">5. Cookies y almacenamiento local</h2>
            <p>
              FoleyPlay utiliza cookies de sesión exclusivamente para mantener la autenticación del usuario. No utilizamos cookies de seguimiento, publicidad ni analítica de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">6. Derechos del usuario</h2>
            <p>
              El usuario puede solicitar en cualquier momento la eliminación completa de su cuenta y todos los datos asociados contactando al desarrollador. Al ser un proyecto educativo sin base de usuarios comercial, atenderemos todas las solicitudes a la brevedad posible.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">7. Menores de edad</h2>
            <p>
              FoleyPlay no está dirigido a menores de 13 años. No recopilamos conscientemente información de menores. Si tomamos conocimiento de que un menor ha proporcionado datos personales, procederemos a eliminarlos de inmediato.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-base mb-2">8. Cambios a esta política</h2>
            <p>
              Esta política puede actualizarse ocasionalmente. Los cambios sustanciales serán notificados mediante la actualización de la fecha al inicio de este documento.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
