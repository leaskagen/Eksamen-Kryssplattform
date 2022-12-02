# Eksamen-Kryssplattform

Dette repositoriet inneholder besvarelsen min til eksamen i faget Kryssplattform (TDS200). Applikasjonen er bygget i Ionic med Vue.js og Typescript, testet på en iOS telefon gjennom Xcode, og med Directus som database og backend.
<br>
<br>
Se nederst for skjermbilder!

## Oppgavebeskrivelse

Oppgaven var å lage en app for et salgsplattform for retrospill, lignende Finn.no, Tise osv..

### Funksjonaliteter

* Annonsene blir vist i et listeformat
* Man kan søke blant annonsene med søkefelt, sortere etter pris, dato, alfabetisk, eller filtrere etter sted, tilstand og plattform
* Annonser har et eller flere bilder, pris, beskrivelse og Google Maps vindu som er sentrert på den oppgitte adressen
* Brukere som er logget inn kan også sende melding til selger og lagre annonsen
* Innloggede brukere kan publisere sine egne annonser, og slette de etterpå
* Innloggede brukere kan oppdatere brukerinformasjonen sin
* Logg inn skjermen er stylet som en gammel game boy, og har et hemmelig "chrome dino game" som easter egg (spillet er litt buggy på telefonen, men fungerer bra i nettleser)
* Man kan lage ny bruker hvis man ikke har det allerede
* Meldingsystemet er fungerende, en melding sendt fra en bruker vil komme opp hos den andre brukeren
* De fleste sidene er tilgjengelige gjennom burgermenyen, er man ikke logget inn vil menyen kun ha link til logg inn siden, men er man logget inn vil man ha tilgang til alle sidene
* Jeg prøvde å få en helhetlig retro tema ved bruk av piksel font og piksel ikoner
* Det er integrert loading spinnere på de sidene som henter data fra API for å indikere til brukeren at appen jobber, slik at appen oppleves som raskere

<br>

OBS! Google Maps integrasjonen er ikke lengre fungerende fordi gratisperioden på APIet mitt har gått ut :(

## Skjermbilder

### Annonser

<img align="left" src="https://i.postimg.cc/mDZL801Y/IMG-5959.png"/>
<img align="center" src="https://i.postimg.cc/N0kG8gFG/IMG-5966.png"/>
<br>
<img align="left" src="https://i.postimg.cc/T1pRXg9h/IMG-5967.png"/>
<img align="center" src="https://i.postimg.cc/ydfV5v0w/IMG-5968.png"/>

### Meldinger

<img align="left" src="https://i.postimg.cc/pVGT1XZp/IMG-5965.png"/>
<img align="center" src="https://i.postimg.cc/ncNLpRNx/IMG-5958.png"/>

### Logg inn

<img align="left" src="https://i.postimg.cc/brBwG3JQ/IMG-5962.png"/>
<img align="center" src="https://i.postimg.cc/rFDm6Xng/IMG-5961.png"/>

### Profil

<img align="left" src="https://i.postimg.cc/hGBP7JS3/IMG-5964.png"/>

<br>

### Burgermeny

<img align="left" src="https://i.postimg.cc/VkMk69cC/IMG-5963.png"/>
