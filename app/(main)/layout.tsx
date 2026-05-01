import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ModalProvider } from '@/lib/modal-context';
import PlayerModal from '@/components/player/PlayerModal';
import DetailModal from '@/components/detail/DetailModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col bg-fp-black">
        <Navbar />
        <main className="flex-1 pb-20">
          {children}
        </main>
        <Footer />
      </div>
      <PlayerModal />
      <DetailModal />
    </ModalProvider>
  );
}
