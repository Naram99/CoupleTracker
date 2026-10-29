# Fejlesztési teendők

Összeállítva: 2026. október 29., a korábbi projektáttekintés alapján.

A tételek javasolt megvalósítási sorrendben szerepelnek. A jelölőnégyzet csak a javítás és az ellenőrzés után pipálandó ki.

- **P1 – Elsőként:** hibás működés, adatvesztés vagy a felhasználói beállítások figyelmen kívül hagyása.
- **P2 – Következőként:** stabilitás, karbantarthatóság, olvashatóság és akadálymentesség.
- **P3 – Ezután:** a használat egyértelműsítése és kisebb felületi következetlenségek.

## P1 – Működési és adatkezelési hibák

- [ ] **01. A globális értesítéskikapcsolás maradjon érvényben.**
  - A központi ütemező és a főképernyő ellenőrzése vegye figyelembe a globális engedélyezettséget.
  - Ellenőrzés: kikapcsolás után, a következő napi főoldal-megnyitáskor se keletkezzen új ütemezés.
  - Érintett: [index.tsx](app/index.tsx), [notificationScheduling.ts](utils/notificationScheduling.ts), [settings.tsx](app/settings.tsx).

- [ ] **02. Kikapcsolt értesítéstípushoz ne jöjjön létre emlékeztető.**
  - Javítani a perc és az eredeti óra hibás összehasonlítását. Az előzetes emlékeztető csak a hozzá tartozó engedélyezett típushoz jöjjön létre.
  - Ellenőrzés: kikapcsolt Yearly és Every 100 days kapcsolókkal, 7 napos eltolás és 09:00 mellett a mentés ne ütemezzen értesítést.
  - Érintett: [EventForm.tsx](app/components/events/EventForm.tsx).

- [ ] **03. Az értesítésszerkesztés csak mentéskor módosítsa az ütemezést.**
  - A kapcsolók szerkesztés közben csak ideiglenes állapotot változtassanak; a törlés és újraütemezés mentéskor történjen.
  - Ellenőrzés: értesítés kikapcsolása, majd mentés nélküli visszalépés után az eredeti értesítés maradjon aktív.
  - Érintett: [EventForm.tsx](app/components/events/EventForm.tsx).

- [ ] **04. A képcsere legyen biztonságos és valóban mentéshez kötött.**
  - A kiválasztott képet ideiglenes fájlba menteni, és csak sikeres mentéskor lecserélni a korábbit. Az új kép másolása előtt ne törlődjön a régi.
  - Ellenőrzés: visszalépés vagy másolási hiba esetén a korábbi kép maradjon meg.
  - Érintett: [settings.tsx](app/settings.tsx), [imageStorage.ts](utils/imageStorage.ts).

- [ ] **05. A mentési hibák legyenek láthatók és kezelhetők.**
  - A tárolási réteg adja vissza a sikertelenséget; hibánál az űrlap maradjon nyitva. Mentés közben legyen folyamatjelzés, az ismételt mentés legyen tiltva.
  - Ellenőrzés: szimulált tárolási hibánál ne történjen sikeres mentést sugalló visszanavigálás, és az adatok legyenek újrapróbálhatók.
  - Érintett: [EventContext.tsx](context/EventContext.tsx), [NotificationsContext.tsx](context/NotificationsContext.tsx), [EventForm.tsx](app/components/events/EventForm.tsx), [settings.tsx](app/settings.tsx).

- [ ] **06. Egységesíteni és javítani a naptári dátumszámításokat.**
  - Javítani a hóvégi év/hónap/nap bontást, a fix 24 órás értesítési aritmetikát és a február 29-i évfordulók kezelését. Az évforduló sorszáma és időpontja ugyanabból a számításból származzon.
  - Ellenőrzés: 2025. január 31. → március 1. ne adjon negatív napot; Budapest időzónában 2026. szeptember 1. után a 100. naptárnap december 10. legyen; a 2028-as szökőéves évforduló ne csússzon márciusra.
  - Érintett: [dateCalculations.ts](hooks/dateCalculations.ts), [notificationScheduling.ts](utils/notificationScheduling.ts).

