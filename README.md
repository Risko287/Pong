# Online Hra Pong

## Popis

Táto online hra Pong využíva WebSocket technológiu na vytvorenie herného prostredia podobného klasickému Pongu, ktorý je možné nájsť na [ponggame.org](https://www.ponggame.org/). Hra umožňuje hrať 1 až 4 hráčom s cieľom odraziť loptu od stien a nepustiť ju za hraciu plochu. Každý hráč má svoj pohybujúci sa obdĺžnik(paddle), ktorým kontroluje pohyb svojho hráča na hracej ploche. Cieľom hry je odraziť loptu čo najdlhšie bez toho, aby prešla za hraciu plochu, a to najlepšie tak, aby súperovi nepustili loptu za jeho stranu.


## Technológie

- **Serverová Logika:** Herná logika je postavená na PHP, ktorý riadi plynulý chod hry a komunikáciu medzi hráčmi.
- **Grafické Spracovanie:** Grafické zobrazenie hry je vytvorené pomocou JavaScriptu, ktorý využíva HTML canvas na vykreslenie hracej plochy, lopty a hráčov.
- **WebSocket:** Rýchla a spoľahlivá komunikácia medzi hráčmi je umožnená WebSocket protokolom. Vďaka nemu je možné sledovať herný stav v reálnom čase.

## Hlavné Funkcie

- Hracia plocha s grafickým zobrazením prebiehajúcej hry.
- Možnosť prihlásiť sa do hry s vlastným menom.
- Možnosť odštartovať hru, keď je dostatočný počet hráčov prihlásených.
- Dynamická úprava hracej plochy na základe počtu hráčov.
- Sledovanie počtu odrazených loptičiek pre každého hráča.
- Automatický štart hry, keď je prihlásený posledný hráč.
- Hra sa skončí, keď posledný hráč nechytí 3 krát loptičku.
- Zobrazenie informácií o hráčoch, ich skóre a počte odrazených loptičiek.
  
## Herný Priebeh
Hra začína na titulnej webovej stránke, kde sa hráči môžu prihlásiť pod svojím menom. Taktiež sa tu nachádza počet aktuálne pripojených hráčov.
Po dostatočnom počte prihlásených hráčov môže prvý hráč odštartovať hru. Hra môže začať aj automaticky, keď sú prihlásení všetci 4 hráči.

Po spustení hry sa plocha prispôsobí počtu hráčov, a loptička sa začne pohybovať medzi hráčmi. Hráči používajú svoje obdĺžniky(paddle) na odrazenie loptičky a snažia sa nepustiť ju za svoju stranu. Každý hráč má zobrazený svoj počet odrazených loptičiek, a cieľom hry je, aby loptička čo najdlhšie ostala v hre.

Hra sa skončí, keď posledný hráč nechytí loptičku 3 krát, a jeho strana na hracej ploche sa nahradí plnou čiarou. Na konci hry sa zobrazí výsledok a hráči môžu začať novú hru.


