import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1 pt-24 md:pt-32 lg:pt-40 pb-16 md:pb-24 lg:pb-32 bg-slate-100">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;