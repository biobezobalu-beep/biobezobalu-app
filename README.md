# BioBezObalu aplikace – čistá verze

Tento balíček obsahuje pouze aktuální aplikaci:

- `/anketa`
- detail kampaní `/anketa/[slug]`
- `/komunita`
- `/galerie`
- `/chat`
- odkaz na současný e-shop

Soubor `data/products.js` poskytuje pojmenované i výchozí exporty, takže build nespadne ani v případě, že v repozitáři dočasně zůstane stará stránka `/produkty/[slug]`.

## Důležité při nahrání na GitHub

Pouhé nahrání nových souborů neodstraní staré složky. Pro opravdu čistou instalaci nejdříve smažte starý obsah repozitáře nebo založte nový prázdný repozitář, a potom nahrajte obsah tohoto ZIPu přímo do kořene.
