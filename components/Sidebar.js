import Link from "next/link";

const nav = [
  ["⌂","Přehled","/"],
  ["◉","Anketa","/anketa"],
  ["◎","Komunita","/komunita"],
  ["▧","Galerie","/galerie"],
  ["◌","Chat s námi","/chat"],
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link href="/" className="logo">
        <span className="logo-mark">◇</span>
        <span><strong>BIOBEZOBALU</strong><small>ROZHODNETE, CO VYROBÍME</small></span>
      </Link>
      <nav>
        {nav.map(([icon,label,href]) => (
          <Link key={href} href={href} className={href === "/anketa" ? "active" : ""}>
            <span>{icon}</span>{label}
          </Link>
        ))}
        <a href="https://biobezobalu.cz" target="_blank" rel="noreferrer"><span>🛒</span>Eshop ↗</a>
      </nav>
      <div className="account-card">
        <strong>Můj účet</strong>
        <span>Tomáš</span>
        <hr/>
        <small>Dostupný kredit</small>
        <b>360 Kč</b>
        <Link href="/anketa">Moje rezervace</Link>
      </div>
      <div className="help-card">
        <strong>Potřebujete pomoc?</strong>
        <span>Napište nám, rádi poradíme.</span>
        <Link href="/chat">Napsat zprávu</Link>
      </div>
    </aside>
  );
}
