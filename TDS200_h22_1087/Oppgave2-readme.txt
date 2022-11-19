Denne appen har blitt testet på en iPhone (iOS 16) gjennom Xcode versjon 14.0 beta 6

App-funksjonaliteter:

    Burgermeny:
    - Appen har en burgermeny som i stor grad brukes for å navigere mellom forskjellige sider.
    - Hvis man ikke er logget inn vil menyen kun ha lenke til innloggingssiden.
    - Når man er logget inn vil man ha tilgang til en meny som inneholder lenker til:
        - Profilsiden
        - Legg ut ny annonse
        - Mine annonser
        - Meldinger
        - Lagrede annonser
        - Logg ut
    - Måten menyen er laget vil kun innloggede brukere kunne besøke de forskjellige sidene (untatt logg inn),
    men hvis noen skulle klare å komme seg inn på en side som ikke er tilgjengelig for dem vil routeren redirigere dem til logg inn siden

    Visning av annonser:
    - En bruker kan se alle annonsene i en liste-format uten å være logget inn.
    - Brukeren kan bruke søkefeltet for å filtrere blant annonsene, listevisningen oppdateres mens brukeren skriver.
    - Brukeren kan åpne en modal hvor de kan sortere søk etter dato, pris eller alfabetisk.
    - I denne modalen kan man også velge å filtrere etter plattform, tilstand og sted.
    - Brukeren kan trykke seg inn på en annonse og få mer informasjon.

        Annonser:
        - En bruker kan trykke seg inn på en annonse uten å være logget inn.
        - Har annonsen flere enn et bilde vil man kunne bla gjennom bildene som en carousel.
        - Alle annonser har:
            - Minst et bilde.
            - Tittel.
            - Beskrivelse.
            - Plattform.
            - Pris.
            - Tilstand.
            - Addresse.
            - Sted.
            - Post nummer.
        - Gjennom Google Maps har annonsene et lite kart som viser området hvor den oppgitte addressen er. (Det er mulig at kartet ikke fungerer, API nøkkelen hos Google er laget med en gratis prøveperiode som kanskje går ut før sensuren)
            - Addressen i annonsen blir gjennom et API konvertert til koordinater som Google Maps bruker for å sentrere kartet
        - En bruker som er logget inn kan lagre favoritt annonsene sine, og fjerne de fra favoritter.

    Lage ny annonse:
    - Bare brukere som er logget inn kan lage en ny annonse.
    - Man kan laste opp et eller flere bilder (en annonse må ha minst ett bilde).
    - Brukeren kan fjerne bilder som er lastet opp.
    - Alle felt må være utfylt for å kunne lagre annonsen.
    - Postnummer må være gyldig (4 siffer og ikke inneholde bokstaver).
    - Pris må være gyldig (1-6 siffer og verdi kan ikke være 0 eller inneholde bokstaver).

    Se mine annonser:
    - En bruker som er logget inn kan velge å bare se annonser som de selv har laget.
    - En annonse kan slettes.
    - Før annonsene lastes er det en spinner på skjermen som indikerer at appen jobber.

    Logg inn og registrering:
    - Logg inn skjerm som er stylet som en gammel Game Boy.
    - Man kan både logge inn og registrere seg som ny bruker.
    - Logg inn skjermen har et "easter egg" hvor man kan spille en remake av Chrome sitt dinosaur spill.
        - OBS! Kjent bug: hvis man bytter mellom Game Mode og Login flere ganger vil skjermen forsvinne.

    - Profilside:
        - Når man er logget inn har man tilgang til en side hvor man kan se:
            - Profilbilde
            - Navn
            - Epost
        - Disse tre feltene kan også endres og oppdateres i Directus.
        - Når man laster opp et profilbilde kan man se en preview før man lagrer.

    - Meldinger:
        - Brukere kan sende meldinger til hverandre gjennom annonser.
        - Man kan på en egen side se alle brukere du har sendt melding til eller fått melding fra
        - Hvis sender melding til en annen bruker kan man logge inn på den andre brukeren og få opp meldingen der

    - Favoritter:
        - Brukere som er logget inn kan lagre annonser som favoritter.
        - Favoritter kan sees på en egen side.
        - Favoritter siden har en spinner som indikerer at appen jobber.
        
App-styling:

    - Jeg har prøvd å få fram et gjennomgående retro spill tema ved å bruke pikselerte ikoner og font
    - Som primærfarge har jeg valgt en neon grønn farge for å gjøre appen livlig og spennende
    - Fordi jeg har valgt en neon grønn tema farge har jeg med vilje ikke brukt rød farge på viktige 
    elementer av hensyn til at rød-grønn fargeblindhet er den vanligste fargeblindheten

Referanser:

    - APIer (utenom directus):
        - forward geocoding (konvertere adresse til koordinater): https://www.geoapify.com/
        - kart: https://developers.google.com/maps/documentation/javascript/overview

    - Font:
        - https://www.fontspace.com/pixeloid-font-f69232

    - Ikoner: 
        - mail.png: https://www.flaticon.com/free-icon/mail_408203?term=pixel&page=1&position=23&page=1&position=23&related_id=408203&origin=search
        - users.png: https://www.flaticon.com/free-icon/users_465356
        - map-marker.png: https://www.flaticon.com/free-icon/map-marker_7734343?term=pixel&page=1&position=90&page=1&position=90&related_id=7734343&origin=search
        - note.png: https://www.flaticon.com/free-icon/note_408200?related_id=408159&origin=search
        - edit-button.png: https://www.flaticon.com/free-icon/edit-button_7734280
        - trash-bin.png: https://www.flaticon.com/free-icon/trash-bin_7734287#
        - next.png: https://www.flaticon.com/free-icon/next_2886082
        - search.svg: https://www.flaticon.com/free-icon/search_7734281?term=pixel%20search&page=1&position=3&page=1&position=3&related_id=7734281&origin=search
        - folder.png: https://www.flaticon.com/free-icon/folder_7734260
        - coin.png: https://www.flaticon.com/free-icon/coin_6514926
        - photo-camera.png: https://www.flaticon.com/free-icon/photo-camera_465374?related_id=465374#
        - chat.png: https://www.flaticon.com/free-icon/chat_465330?related_id=465330&origin=search
        - pixel aliens:
            - https://www.flaticon.com/free-icon/alien-pixelated-shape-of-a-digital-game_41993
            - https://www.flaticon.com/free-icon/alien-space-character-of-pixels-for-a-game_40782
            - https://www.flaticon.com/free-icon/pixelated-alien_40761
            - https://www.flaticon.com/free-icon/alien-of-game_42157
            - https://www.flaticon.com/free-icon/space-game-character-of-pixels_42117
            - https://www.flaticon.com/free-icon/alien-ufo-pixelated-game-shape_42009


    - Kode / Tutorials:
        - Dinosaur spill: https://www.youtube.com/watch?v=i7nIutSLvdU
        - Google Maps: https://dev.to/aaronksaunders/create-your-own-vue3-google-maps-component-with-ionic-framework-capacitor-735

    - npm pakker:
        - axios (for å hente data fra API): https://www.npmjs.com/package/axios
        - swiper (for å vise flere bilder): https://www.npmjs.com/package/swiper

