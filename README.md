# Faktos-veebileht

Lihtne veebileht modulariseeritud JavaScript ja CSS-iga.

## Projekti struktuur

```
Faktos-veebileht/       #Siia kausta tulevad html failid,
├── tulemused.html      # Näide
├── index.html          # Pealeht
├── README.md           # See fail
├── css/
│   ├── main.css        # Peamised stiilid
│   └── components/     # Komponentide stiilid
├── images/             # Pildid ja ikoonid
└── js/
    ├── main.js         # Peamine JavaScript fail
    └── modules/
        ├── base.js     # Baas funktsioonid
        ├── footer.js   # Jaluse funktsioonid
        └── header.js   # Päise funktsioonid
```

## Kasutamine

1. **Otse brauseris:**
   - Ava `index.html` fail oma brauseris
   - Veendu, et kõik failid on samas kaustas
   - Või kasuta live Serverit



## Arendus

Projekti muutmiseks:
1. Muuda HTML-i `index.html` failis või tee uus HTML fail põhi kausta 
2. Lisa stiile `css/main.css` või `css/components/` kausta
3. Lisa JavaScript funktsioone `js/modules/` kausta
4. Impordi uued moodulid `js/main.js` failis
