'use client';

import { useEffect, useMemo, useState } from 'react';
import products from '@/data/products';

const money = (value) => new Intl.NumberFormat('cs-CZ', {
  style: 'currency',
  currency: 'CZK',
  maximumFractionDigits: 0
}).format(value);

const sizes = [
  { g: 250, label: '250 g', retail: 300 },
  { g: 1000, label: '1 kg', retail: 1000 },
  { g: 3000, label: '3 × 1 kg', retail: 3000 }
];

const initialIdeas = [
  { id: 'pistacie-malina', name: 'Pistácie & malina', composition: '70% čokoláda, pistácie, malina', taste: 'Oříšková, šťavnatá a lehce kyselá.', votes: 158 },
  { id: 'vino-visen', name: 'Červené víno & višeň', composition: '70% čokoláda, červené víno, višeň', taste: 'Tmavá, ovocná a lehce tříslovitá.', votes: 121 },
  { id: 'citron-mak', name: 'Citron & mák', composition: 'Bílá vegan čokoláda, citron, mák', taste: 'Svěží, krémová a jemně oříšková.', votes: 98 },
  { id: 'espresso-kardamom', name: 'Espresso & kardamom', composition: '72% čokoláda, káva, kardamom', taste: 'Pražená, kořeněná a dlouhá.', votes: 88 },
  { id: 'slany-karamel', name: 'Slaný karamel vegan', composition: 'Vegan čokoláda, karamel, mořská sůl', taste: 'Sladko-slaná, jemná a křupavá.', votes: 77 },
  { id: 'whisky-sul', name: 'Whisky & uzená sůl', composition: '75% čokoláda, whisky, uzená sůl', taste: 'Výrazná, kouřová a suchá.', votes: 53 }
];

const voucherCode = (value) => `REZERVACE${value}`;
const presalePrice = (value) => Math.round(value * 0.85);

