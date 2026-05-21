import "./theme.css";
import { Hero } from "@/components/home/Hero";
import { Authority } from "@/components/home/Authority";
import { Philosophy } from "@/components/home/Philosophy";
import { Services } from "@/components/home/Services";
import { Founders } from "@/components/home/Founders";
import { Contact } from "@/components/home/Contact";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        <Authority />
        <Philosophy />
        <Services />
        <Founders />
        <Contact />
      </main>
    </div>
  );
}