- [ ] **07. A widget naptárnapokkal számoljon, az alkalmazással azonos módon.**
  - A helyi éjfelek milliszekundumkülönbségének 24 órával osztása helyett óraátállítástól független naptárnap-különbséget használni.
  - Ellenőrzés: Budapest időzónában 2026. március 29. → 30. pontosan 1 nap legyen; a widget és az alkalmazás azonos értéket mutasson.
  - Érintett: [DateWidgetProvider.kt](android/app/src/main/java/com/naram99/coupletracker/widget/DateWidgetProvider.kt).

- [ ] **08. Az ismétlődő értesítések ne függjenek az alkalmazás megnyitásától.**
  - Az egyszeri következő időpont helyett platformhoz illő ismétlődést vagy több következő alkalom előzetes ütemezését kialakítani. Az eltolás és az időpont beállítása után ellenőrizni a végleges trigger jövőbeliségét.
  - Ellenőrzés: alkalmazásmegnyitás nélkül is legyen következő éves/100 napos értesítés; a már elmúlt előzetes emlékeztető ne kerüljön hibásan az ütemezésbe.
  - Érintett: [notificationScheduling.ts](utils/notificationScheduling.ts), [index.tsx](app/index.tsx).

- [ ] **09. Rendezni az útvonalakat és védeni az eseményszerkesztő belépési pontját.**
  - A nem képernyőként használt komponenseket kivinni az `app` könyvtárból. Az eseményszerkesztő kezelje a betöltést és a hiányzó vagy hibás paramétert.
  - Ellenőrzés: a komponensek ne legyenek önálló útvonalak; érvénytelen vagy hidegindításkor megnyitott szerkesztőhivatkozás ne okozzon összeomlást.
  - Érintett: [app/components](app/components), [editEvent.tsx](app/editEvent.tsx), [EventForm.tsx](app/components/events/EventForm.tsx).

## P2 – Stabilitás, karbantarthatóság és hozzáférhetőség

- [ ] **10. A widget natív része legyen reprodukálható.**
  - Teljes, ismételten is biztonságosan futtatható Expo plugint kialakítani, vagy dokumentálni a kézzel karbantartott natív munkafolyamatot. A Kotlin-források, XML-ek, regisztrációk és függőségek megőrzését rendezni.
  - Ellenőrzés: elkülönített munkapéldányban a választott újragenerálási folyamat után is épüljön és működjön a widget; ne keletkezzen duplikált receiver-bejegyzés.
  - Érintett: [withAndroidWidget.js](plugins/withAndroidWidget.js), [android](android).

- [ ] **11. Egységesíteni az Expo és a natív buildbeállításokat.**
  - Rendezni az eltérő architektúra-beállítást, verziót és versionCode-ot. Egyértelműsíteni a helyi és EAS release-aláírás folyamatát; a helyi release ne debug kulcsot használjon.
  - Ellenőrzés: a tényleges buildbeállítások és kiadási metaadatok egyezzenek a dokumentált szándékkal. A jelenlegi helyi debug-aláírásból nem következik automatikusan ugyanez az EAS production buildre.
  - Érintett: [app.json](app.json), [gradle.properties](android/gradle.properties), [build.gradle](android/app/build.gradle), [eas.json](eas.json).

- [ ] **12. Megszüntetni a widget háttérfeladatainak halmozódását.**
  - Egyedi periodikus munkát használni, és a frissítést a widget életciklusához kötni. Összehangolni a WorkManager és a widget saját periodikus frissítését.
  - Ellenőrzés: több Activity-indítás után is csak egy kívánt periodikus munka legyen; az utolsó widget törlése után ne maradjon felesleges háttérmunka.
  - Érintett: [WidgetUpdateWorker.kt](android/app/src/main/java/com/naram99/coupletracker/widget/WidgetUpdateWorker.kt), [MainActivity.kt](android/app/src/main/java/com/naram99/coupletracker/MainActivity.kt), [date_widget_info.xml](android/app/src/main/res/xml/date_widget_info.xml).

