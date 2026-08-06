# Spellroot Chronicles

Ein 2D-Jump-'n'-Run-Browserspiel in Vanilla JavaScript (objektorientiert, ohne
Framework), gebaut mit HTML5 Canvas. Man steuert einen Zauberer durch zwei
Level, weicht Gegnern aus oder besiegt sie durch Sprung, Trank-Wurf oder eine
zeitlich begrenzte Angriffsfähigkeit, sammelt Items ein und besiegt am Ende
jedes Levels einen Endboss.

## Starten

Das Spiel braucht keinen Build-Schritt. `index.html` im Browser öffnen (idealerweise
über einen lokalen Server statt `file://`, damit die relativen Asset-Pfade und
Skript-Tags zuverlässig laden), z. B.:

```
npx serve .
```

oder mit der VS-Code-Erweiterung "Live Server".

## Steuerung

| Taste | Aktion |
|---|---|
| ◄ / ► (Pfeiltasten) | Laufen |
| ▲ (Pfeiltaste hoch) | Springen |
| D | Trank werfen, oder Angriff (wenn die Angriffsfähigkeit aktiv ist) |
| H | Debug: zeigt die tatsächlichen (offset-bereinigten) Hitboxen aller Objekte als rotes Rechteck an |

Auf echten Touch-Geräten (erkannt über `hover: none` + `pointer: coarse` bzw.
`navigator.maxTouchPoints`, nicht mehr über eine feste Bildschirmbreite) werden
stattdessen Touch-Buttons eingeblendet (links/rechts/springen/werfen); der
Fullscreen-Button wird auf Mobile ausgeblendet, da er dort nicht sinnvoll
nutzbar ist.

Oben rechts neben dem Home-Button gibt es außerdem einen Pause-Button: er
friert Character, Gegner, Physik und Kollisionsprüfungen komplett ein, was das
Anpassen der Hitboxen mit dem H-Overlay deutlich einfacher macht, da sich
währenddessen nichts mehr bewegt.

## Spielablauf

- **Startbildschirm**: Play-Button sowie eine Auswahl von zwei Zauberer-Charakteren
  (Wizard 1 / Wizard 2), die durch Anklicken ausgewählt werden (visuelles Glow-Feedback).
- **Sammelobjekte**: Kristalle (Punktestand), Tränke (Wurfmunition), Schriftrollen
  (heilen 25 Energie) und ein Attack-Book (schaltet für 10 Sekunden die Nahkampf-
  Angriffsfähigkeit frei, die die Trankwurf-Taste ersetzt).
- **Gegner**: Werden entweder von oben gestampft (Stomp), durch einen geworfenen
  Trank oder durch den Nahkampf-Angriff besiegt.
- **Level 1 → Level 2**: Nach dem jeweiligen Endboss erscheint ein Level-Complete-
  Schild; bei Level 2 (letztes Level) erscheint stattdessen "THE END" mit einem
  Replay-Button, der zurück zum Startbildschirm führt.
- **Game Over**: Bei 0 Energie erscheint der Game-Over-Screen mit Replay-Button
  (führt ebenfalls zurück zum Startbildschirm, kein Reload nötig).
- **Sound**: Lautstärke-Button oben rechts, Mute-Zustand wird über `localStorage`
  geräteweit gemerkt.
- **Fullscreen & Home**: Buttons oben rechts (Fullscreen nur auf Desktop sichtbar).

## Architektur

Objektorientiert mit einer klassischen Vererbungshierarchie für alles, was auf
dem Canvas gezeichnet wird:

```
DrawableObject
└── MovableObject
    ├── Character                     (spielbarer Zauberer)
    ├── Enemie / Endboss               (Level 1 Gegner)
    ├── EnemieLevel2 / OrkEnemieLevel2 / EndbossLevel2   (Level 2 Gegner, eigene Sprungphysik)
    ├── ThrowableObject                (geworfener Trank)
    ├── CollectableObject / PotionBottleObject / ScrollObject / AttackBookObject
    └── CloudObject / BackgroundObject
```

Koordination und Spiellogik liegen außerhalb der Objekthierarchie in eigenen Klassen:

- **`World`** (`classes/world.class.js`) — hält Canvas, Character, aktuelles
  Level und HUD-Elemente; steuert den Render-Loop (`draw()`) und die
  Game-Over-/Level-Complete-Overlays. Delegiert Sound und Kollisionen an:
  - **`SoundManager`** (`classes/sound-manager.class.js`) — besitzt alle
    Audio-Objekte (Soundeffekte + Hintergrundmusik), kapselt Abspielen und
    globales Muten/Unmuten.
  - **`CollisionManager`** (`classes/collision-manager.class.js`) — prüft
    jeden Tick Character-gegen-Gegner (Stomp vs. Schaden), Character-gegen-
    Sammelobjekt, Angriffsradius und Trank-Treffer.
- **`Level`** (`classes/level.class.js`) — reiner Datencontainer für die
  Objekte eines Levels (Gegner, Hintergründe, Sammelobjekte, ...), befüllt in
  `js/levels/level1.js` und `js/levels/level2.js`.
- **`Keyboard`** (`classes/keyboard.class.js`) — hält den aktuellen
  Tastendruckzustand, wird von `js/game.js` über `keydown`/`keyup` befüllt
  und von `Character` gelesen.
- **`js/game.js`** — Einstiegspunkt: Startbildschirm, Charakterauswahl,
  Level-/Restart-Übergänge (`goToNextLevel()`, `restartGame()`,
  `goToHomescreen()`), Event-Listener-Setup.

Jede Funktion/Methode im Code ist mit JSDoc dokumentiert (`/** ... */` mit
`@param`/`@returns`).

## Bekannte Design-Entscheidungen

- `EnemieLevel2` und `EndbossLevel2` erben direkt von `MovableObject` (nicht
  von `Enemie`/`Endboss`), da deren Sprungphysik unabhängig von der
  Character-fixierten `applyGravity()`/`isAboveGround()`-Logik läuft. Beide
  nutzen stattdessen `MovableObject.landOnGround(groundY)` als gemeinsame
  Landungs-Logik.
- Level-2-Gegner werden über `shuffleArray()` + `placeEnemiesWithSpacing()`
  deterministisch mit garantiertem Mindestabstand platziert (basierend auf der
  tatsächlichen Breite jedes Gegnertyps), damit unterschiedlich breite Gegner
  (z. B. die Orks) sich nie überlappen.
