import Link from "next/link";
export default function Home(){
 return <div className="page simple-page"><div className="hero-box"><span>Komunitní aplikace BioBezObalu</span><h1>Rozhodujte s námi, co vyrobíme.</h1><p>Hlasujte, rezervujte limitované edice, sdílejte fotografie a napište nám přímo v aplikaci.</p><Link href="/anketa">Otevřít anketu</Link></div></div>
}