- [ ] **13. Leválasztani a widgetet az AsyncStorage belső adatbázissémájáról.**
  - A bridge mentse a kapott widgetadatot saját natív adattárba; a widget ezt olvassa a hardcode-olt `RKStorage` és `catalystLocalStorage` helyett.
  - Ellenőrzés: az alkalmazás tárolási háttérrendszerének cseréje ne igényelje a widget lekérdezéseinek átírását.
  - Érintett: [WidgetPreferences.kt](android/app/src/main/java/com/naram99/coupletracker/widget/WidgetPreferences.kt), [WidgetModule.kt](android/app/src/main/java/com/naram99/coupletracker/widget/WidgetModule.kt), [WidgetDataManager.ts](src/modules/WidgetDataManager.ts).

- [ ] **14. Szétválasztani az értesítési modell különböző állapotait.**
  - Külön kezelni a felhasználói engedélyezettséget, az ütemezési állapotot és az operációs rendszer értesítésazonosítóját a közös `string | null` / `"awaiting"` mezők helyett.
  - Ellenőrzés: az engedélyezettség egyértelmű legyen akkor is, amikor nincs aktuális OS-azonosító; az átállás őrizze meg a meglévő beállításokat.
  - Érintett: [EventTypes.ts](types/EventTypes.ts), [EventForm.tsx](app/components/events/EventForm.tsx), [notificationScheduling.ts](utils/notificationScheduling.ts).

- [ ] **15. Célzott regressziós tesztekkel rögzíteni az elvárt működést.**
  - Lefedni a hóvégeket, szökőnapot, óraátállítást, globális értesítéskikapcsolást, kikapcsolt típusok mentését és a mentés nélküli visszalépést. A tesztek a hozzájuk tartozó javításokkal együtt készüljenek.
  - Ellenőrzés: a korábban hibás esetek reprodukálhatók legyenek, javítás után pedig megbízhatóan átmenjenek; a TypeScript-ellenőrzés is maradjon hibamentes.
  - Érintett: [package.json](package.json), [dateCalculations.ts](hooks/dateCalculations.ts), [notificationScheduling.ts](utils/notificationScheduling.ts), a kapcsolódó szerkesztők.

- [ ] **16. Összehangolt Expo / React Native frissítési tervet készíteni.**
  - Felmérni az SDK 54 / React Native 0.81 alap frissítését az akkor támogatott stabil verzióra. Előbb rendezni a natív widget újragenerálását és a buildbeállítások eltéréseit.
  - Ellenőrzés: a függőségek illeszkedjenek a kiválasztott SDK-hoz; az Android widget, az értesítések és a támogatott platformok működjenek a frissítés után.
  - Érintett: [package.json](package.json), [package-lock.json](package-lock.json), [app.json](app.json), [android](android).

- [ ] **17. Javítani a témák szöveg–háttér kontrasztját.**
  - Különválasztani a dekoratív hangsúlyszíneket az olvasható szövegszínektől. A korábbi mérés szerint a sötét kártyák fő szövegének kontrasztja 1,09:1, a világosaké 1,61:1.
  - Ellenőrzés: minden témában legalább 4,5:1 kontraszt normál szövegnél, illetve 3:1 nagy szövegnél, a ténylegesen használt háttereken.
  - Érintett: [colors.ts](constants/colors.ts), [settings.tsx](app/settings.tsx), [events.tsx](app/events.tsx).

- [ ] **18. Az értesítési felület tükrözze a valódi engedélyezettséget.**
  - Rendszerengedélyt explicit bekapcsoláskor kérni, ne a Settings puszta megnyitásakor. Elutasításkor a kapcsoló ne jelezzen aktív állapotot; a globális tiltás legyen érthetően jelezve.
  - Ellenőrzés: az engedély megtagadása és a globális kikapcsolás esetén se ígérjen aktív értesítést a felület.
  - Érintett: [NotificationsSwitch.tsx](app/components/settings/NotificationsSwitch.tsx), [YearlyNotifications.tsx](app/components/events/YearlyNotifications.tsx), [HundredDaysNotifications.tsx](app/components/events/HundredDaysNotifications.tsx), [EventForm.tsx](app/components/events/EventForm.tsx).