export default function ClubApp() {
  const [view, setView] = useState('home');
  const [selected, setSelected] = useState(products[0]);
  const [size, setSize] = useState(sizes[1]);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [pendingReserve, setPendingReserve] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [ideas, setIdeas] = useState(initialIdeas);
  const [votedIdeas, setVotedIdeas] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem('bb-user')));
      setReservations(JSON.parse(localStorage.getItem('bb-reservations')) || []);
      setIdeas(JSON.parse(localStorage.getItem('bb-ideas')) || initialIdeas);
      setVotedIdeas(JSON.parse(localStorage.getItem('bb-voted-ideas')) || []);
    } catch {
      // Demo stays usable even when browser storage is unavailable.
    }
  }, []);

  const retail = size.retail;
  const presale = presalePrice(retail);

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }

  function go(nextView) {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function choose(product) {
    setSelected(product);
    setSize(sizes[1]);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startReserve() {
    if (!user) {
      setPendingReserve(true);
      setAuthOpen(true);
      return;
    }
    setReserveOpen(true);
  }

  function login(account) {
    setUser(account);
    localStorage.setItem('bb-user', JSON.stringify(account));
    setAuthOpen(false);
    showToast('Jste přihlášeni.');
    if (pendingReserve) {
      setPendingReserve(false);
      setReserveOpen(true);
    }
  }

  function finishReserve(delivery) {
    const item = {
      id: Date.now(),
      product: selected.name,
      size: size.label,
      paid: presale,
      value: retail,
      code: voucherCode(retail),
      delivery,
      status: 'Rezervace potvrzena',
      cancelled: false
    };
    const next = [item, ...reservations];
    setReservations(next);
    localStorage.setItem('bb-reservations', JSON.stringify(next));
    setReserveOpen(false);
    setView('account');
    showToast('Rezervace byla úspěšně vytvořena.');
  }

  function cancelReservation(id) {
    if (!window.confirm('Opravdu chcete tuto demonstrační rezervaci zrušit?')) return;
    const next = reservations.map((reservation) => reservation.id === id
      ? { ...reservation, cancelled: true, status: 'Zrušeno – refundace zadána' }
      : reservation
    );
    setReservations(next);
    localStorage.setItem('bb-reservations', JSON.stringify(next));
    showToast('Rezervace byla zrušena a refundace zadána.');
  }

  function addIdea(idea) {
    const id = `idea-${Date.now()}`;
    const nextIdea = { ...idea, id, votes: 1 };
    const nextIdeas = [nextIdea, ...ideas];
    const nextVoted = [...votedIdeas, id];
    setIdeas(nextIdeas);
    setVotedIdeas(nextVoted);
    localStorage.setItem('bb-ideas', JSON.stringify(nextIdeas));
    localStorage.setItem('bb-voted-ideas', JSON.stringify(nextVoted));
    showToast('Nápad byl přidán do hlasování.');
  }

  function voteForIdea(id) {
    if (votedIdeas.includes(id)) {
      showToast('Pro tento nápad už jste hlasovali.');
      return;
    }
    const nextIdeas = ideas.map((idea) => idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea);
    const nextVoted = [...votedIdeas, id];
    setIdeas(nextIdeas);
    setVotedIdeas(nextVoted);
    localStorage.setItem('bb-ideas', JSON.stringify(nextIdeas));
    localStorage.setItem('bb-voted-ideas', JSON.stringify(nextVoted));
    showToast('Hlas byl započítán.');
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('bb-user');
    go('home');
  }

  return (
    <div className="app">
      <Header view={view} go={go} user={user} setAuthOpen={setAuthOpen} />

      {view === 'home' && <Home choose={choose} go={go} />}
      {view === 'campaigns' && <Campaigns choose={choose} />}
      {view === 'ideas' && (
        <Ideas
          ideas={ideas}
          votedIdeas={votedIdeas}
          addIdea={addIdea}
          voteForIdea={voteForIdea}
        />
      )}
      {view === 'detail' && (
        <Detail
          product={selected}
          size={size}
          setSize={setSize}
          retail={retail}
          presale={presale}
          startReserve={startReserve}
          go={go}
        />
      )}
      {view === 'account' && (
        <Account
          user={user}
          reservations={reservations}
          setAuthOpen={setAuthOpen}
          logout={logout}
          cancelReservation={cancelReservation}
          showToast={showToast}
        />
      )}
      {view === 'behind' && <Behind />}

      <Footer go={go} />

      {authOpen && <AuthModal onClose={() => { setAuthOpen(false); setPendingReserve(false); }} onLogin={login} />}
      {reserveOpen && (
        <ReserveModal
          product={selected}
          size={size}
          retail={retail}
          presale={presale}
          onClose={() => setReserveOpen(false)}
          finish={finishReserve}
        />
      )}
      {toast && <div className="toast" role="status">✓ {toast}</div>}
    </div>
  );
}

function Header({ view, go, user, setAuthOpen }) {
  return (
    <header>
      <button className="brand" onClick={() => go('home')}>
        <span>BB</span>
        <div><b>BioBezObalu</b><small>CHOCOLATE CLUB</small></div>
      </button>
      <nav>
        <button className={view === 'home' ? 'on' : ''} onClick={() => go('home')}>Domů</button>
        <button className={view === 'campaigns' || view === 'detail' ? 'on' : ''} onClick={() => go('campaigns')}>Předprodeje</button>
        <button className={view === 'ideas' ? 'on' : ''} onClick={() => go('ideas')}>Nápady a hlasování</button>
        <button className={view === 'behind' ? 'on' : ''} onClick={() => go('behind')}>Ze zákulisí</button>
      </nav>
      <div className="header-actions">
        <a href="https://biobezobalu.cz" target="_blank" rel="noreferrer">E-shop ↗</a>
        <button className="account-btn" onClick={() => user ? go('account') : setAuthOpen(true)}>
          {user ? user.name.split(' ')[0] : 'Přihlásit se'}
        </button>
      </div>
    </header>
  );
}

function Home({ choose, go }) {
  const featured = products.find((product) => product.slug === 'espresso-72') || products[0];

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">LIMITOVANÉ ČOKOLÁDY • SLEVA 15 %</div>
          <h1>Rozhodněte, co vyrobíme příště.</h1>
          <p>Rezervujte čokoládu během kampaně, zaplaťte o 15 % méně a sledujte její cestu od nápadu až po výrobu.</p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => go('campaigns')}>Prohlédnout předprodeje</button>
            <button className="ghost" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>Jak to funguje</button>
          </div>
          <div className="trust">
            <span>↩ Kdykoliv zrušíte</span>
            <span>⚡ Peníze obratem zpět</span>
            <span>🌱 Všechny kampaně vegan</span>
          </div>
        </div>
        <button className="hero-card" onClick={() => choose(featured)}>
          <ChocolateVisual product={featured} large />
          <div className="float-badge">{featured.reserved} % rezervováno</div>
          <div className="hero-card-info">
            <small>NEJBLÍŽE K VÝROBĚ</small>
            <h3>{featured.name}</h3>
            <div className="bar"><i style={{ width: `${featured.reserved}%` }} /></div>
            <div><b>{featured.reserved} kg z {featured.goal} kg</b><span>Zbývá {featured.days} dní</span></div>
          </div>
        </button>
      </section>

      <section id="how" className="how">
        <div className="section-head">
          <span>JAK TO FUNGUJE</span>
          <h2>Jednodušší než běžná předobjednávka</h2>
          <p>Platíte rovnou zvýhodněnou cenu. O zbytek se postaráme my.</p>
        </div>
        <div className="steps">
          <Step n="01" t="Vyberete čokoládu" x="Zvolíte příchuť a balení 250 g, 1 kg nebo 3 × 1 kg." />
          <Step n="02" t="Zaplatíte o 15 % méně" x="Za 250 g zaplatíte 255 Kč místo 300 Kč, za 1 kg 850 Kč místo 1 000 Kč." />
          <Step n="03" t="Sledujete výrobu" x="V účtu vidíte rezervaci, voucher i postup přípravy vaší várky." />
          <Step n="04" t="Vyberete doručení" x="Pošleme ji hned, nebo ji přidáte k větší objednávce přes e-shop." />
        </div>
        <div className="how-note">
          <b>Rezervace bez rizika.</b>
          <span>Můžete ji zrušit během kampaně i kdykoliv potom. Zaplacenou částku vám obratem vrátíme.</span>
        </div>
      </section>

      <section className="featured">
        <div className="section-head row">
          <div><span>AKTIVNÍ PŘEDPRODEJE</span><h2>Více příchutí, menší přehledné karty</h2></div>
          <button className="text-btn" onClick={() => go('campaigns')}>Zobrazit všech 9 →</button>
        </div>
        <div className="cards compact">{products.slice(0, 8).map((product) => <ProductCard key={product.slug} product={product} choose={choose} />)}</div>
      </section>

      <section className="ideas-teaser">
        <div>
          <span className="eyebrow">NÁPADY Z KOMUNITY</span>
          <h2>Navrhněte vlastní příchuť nebo podpořte cizí nápad.</h2>
          <p>Návrhy jsou zatím jen nezávazná anketa. K rezervaci je otevřeme teprve tehdy, až je vybereme do skutečné kampaně.</p>
        </div>
        <button className="primary" onClick={() => go('ideas')}>Otevřít návrhy a hlasování</button>
      </section>

      <section className="voucher-explain">
        <div>
          <span className="eyebrow light-text">VOUCHER PO REZERVACI</span>
          <h2>Rezervace vám neubere výhody z e-shopu.</h2>
          <p>Čokoládu po výrobě vložíte do košíku za běžnou cenu a uplatníte voucher v její plné hodnotě. Produkt se tak může započítat do dopravy zdarma i objemových slev.</p>
        </div>
        <div className="voucher-card">
          <small>UKÁZKOVÁ REZERVACE</small>
          <h3>Malina 70 % • 1 kg</h3>
          <div className="price-line"><span>Zaplaceno v předprodeji</span><b>850 Kč</b></div>
          <div className="code"><span>REZERVACE1000</span><button type="button">Kód připraven</button></div>
          <small>Hodnota voucheru 1 000 Kč</small>
        </div>
      </section>
    </main>
  );
}

