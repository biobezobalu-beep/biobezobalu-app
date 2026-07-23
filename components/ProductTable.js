import Link from "next/link";

function pct(p){ return Math.min(100, Math.round((p.reserved/p.goal)*100)); }

export default function ProductTable({ products }) {
  return (
    <div className="table-card">
      <div className="table-head">
        <span>#</span><span>Čokoláda</span><span>Stav rezervací</span><span>Zbývá do konce kampaně</span><span>Rezervace 10 %</span><span>Akce</span>
      </div>
      {products.map((p,i) => (
        <div className="product-row" key={p.slug}>
          <span className="rank">{i+1}</span>
          <div>
            <strong>{p.name}</strong>
            <small>{p.desc}</small>
          </div>
          <div className="status">
            <span>{p.reserved.toLocaleString("cs-CZ")} kg / {p.goal} kg</span>
            <div className="meter"><i style={{width:`${pct(p)}%`}}/></div>
            <b>{pct(p)} %</b>
          </div>
          <div className="deadline"><span>▣</span><div><strong>Zbývá {p.days} dní</strong><small>30denní kampaň</small></div></div>
          <div className="prices">
            <span><b>250 g</b>{p.price250} Kč</span>
            <span><b>1 kg</b>{p.price250*4} Kč</span>
            <span><b>3×1 kg</b>{p.price250*12} Kč</span>
          </div>
          <Link className="outline" href={`/anketa/${p.slug}`}>Zobrazit detail</Link>
        </div>
      ))}
    </div>
  );
}
