import { ideas } from "@/data/products";

export default function IdeaPanels() {
  return (
    <div className="lower-grid">
      <section className="panel">
        <h2>Navrhni vlastní čokoládu</h2>
        <p>Máš nápad na jedinečnou čokoládu? Navrhni ji a můžeme ji zařadit do další hlasovací fáze.</p>
        <label>Název čokolády</label>
        <input placeholder="Např. Matcha & Bílá čokoláda"/>
        <label>Složení / popis chuti</label>
        <textarea placeholder="Uveďte hlavní suroviny, příchutě, % kakaa..."/>
        <button>Odeslat návrh</button>
      </section>
      <section className="panel">
        <h2>Hlasuj nezávazně pro další čokolády</h2>
        <p>Tyto čokolády zatím nejsou v rezervaci. Dej nám vědět, které tě nejvíc lákají.</p>
        <div className="idea-list">
          {ideas.map((idea,i)=><button key={idea}><span>{i+1}. {idea}</span><b>♡</b></button>)}
        </div>
        <div className="notice pink">♡ Vaše hlasy jsou nezávazné a slouží pouze k tomu, abychom věděli, o které čokolády máte zájem.</div>
      </section>
      <section className="panel chat-mini">
        <h2>Rychlý chat</h2>
        <p>Napište nám. Odpovíme co nejdříve.</p>
        <div className="bubble">Dobrý den, kdy bude hotová Malina 70 %?</div>
        <div className="bubble mine">Dobrý den! Pokud se naplní cílové množství, výroba začne koncem měsíce.</div>
        <div className="bubble">Skvělé, těším se! 🍫</div>
        <a href="/chat">Otevřít chat</a>
      </section>
    </div>
  );
}