function Step({ n, t, x }) {
  return <article className="step"><b>{n}</b><div><h3>{t}</h3><p>{x}</p></div></article>;
}

function ChocolateVisual({ product, large = false }) {
  const style = {
    '--bar-color': product.barColor,
    '--accent-color': product.accentColor,
    '--accent-soft': product.accentSoft
  };

  return (
    <div className={`chocolate-visual ${large ? 'large' : ''}`} style={style} aria-label={`Ilustrace čokolády ${product.name}`}>
      <div className="flavour-orb one" />
      <div className="flavour-orb two" />
      <div className="chocolate-bar" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => <i key={index} />)}
      </div>
      <div className="visual-label"><small>VEGAN</small><strong>{product.mark}</strong></div>
    </div>
  );
}

function ProductCard({ product, choose }) {
  return (
    <article className="product-card" onClick={() => choose(product)}>
      <div className="product-img">
        <ChocolateVisual product={product} />
        <span className="vegan">VEGAN</span>
      </div>
      <div className="product-content">
        <small>{product.origin} • {product.cocoa}</small>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <div className="bar"><i style={{ width: `${product.reserved}%` }} /></div>
        <div className="progress-row"><b>{product.reserved} kg / {product.goal} kg</b><span>{product.days} dní</span></div>
        <div className="card-bottom">
          <div><small>250 g za</small><strong>{money(255)}</strong><del>{money(300)}</del></div>
          <button type="button">Rezervovat</button>
        </div>
      </div>
    </article>
  );
}

