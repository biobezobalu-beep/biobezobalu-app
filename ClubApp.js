import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export function generateStaticParams(){ return products.map(p=>({slug:p.slug})); }

export default function Detail({params}){
 const p=products.find(x=>x.slug===params.slug); if(!p) notFound();
 const pct=Math.round((p.reserved/p.goal)*100);
 return <div className="page detail-page">
  <Link href="/anketa" className="back">← Zpět na anketu</Link>
  <div className="detail-card">
   <div>
    <span className="tag">{p.reserved} kg z {p.goal} kg rezervováno</span>
    <h1>{p.name}</h1>
    <p className="lead">{p.desc}</p>
    <div className="big-meter"><i style={{width:`${pct}%`}}/><b>{pct} %</b></div>
    <dl><div><dt>Cíl kampaně</dt><dd>{p.goal} kg</dd></div><div><dt>Zbývá</dt><dd>{p.days} dní</dd></div><div><dt>Rezervační poplatek</dt><dd>10 % z ceny</dd></div></dl>
    <h2>Složení</h2><p>{p.ingredients}</p>
    <h2>Popis chuti</h2><p>{p.taste}</p>
   </div>
   <aside className="reserve-box">
    <h2>Vyberte množství</h2>
    <button>250 g <b>{p.price250} Kč</b></button>
    <button>1 kg <b>{p.price250*4} Kč</b></button>
    <button>3×1 kg <b>{p.price250*12} Kč</b></button>
    <hr/>
    <p>Rezervační platba představuje 10 % předpokládané ceny. Doplatek proběhne později v e-shopu BioBezObalu.</p>
    <button className="primary">Pokračovat k rezervaci</button>
   </aside>
  </div>
 </div>
}
