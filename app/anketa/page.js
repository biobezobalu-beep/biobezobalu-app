import ProductTable from "@/components/ProductTable";
import IdeaPanels from "@/components/IdeaPanels";
import { products } from "@/data/products";

export default function PollPage(){
 return (
  <div className="page">
   <header className="topbar"><input placeholder="Hledat čokoládu..."/><span>🔔　☰</span></header>
   <div className="version-badge">NOVÁ VERZE APLIKACE</div>
   <h1>Rozhodněte, co vyrobíme</h1>
   <p className="lead">Vyberte čokoládu, kterou chcete podpořit. Vyrobíme ji, až společně dosáhneme cílového množství.</p>
   <div className="steps">
    <article><b>▣</b><div><strong>Zaplaťte rezervační poplatek</strong><span>Rezervace je 10 % z ceny.</span></div></article>
    <article><b>◇</b><div><strong>My to vyrobíme</strong><span>Po dosažení cíle spustíme výrobu.</span></div></article>
    <article><b>◇</b><div><strong>Získáte slevu</strong><span>Po výrobě dostanete kód na doplatek v e-shopu.</span></div></article>
    <article><b>◎</b><div><strong>Pro vás, od vás</strong><span>Pomáháte rozhodnout, jaké čokolády vzniknou.</span></div></article>
   </div>
   <div className="notice"><b>ⓘ</b><span>Pokud se potřebné množství nevybere do 30 dní, <strong>čokoládu buď vyrobíme i tak, nebo vám pošleme peníze zpět.</strong></span></div>
   <ProductTable products={products}/>
   <IdeaPanels/>
   <section className="vegan-poll">
    <div><h2>Naše výroba je nut free a vegan.</h2><p>Nepoužíváme ořechy ani mléčné výrobky.</p><span>◉ Nut free　ⓥ Vegan</span></div>
    <div><h2>Je pro vás důležité, že u nás nepoužíváme ořechy ani mléčné výrobky?</h2>
     <div className="poll-buttons"><button>Ano, jinak bych nenakoupil</button><button>Ne, je mi to jedno</button><button>Ne, chtěl bych nějaké originální mléčné nebo oříškové čokolády</button></div>
    </div>
   </section>
  </div>
 )
}