function Campaigns({ choose }) {
  const [filter, setFilter] = useState('all');
  const visibleProducts = useMemo(() => {
    if (filter === 'closest') return [...products].sort((a, b) => b.reserved - a.reserved);
    if (filter === 'new') return [...products].sort((a, b) => b.days - a.days);
    return products;
  }, [filter]);

  return (
    <main className="subpage">
      <div className="page-title">
        <span>AKTIVNÍ KAMPANĚ</span>
        <h1>Předprodeje čokolád</h1>
        <p>Každá rezervace nás posune blíž k výrobě nové limitované várky. Běžná cena je 300 Kč za 250 g a 1 000 Kč za 1 kg; v předprodeji platíte o 15 % méně.</p>
      </div>
      <div className="price-chips">
        <span><b>250 g</b> 255 Kč <del>300 Kč</del></span>
        <span><b>1 kg</b> 850 Kč <del>1 000 Kč</del></span>
        <span><b>3 × 1 kg</b> 2 550 Kč <del>3 000 Kč</del></span>
      </div>
      <div className="filter">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Všechny</button>
        <button className={filter === 'closest' ? 'active' : ''} onClick={() => setFilter('closest')}>Nejblíž výrobě</button>
        <button className={filter === 'new' ? 'active' : ''} onClick={() => setFilter('new')}>Nejnovější</button>
      </div>
      <div className="cards compact">{visibleProducts.map((product) => <ProductCard key={product.slug} product={product} choose={choose} />)}</div>
    </main>
  );
}

