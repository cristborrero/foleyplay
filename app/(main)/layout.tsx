import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TVBackHandler from '@/components/layout/TVBackHandler';
import TVSpatialNav from '@/components/layout/TVSpatialNav';
import PageTransition from '@/components/layout/PageTransition';
import { ModalProvider } from '@/lib/modal-context';
import PlayerModal from '@/components/player/PlayerModal';
import DetailModal from '@/components/detail/DetailModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModalProvider>
      <div className="min-h-screen flex flex-col bg-fp-black">
        <TVBackHandler />
        <TVSpatialNav />
        <Navbar />
        <main className="flex-1 pb-20">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </div>
      <PlayerModal />
      <DetailModal />
    </ModalProvider>
  );
}
