import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "BioBezObalu – rozhodněte, co vyrobíme",
  description: "Komunitní anketa, rezervace limitovaných čokolád, galerie a rychlý chat."
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