- [ ] **19. Javítani a nulla óra és perc kiválasztását.**
  - A falsy értékeket is felülíró `||` helyett nullish fallbacket használni, és a kiválasztót a tárolt idővel megnyitni.
  - Ellenőrzés: 09:30 → 10:00 és 09:30 → 00:00 helyesen mentődjön; újranyitáskor a tárolt idő jelenjen meg.
  - Érintett: [OffsetSelector.tsx](app/components/events/OffsetSelector.tsx).

- [ ] **20. Akadálymentessé tenni az interaktív vezérlőket.**
  - Értelmes képernyőolvasós címkéket, szerepeket és állapotokat adni az ikonokhoz, kapcsolókhoz, képvezérlőkhöz és témaválasztókhoz. A megjelenítési módok váltása is legyen egyértelműen bemondható.
  - Ellenőrzés: TalkBackkel és VoiceOverrel azonosítható legyen minden művelet és az aktuális kiválasztás.
  - Érintett: [SwitchInputField.tsx](app/components/settings/SwitchInputField.tsx), [index.tsx](app/index.tsx), [events.tsx](app/events.tsx), [themes.tsx](app/themes.tsx), [Event.tsx](app/components/home/Event.tsx).

## P3 – Felületi következetesség és könnyebb használat

- [ ] **21. A számláló azonnal kövesse a dátumszerkesztést.**
  - A számítás függőségei között szerepeljen az esemény dátuma is, vagy az érték közvetlenül a dátumból és az aktuális időből származzon.
  - Ellenőrzés: mentés után az új napkülönbség azonnal jelenjen meg, ne csak a következő perces frissítéskor.
  - Érintett: [Event.tsx](app/components/home/Event.tsx), [useCurrentTime.ts](hooks/useCurrentTime.ts).

- [ ] **22. A folyamatjelző százas napfordulókon is értelmes intervallumot mutasson.**
  - Meghatározni, hogy a 100., 200. stb. nap az előző intervallum végét vagy a következő kezdetét jelentse. Ennek megfelelően számolni a címkéket és a kitöltést.
  - Ellenőrzés: ne jelenjen meg üres sáv „100 → 100” értékkel; ellenőrizni a 99., 100. és 101. napot is.
  - Érintett: [ProgressBar.tsx](app/components/home/ProgressBar.tsx).

- [ ] **23. Az üresre törölt személyneveket következetesen kezelni.**
  - Eldönteni, hogy kötelezők-e a nevek. Opcionális névnél az üres érték is mentődjön vagy törölje a korábbit; kötelezőnél legyen érthető validáció.
  - Ellenőrzés: kiürítés és mentés után ne maradjon meg csendben a régi név.
  - Érintett: [settings.tsx](app/settings.tsx).

- [ ] **24. Közvetlen eseménykezelést és üres állapotot adni a főoldalhoz.**
  - Látható Események / Új esemény műveletet, valamint magyarázó üres állapotot kialakítani, amikor nincs megjelenített esemény.
  - Ellenőrzés: új felhasználó vagy minden esemény elrejtése/törlése után is egyértelmű legyen a következő lépés, a Settings megnyitása nélkül.
  - Érintett: [index.tsx](app/index.tsx), [EventsDisplay.tsx](app/components/home/EventsDisplay.tsx).

- [ ] **25. Láthatóvá tenni a megjelenítési módok váltását.**
  - Feliratozott kezelőszervet adni a napok / év-hónap-nap és az évforduló / 100 napos folyamatjelző váltásához.
  - Ellenőrzés: a felhasználó próbakattintás nélkül is értse a váltható módokat és az aktuális kiválasztást.
  - Érintett: [Event.tsx](app/components/home/Event.tsx), [ProgressBar.tsx](app/components/home/ProgressBar.tsx).