function Ideas({ ideas, votedIdeas, addIdea, voteForIdea }) {
  const [name, setName] = useState('');
  const [composition, setComposition] = useState('');
  const [taste, setTaste] = useState('');
  const [error, setError] = useState('');
  const sortedIdeas = [...ideas].sort((a, b) => b.votes - a.votes);

  function submitIdea() {
    if (!name.trim() || !composition.trim() || !taste.trim()) {
      setError('Vyplňte název, složení i popis chuti.');
      return;
    }
    addIdea({ name: name.trim(), composition: composition.trim(), taste: taste.trim() });
    setName('');
    setComposition('');
    setTaste('');
    setError('');
  }

  return (
    <main className="subpage ideas-page">
      <div className="page-title">
        <span>NÁPADY A HLASOVÁNÍ</span>
        <h1>Jakou čokoládu máme zkusit příště?</h1>
        <p>Vlevo můžete navrhnout úplně novou příchuť. Vpravo hlasujete pro nápady komunity. Zatím jde pouze o nezávaznou anketu bez rezervace.</p>
      </div>
      <div className="ideas-layout">
        <section className="idea-form-panel">
          <span>NAVRHNĚTE VLASTNÍ ČOKOLÁDU</span>
          <h2>Váš nový nápad</h2>
          <p>Napište název, složení a jak by podle vás měla chutnat.</p>
          <label>Název čokolády
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Např. Meruňka & rozmarýn" />
          </label>
          <label>Složení
            <textarea value={composition} onChange={(event) => setComposition(event.target.value)} placeholder="Např. 70% čokoláda, sušená meruňka, rozmarýn" rows="4" />
          </label>
          <label>Popis chuti
            <textarea value={taste} onChange={(event) => setTaste(event.target.value)} placeholder="Ovocná, lehce bylinná, s dlouhým kakaovým závěrem…" rows="4" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary wide" type="button" onClick={submitIdea}>Přidat nápad do hlasování</button>
          <small className="demo-note">V této verzi se návrh uloží jen do vašeho prohlížeče.</small>
        </section>

        <section className="vote-panel">
          <div className="vote-head">
            <div><span>NEZÁVAZNÁ ANKETA</span><h2>Hlasujte pro příchutě</h2></div>
            <b>{ideas.length} nápadů</b>
          </div>
          <div className="idea-list">
            {sortedIdeas.map((idea, index) => {
              const voted = votedIdeas.includes(idea.id);
              return (
                <article className="idea-row" key={idea.id}>
                  <div className="idea-rank">{index + 1}</div>
                  <div className="idea-copy">
                    <h3>{idea.name}</h3>
                    <p><b>Složení:</b> {idea.composition}</p>
                    <p>{idea.taste}</p>
                  </div>
                  <button className={voted ? 'voted' : ''} type="button" onClick={() => voteForIdea(idea.id)}>
                    <span>{voted ? '✓ Hlasováno' : '♡ Hlasovat'}</span>
                    <b>{idea.votes}</b>
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Detail({ product, size, setSize, retail, presale, startReserve, go }) {
  return (
    <main className="detail">
      <button className="back" onClick={() => go('campaigns')}>← Zpět na předprodeje</button>
      <div className="detail-grid">
        <div className="detail-photo">
          <ChocolateVisual product={product} large />
          <span className="vegan">VEGAN</span>
        </div>
        <div className="detail-copy">
          <small>{product.origin} • {product.cocoa}</small>
          <h1>{product.name}</h1>
          <p className="detail-lead">{product.subtitle}</p>
          <div className="campaign-progress">
            <div><b>{product.reserved} kg rezervováno</b><span>Cíl {product.goal} kg</span></div>
            <div className="bar"><i style={{ width: `${product.reserved}%` }} /></div>
            <small>Do konce kampaně zbývá {product.days} dní</small>
          </div>
          <h3>Vyberte množství</h3>
          <div className="size-picker">
            {sizes.map((option) => (
              <button key={option.g} className={size.g === option.g ? 'selected' : ''} onClick={() => setSize(option)}>
                <b>{option.label}</b>
                <span>{money(presalePrice(option.retail))} v předprodeji</span>
                <del>{money(option.retail)}</del>
              </button>
            ))}
          </div>
          <div className="summary">
            <div><span>Běžná cena</span><del>{money(retail)}</del></div>
            <div><span>Předprodejní sleva 15 %</span><b>− {money(retail - presale)}</b></div>
            <div className="total"><span>Zaplatíte nyní</span><strong>{money(presale)}</strong></div>
          </div>
          <button className="primary wide" onClick={startReserve}>Vyzkoušet rezervaci za {money(presale)}</button>
          <p className="cancel-note">↩ Rezervaci můžete kdykoliv zrušit. Peníze vrátíme bez zbytečného odkladu.</p>
        </div>
      </div>
      <section className="detail-info">
        <article><span>CHUŤOVÝ PROFIL</span><h2>Co můžete čekat</h2><p>{product.taste}</p></article>
        <article><span>PO VÝROBĚ</span><h2>Vyberete si způsob doručení</h2><p>Necháte si čokoládu ihned poslat, nebo si ji přidáte k větší objednávce na BioBezObalu.cz pomocí voucheru v plné hodnotě produktu.</p></article>
      </section>
    </main>
  );
}

function Account({ user, reservations, setAuthOpen, logout, cancelReservation, showToast }) {
  if (!user) {
    return (
      <main className="empty">
        <h1>Váš klubový účet</h1>
        <p>Přihlaste se a uvidíte své rezervace, vouchery i stav výroby.</p>
        <button className="primary" onClick={() => setAuthOpen(true)}>Přihlásit se</button>
      </main>
    );
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      showToast('Kód byl zkopírován.');
    } catch {
      showToast(`Kód: ${code}`);
    }
  }

  return (
    <main className="subpage account-page">
      <div className="account-hero">
        <div><span>MŮJ ÚČET</span><h1>Ahoj, {user.name.split(' ')[0]} 👋</h1><p>Tady si můžete celý demonstrační proces opravdu vyzkoušet.</p></div>
        <button className="ghost" onClick={logout}>Odhlásit se</button>
      </div>
      {reservations.length === 0 ? (
        <div className="empty-card"><h2>Zatím tu nic není</h2><p>Po první rezervaci se tady objeví její stav, zaplacená částka a voucher.</p></div>
      ) : (
        <div className="reservations">
          {reservations.map((reservation) => (
            <article key={reservation.id} className={reservation.cancelled ? 'cancelled' : ''}>
              <div className="res-top">
                <div>
                  <span className="status-dot">●</span><small>{reservation.status}</small>
                  <h3>{reservation.product}</h3>
                  <p>{reservation.size} • {reservation.delivery === 'now' ? 'Poslat ihned po výrobě' : 'Přidat k další objednávce'}</p>
                </div>
                <div className="res-price"><b>{money(reservation.paid)}</b><small>zaplaceno</small></div>
              </div>
              <div className="production">
                <span className="done">Rezervováno</span><i /><span>Kampaň</span><i /><span>Výroba</span><i /><span>Připraveno</span>
              </div>
              <div className="voucher-row">
                <div>
                  <small>{reservation.cancelled ? 'VOUCHER ZNEPLATNĚN' : 'VOUCHER PŘIPRAVEN'}</small>
                  <strong>{reservation.code}</strong>
                  <span>Hodnota {money(reservation.value)}</span>
                </div>
                <div className="voucher-actions">
                  <button disabled={reservation.cancelled} onClick={() => copyCode(reservation.code)}>Kopírovat kód</button>
                  {!reservation.cancelled && <button className="danger-link" onClick={() => cancelReservation(reservation.id)}>Zrušit rezervaci</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

function Behind() {
  return (
    <main className="subpage">
      <div className="page-title"><span>ZE ZÁKULISÍ</span><h1>Od kakaové hmoty po hotovou tabulku</h1><p>Sledujte přípravu receptur, testování i výrobu jednotlivých kampaní.</p></div>
      <div className="behind-grid">
        <article className="big"><img src="/chocolate-4.jpg" alt="Vývoj citronové čokolády" /><div><small>VÝVOJ RECEPTURY</small><h2>Testujeme novou citronovou bílou čokoládu</h2><p>Hledáme poměr, který zachová čistou chuť kakaového másla a přitom nabídne výraznou svěžest.</p></div></article>
        <article><img src="/chocolate-3.jpg" alt="Zkušební várka čokolády" /><div><small>VÝROBA</small><h3>První zkušební várka</h3></div></article>
        <article><img src="/chocolate-2.jpg" alt="Kakaové máslo" /><div><small>SUROVINY</small><h3>Nové kakaové máslo z Dominikánské republiky</h3></div></article>
      </div>
    </main>
  );
}

function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('Tomáš Marek');
  const [email, setEmail] = useState('tomas@example.cz');

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal auth">
        <button className="x" onClick={onClose}>×</button>
        <span>BioBezObalu Club</span>
        <h2>{mode === 'login' ? 'Přihlášení' : 'Vytvořit účet'}</h2>
        <p>V prototypu se údaje ukládají pouze do tohoto prohlížeče.</p>
        {mode === 'register' && <label>Jméno<input value={name} onChange={(event) => setName(event.target.value)} /></label>}
        <label>E-mail<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Heslo<input type="password" defaultValue="heslo123" /></label>
        <button className="primary wide" onClick={() => onLogin({ name: mode === 'login' ? 'Tomáš Marek' : name, email })}>
          {mode === 'login' ? 'Přihlásit se a pokračovat' : 'Zaregistrovat se a pokračovat'}
        </button>
        <button className="switch" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Nemáte účet? Zaregistrovat se' : 'Už máte účet? Přihlásit se'}
        </button>
      </div>
    </div>
  );
}

function ReserveModal({ product, size, retail, presale, onClose, finish }) {
  const [delivery, setDelivery] = useState('later');
  const [step, setStep] = useState(1);

  return (
    <div className="overlay">
      <div className="modal reserve">
        <button className="x" onClick={onClose}>×</button>
        {step === 1 ? (
          <>
            <span>KROK 1 ZE 2</span>
            <h2>Jak chcete čokoládu převzít?</h2>
            <div className="delivery-options">
              <button className={delivery === 'now' ? 'selected' : ''} onClick={() => setDelivery('now')}>
                <b>📦 Poslat ihned po výrobě</b>
                <small>Po dokončení vás vyzveme k doplacení dopravy, pokud nebude zdarma.</small>
              </button>
              <button className={delivery === 'later' ? 'selected' : ''} onClick={() => setDelivery('later')}>
                <b>🛒 Přidat k větší objednávce</b>
                <small>V účtu uvidíte voucher v plné hodnotě produktu pro použití na e-shopu.</small>
              </button>
            </div>
            <button className="primary wide" onClick={() => setStep(2)}>Pokračovat k platbě</button>
          </>
        ) : (
          <>
            <span>KROK 2 ZE 2</span>
            <h2>Souhrn rezervace</h2>
            <div className="order-line"><div><b>{product.name}</b><small>{size.label}</small></div><b>{money(presale)}</b></div>
            <div className="payment">
              <label>Číslo karty<input defaultValue="4242 4242 4242 4242" /></label>
              <div><label>Platnost<input defaultValue="12/29" /></label><label>CVC<input defaultValue="123" /></label></div>
            </div>
            <div className="modal-summary">
              <span>Běžná hodnota produktu <b>{money(retail)}</b></span>
              <span>Sleva předprodeje <b>− {money(retail - presale)}</b></span>
              <strong>K úhradě <b>{money(presale)}</b></strong>
              <span>Budoucí voucher <b>{voucherCode(retail)}</b></span>
            </div>
            <button className="primary wide" onClick={() => finish(delivery)}>Demonstračně zaplatit a rezervovat</button>
            <small className="demo">Demonstrační platba – nic se skutečně nestrhne.</small>
          </>
        )}
      </div>
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer>
      <div className="brand light"><span>BB</span><div><b>BioBezObalu</b><small>CHOCOLATE CLUB</small></div></div>
      <p>Limitované vegan čokolády, o kterých rozhodují zákazníci.</p>
      <div><button onClick={() => go('campaigns')}>Předprodeje</button><button onClick={() => go('ideas')}>Nápady</button><button onClick={() => go('behind')}>Ze zákulisí</button><a href="https://biobezobalu.cz">BioBezObalu.cz</a></div>
    </footer>
  );
}
