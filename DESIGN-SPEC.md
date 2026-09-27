# DESIGN-SPEC — shapeofintelligence.com (home / exhibition page)

Reverse-engineered from the live site with Playwright CLI (Chromium), 26 September 2026.
Reference viewport **1440 × 900** unless stated otherwise. Mobile checked at **390 × 844**.
All px values below were measured at 1440 × 900 (computed styles and bounding boxes). Where the source uses relative units, the unit is given first and the resolved px value follows in brackets.
Reference screenshots are in `soi/shots/`: `d*.png` are full-viewport steps every 900px, `f_*.png` are frames inside pinned sequences, `m_*.png` are mobile, and `h_*` / `dialog*` capture hover and menu states.

This document describes the design as it is. It does not interpret or improve it.

---

## 0. Global system

### 0.1 Tech signals that affect the visuals
- Next.js with CSS Modules (class names like `Exhibition-module__…`).
- **Lenis smooth scroll** (`html.lenis`): scrolling is eased and inertial, not native.
- `html` carries state attributes: `data-active-chapter`, `data-header-mode` (`paper | carbon | blue`), `data-footer-mode` (`paper | carbon | blue`).
- An exhibition-wide switch, `data-exhibition-motion="true|false"`, is set by the "Motion on/off" toggle. When motion is off, every transition and animation is forced to `none` and the pinned scroll lengths collapse.
- Full `prefers-reduced-motion: reduce` fallbacks (all transitions set to none, `[data-reveal]` shown immediately).

### 0.2 Color tokens (`:root`)
| Token | Hex | Role |
|---|---|---|
| `--white` | `#F2F4F1` | "Paper": the page background. A warm, slightly green off-white, never pure #FFF |
| `--carbon` | `#202623` | Primary text on paper, dark borders |
| `--night` | `#090E13` | Dark stages, site footer, dark chrome |
| `--ink-2` | `#5A625E` | Secondary text on paper (labels, years, notes) |
| `--silver` | `#B8C4C5` | Secondary text on night (captions, hints) |
| `--blue` | `#234AE8` | The only accent: highlights, progress hair, active states, blue stages, data plate |
| `--coral` / `--coral-ink` | `#C44D40` / `#A83A2E` | Error text. Defined but not seen on the home page |
| `--green` | `#406B5B` | Defined but not seen on the home page |
| `--hair-on-white` | `#20262329` (carbon at 16%) | 1px rules on paper |
| `--hair-on-carbon` | `#F2F4F129` (white at 16%) | 1px rules on night or blue |

Mode aliases, via `[data-mode]`:
- `paper`: bg white, fg carbon, fg-2 ink-2, hair on-white, accent blue.
- `carbon`: bg carbon, fg white, fg-2 silver, hair on-carbon.
- `blue`: bg blue, fg white, fg-2 white.

The page uses exactly **three surface colors**: paper `#F2F4F1`, night `#090E13` and blue `#234AE8`. Photographic or 3D art only ever sits on night.

### 0.3 Typography
- **Sans:** `ABC Diatype`, weights **400**, **400 italic** and **500**. Fallback: -apple-system, Helvetica Neue, Arial.
- **Mono:** `ABC Diatype Mono` 400, used for indices, years, counters and footer `dt` labels.
- Nearly everything is set in **400**. **500** appears only in the wordmark, the scale stencil word "scale." and small `.label` titles.
- Large display type always has **negative tracking in em** and **line-height under 1**.

**Type scale, largest first (1440 wide):**

| Role | Size rule | px @1440×900 | line-height | tracking | weight |
|---|---|---|---|---|---|
| Scale stencil "scale." | `31vw` | 446 | 0.9 | −0.075em | 500 |
| "bank" (context field) | canvas/DOM, ~29.5vw | 425 | 0.85 | −0.065em | 400 |
| Interface "You." | ~22vw | 317 | 1 | −0.075em | 400 |
| Promise "promise." | `20.5vw` | 295 | 1 | −0.065em (resolves to −1.85px on parent) | 400 |
| Hero "Intelligence" | `min(18.4vw, 28svh)` | 252 | 0.84 | −0.07em (−2.66px) | 400 |
| Hero "The Shape" | `min(15.1vw, 23svh)` | 207 | 0.84 | −0.07em | 400 |
| Interface "A new / way in." | `clamp(110px, 14vw, 220px)` | 202 | 0.82 | −0.065em | 400 |
| Ending "Keep / questioning." | `13vw` | 187 | 0.83 | −0.065em | 400 |
| Chapters-menu numeral "03" | ~12vw | 173 | 1 | −0.065em | 400 |
| Lab h2 "The rules." / "The examples." | `8.8vw` | 127 (rules) / 107 (examples, auto-fit) | 0.9 | −0.065em | 400 |
| Prologue lines | `clamp(40px, 6.8vw, 115px)` | 98 | 1.03 | −0.055em | 400 |
| Hero "of" (superscript) | 0.38em of "The Shape" | 79 | 0.84 | −0.055em | 400 |
| Promise "The" | `clamp(42px, 5.5vw, 90px)` | 79 | 1 | −0.065em | 400 |
| Rules result counter "—" / "0" | 72px | 72 | 1 | −0.045em | 400 |
| Context h2 "The context." | `clamp(32px, 4.3vw, 70px)` | 62 | 0.92 | −0.045em | 400 |
| Choices h3 "Who chooses what intelligence is for?" | ~4.2vw | 60.5 | 1.02 | −0.045em | 400 |
| Choices "The next shape." | ~4.2vw | 60.5 | 0.98 | −0.055em | 400 |
| Rail menu chapter names | `clamp(28px, 3.7vw, 64px)` | 53 | 1 | −0.045em | 400 |
| Context sentence words | `clamp(24px, 3.6vw, 52px)` | 52 | 1.15 | −0.04em | 400 |
| "Choose a shape." (rules disc) | 3.6vw | 52 | 1.1 | −0.05em | 400 |
| Anamorph lead "Can a machine" | `clamp(27px, 3.5vw, 54px)` | 50 | 1.55 | −0.035em | 400 |
| Chapter thesis (`.understands`) | `clamp(27px, 3vw, 44px)` | 43 | 1.16 | −0.035em | 400 |
| Choices tabs "Purpose / Evidence / Consequences" | 3vw | 43 | 1.55 | −0.035em | 400 |
| Anamorph question / Interface question | `clamp(22px, 2.2vw, 36px)` | 32 | 1.2 | −0.025em | 400 |
| Scale question | 30px | 30 | 1.2 | 0 | 400 |
| Chapter question (promise, lab) | 23–25px | 23–25 | 1.28–1.35 | 0 | 400 |
| Ending link titles | 23px | 23 | 1.25 | 0 | 400 |
| Context tabs | 22px | 22 | 1.55 | 0 | 400 |
| Context question | 21px | 21 | 1.3 | 0 | 400 |
| Interface "Open the interface" | 20px | 20 | 1.55 | 0 | 400 |
| **Chapter body (`.chapterMain`)** | 19px | 19 | **1.6** (30.4px) | 0 | 400 |
| Rules readout / context explanation | 18–19px | 18–19 | 1.4–1.5 | 0 | 400 |
| Route links (choices) | 16px | 16 | 1.55 | 0 | 400 |
| Wordmark | 15px | 15 | 1.55 | −0.01em | 500 |
| Begin CTA, footer copy | 15px | 15 | 1.5 | 0 | 400 |
| Read-door, event title, listen, prologue note, opening-bottom copy | 14px | 14 | 1.45–1.6 | 0 | 400 |
| Nav links, prologue side, archive heading, scale side note | 13px | 13 | 1.4–1.55 | 0 | 400 |
| Chapter index "01 — The question" | 13px **mono** | 13 | 1.55 | 0 | 400 |
| Chapter meta row, opening note, Chapters toggle | 12px | 12 | 1.35–1.55 | 0 | 400 |
| Footer `dt` labels | 12px **mono uppercase** | 12 | 1.55 | 0.1em | 400 |
| Scene caption, archive "Selected moments", toggles, specimen labels | 11px | 11 | 1.45–1.55 | 0 | 400 |
| Event year | 11px **mono** | 11 | 1.6 | 0 | 400 |
| Credits, pose thought, "Three paths…" | 10px | 10 | 1.55 | 0 | 400 |
| Foot-bar counter "01 / 08" | 10px **mono**, tabular-nums | 10 | 1.55 | 0 | 400 |
| Pose-button numerals | 9px **mono** | 9 | — | 0 | 400 |

Hierarchy principle: the scale jumps from about 19px body straight to 43px+ display type. There is almost no mid-size (24–36px) text except the "question" lines. Micro text (9–13px) carries all the metadata.

### 0.4 Layout, grid and container
- **No max-width container.** Everything is full-bleed. Horizontal insets are percentages of viewport width, and there are three of them:
  - **4.5 %** (65px): header, foot bar, opening, dark scene stages, chapter meta rows, promise, scale, interface.
  - **6 %** (86px): lab stages (ch. 2 and 4), context (ch. 6), choices (ch. 8), ending, site footer (`--margin: 6vw`).
  - **8 %** (115px): the reading rooms (the text part of every chapter).
- Instead of a 12-column grid, layouts are **percentage column pairs**:
  - Prologue: `28% | 72%`.
  - Lab stage: `31% | 62%`, gap 7%. Resolves to 391px | 786px, starting at x=86 and x=568.
  - Reading room: `33% | 54%`, gap 13%. Resolves to 399px | 653px, starting at x=115 and x=672.
  - Context tabs and ending cards: `repeat(3, 30%)`, gap 5%.
  - Chapters dialog: `31% | 62%`, gap 7%.
  - Site footer: `1.2fr | 2fr`, with an inner 4-column grid.
- Only one component has an explicit container width: the Chapters dialog (`max-width: 1600px`, `max-height: 1100px`).
- `--measure: 64ch` is defined. In practice the body column is the 54% track (653px ≈ 70 characters at 19px).
- Screen-height rules: stages use `100svh` or `110–115svh` with `min-height` floors (640–1020px). There are tweaks for `(min-width:760px) and (max-height:1000 / 850 / 800px)`. The hero title shrinks by svh on short screens.
- Wide screens: `@media (min-width:1800px)` caps the opening at max-height 1200px and sets the hero at 272px / 274px.

### 0.5 Spacing system
There is no strict 4pt or 8pt scale. The values cluster like this:
- **Micro:** 2, 5, 6, 7, 8, 10, 12 px (label-to-control, icon gaps).
- **Component:** 16, 20, 24, 25, 26, 28 px (list row padding 15–24px, nav gap 28px, toggle gap 24–26px, row gaps).
- **Block:** 35, 36, 40, 45, 50, 52, 60, 70, 80 px. For example, chapter index to thesis is 45px, thesis to read-door is 35px, body to archive is 60px, "Keep questioning." to cards is 80px.
- **Section padding (top):** 150–205px. This always clears the 84px header plus a meta row sitting at 115–135px. Stage top padding is 170 / 176 / 180 / 185 / 195 / 205px.
- **Section padding (bottom):** 75–130px. Reading room is 120px top and bottom; after a lab it is 40px top.
- **Absolute anchors on full-height stages:** meta row `top: 115px`, captions `bottom: 35px`, questions `bottom: 100–155px`, CTA `bottom: 90–100px`.

### 0.6 Radii
Everything is square (0) except:
- `50%` circles: begin-arrow button (76px), interface seam (70px), drag hint "Drag to reshape" (88px, blue), dialog close button (44px), slider thumbs, the rules "Choose a shape." disc, and rule-number bubbles.
- `4px`: specimen tiles, in the non-immersive variant.
- `3px`: chips.
- `2px`: focus outline.
- The dialog, images, video, buttons and the data plate all have **0 radius**.

### 0.7 Lines and borders
- Hairlines are 1px `--hair-on-white` or `--hair-on-carbon`.
- Dark 1px carbon underline on the "Read this chapter" door.
- Active tabs use a **3px bottom border** in white (context and choices tabs).
- The active word in the context sentence gets a 1px white underline.
- Full-width 1px top border on the prologue and lab sections.

### 0.8 Motion tokens
- `--ease-out-3: cubic-bezier(.22, 1, .36, 1)`: the main "settle" curve.
- `--ease-out-2: cubic-bezier(.25, 1, .5, 1)`.
- `--dur-reveal: .7s`, `--dur-settle: .9s`.
- Micro transitions run .15–.35s, object transitions .6–.85s, media crossfades .5–1.5s.

---

## 1. Persistent chrome

### 1.1 Header (fixed)
- `position: fixed; top: 0; height: 84px; z-index: 40`. Padding-inline 4.5% (65px). Flex, space-between, align center.
- **Left:** wordmark = SVG glyph (three thin strokes, like a "tally", about 22 × 30px) plus "The Shape of Intelligence" at 15px/500. The text baseline sits lower than the glyph (glyph top ≈ y24, text ≈ y50).
- **Right:** nav "Read · Timeline · Sources · About" at 13px/400, gap 28px, right edge at x=1375.
- **Background is a gradient, never solid.** It changes with `html[data-header-mode]`:
  - `paper`: `linear-gradient(180deg, white 20%, white/95% 70%, transparent)`. Text is carbon.
  - `carbon`: `linear-gradient(rgba(9,14,19,.91), transparent)`. Text is white.
  - `blue`: `linear-gradient(180deg, blue, transparent)`. Text is white.
- Effect: page content **fades out as it slides under the header** (see `d06`, `d10`, `d16`). The mode flips when a section of a different surface reaches the header zone. There is no hide-on-scroll: the header is always visible.

### 1.2 Progress hair
- `position: fixed; top: 0; left: 0; height: 2px; background: blue; z-index: 45`. Width is a percentage (`transition: width .12s linear`).
- It stays at 0% through the opening and prologue, then grows linearly across the eight chapters (≈27% at ch. 3, ≈52% at ch. 5, ≈77% at ch. 7, ≈89% at ch. 8).

### 1.3 Foot bar (fixed "exhibition chrome")
- `position: fixed; bottom: 0; height: 48px; z-index: 44`, padding 0 4.5%, border-top 1px hair.
- **Left group** (gap 24px): an index icon made of 8 vertical 1px bars (8px tall, with the active chapter's bar 20px tall), "Chapters" at 12px, and "01 / 08" at 10px mono ink-2.
- **Right group** (gap 26px): "Sound off" (with a small waveform icon of 3 bars; when on, it pulses with `scaleY(.35)`, 1.1s alternate, staggered) and "Motion on" at 11px.
- The background swaps independently of the header via `html[data-footer-mode]`: paper uses white with carbon text; carbon uses night with white text and a silver counter; blue uses blue with white text.
- In practice the header and footer can show different modes at the same moment, because each reflects what is underneath it.
- Not visible over the site footer at the end of the page.
- Hovering "Chapters" makes all 8 index bars grow to 20px (.35s).

### 1.4 Chapters dialog (opened from the foot bar)
- Native `<dialog>` with an inset of 12px on every side (1416 × 876 at 1440×900), paper background, radius 0, padding 30px 4%.
- Backdrop: `rgba(9,14,19,.93)` plus `backdrop-filter: blur(10px)`.
- **Top row:** "Explore the exhibition" at 14px on the left. On the right, "Close" at 13px plus a 44px circle containing "×" at 27px, with a hairline border.
- **Body:** grid `31% | 62%`, gap 7%.
  - **Left:** a preview panel (night, min-height 460px, full column height). A portrait image (1080×1440, 3:4, `object-fit: cover`) for the hovered or current chapter, with a gradient overlay to night at the bottom. A giant numeral ("03", about 12vw, −0.065em) sits bottom-left at 10%, with the credit "An imagined installation" at 10px below it.
  - **Right:** a rail of 8 rows. Each row has a 1px top hairline and grid `38px | 1fr | 30px`. Contents: mono index at 10px ink-2, the chapter name at clamp(28px, 3.7vw, 64px) (about 53px, −0.045em), and "↗" at 25px. Row padding is 21px vertical.
- **Hover or current row:** the whole row turns blue and the arrow moves `translate(4px, -4px)` (.4s). The preview image crossfades (opacity .6s) and settles from `scale(1.06)` to `scale(1)` (1s, ease-out-3).

---

## 2. Section order and page map (1440 × 900, total scroll height ≈ 22,625px)

| # | Section | y-start | Height | Surface | Pinned |
|---|---|---|---|---|---|
| 1 | Opening / hero | 0 | 900 (100svh) | paper | – |
| 2 | Prologue ("Introduction") | 900 | 2070 (≈2.3 vh) | paper | inner frame sticky, 900px |
| 3 | Ch. 01 The question: anamorph stage, then reading room | 2970 | 1780 | night → paper | – |
| 4 | Ch. 02 The rules: lab stage, then reading room | 4750 | 2078 | paper | left intro sticky at top 135px |
| 5 | Ch. 03 The promise: rupture stage, then reading room | 6828 | 2949 | night (video) → paper | stage sticky, scroll-scrubbed |
| 6 | Ch. 04 The examples: learning lab, then reading room | 9776 | 2336 | paper | left intro sticky at top 135px |
| 7 | Ch. 05 The scale: scale journey (220svh), then reading room | 12112 | 2860 | night (video) → paper | frame sticky, scroll-scrubbed |
| 8 | Ch. 06 The context: blue stage, then reading room | 14972 | 2092 | blue → paper | – |
| 9 | Ch. 07 The interface: threshold stage, then reading room | 17065 | 2738 | night (video) → paper | stage sticky, scroll-scrubbed |
| 10 | Ch. 08 The choices: fork stage, reading room, then ending | 19803 | 2554 | night → paper → blue | – |
| 11 | Site footer | 22357 | ~268 plus 100 bottom padding | night | – |

**Rhythm:** every chapter is a **"stage" followed by a "reading room"**. The stage is immersive, with display type, art or an interactive instrument. The reading room is always the same paper two-column essay layout. Surfaces alternate paper → night → paper → paper → night → paper → paper → night → paper → blue → paper → night → paper → night → paper → blue → night.

---

## 3. Sections in detail

### 3.1 Opening / hero (`.opening`)
**Box:** 1440 × 900 (100svh, min-height 820, or 640 on screens ≤1000px tall). Paper background, `overflow: hidden`, `isolation: isolate`.

**Composition, all absolutely positioned layers:**
1. **Opening note row**: `top: ~99–112px; left/right: 4.5%`, flex space-between, 12px / lh 1.35.
   - Left: "An evolving history / of artificial intelligence." (2 lines).
   - Right, right-aligned: "1936 — now / And what comes after."
   - Occupies y≈100–130.
2. **"The Shape" + superscript "of"** (`.titleFirst`, z-index 1): top 19% (≈171px), left 4% (≈58px). 207px, lh .84, −0.07em, nowrap. The "of" is an inline-block at 0.38em (79px), `vertical-align: top`, with padding-top .16em and margin-left .12em. It floats top-right of "Shape", its top aligned with the cap height. Block spans x≈58→1140, y≈180→375.
3. **Sculpture canvas** (`.continuum`, z-index 2): inset `13% 5% 19%` (y≈117→729, x≈72→1368). WebGL/canvas render of a **silver, finely striated, ribbed saddle surface** with a thin blue band across it. It sits visually **between** the two title lines and overlaps both: its peaks cross "Shape" and it dips behind "Intelligence". A still image (`pose-1.webp`, 1800×1400, `contain`) shows first, then crossfades to the canvas (opacity .7s) once ready. Cursor is `grab` / `grabbing`, and the sculpture can be dragged.
4. **"Intelligence"** (`.titleLast`, z-index 3, **above** the sculpture): bottom 33%, left 3.9% (≈56px). 252px, lh .84. Spans x≈65→1315 (almost full width), baseline ≈ y585, descender "g" to ≈ y640.
5. **Opening bottom row** (`.openingBottom`): `bottom: 90px; left/right: 4.5%`, flex space-between, align center. Three items:
   - **Left:** 14px / lh 1.45. "Every generation imagines / intelligence in its own image." in carbon, then "This is how the shape changed." in ink-2. Occupies y≈750–810.
   - **Center, x≈605–993 (≈390px wide):** the sculpture control.
     - Label row: "Change the shape of an idea" at 13px ink-2, with "↔" at the right edge.
     - Three pose buttons spaced across the width: "01 Rules", "02 Learning", "03 Context". Each has a 9px mono numeral plus a 12px label. Inactive is ink-2, active is blue.
     - A blue range slider (1px track, round blue thumb about 12px).
     - Caption "A structure changed by experience." at 10px ink-2.
   - **Right:** "Begin the story" at 15px plus a **76px circle** (1px carbon border) holding "↘" at 34px. Gap 24px. The circle's right edge is at x=1375.

**Hierarchy:** (1) the two-line title at 207–252px, the dominant mass filling about 60% of viewport height; (2) the sculpture woven through it; (3) the tiny 12–15px corner annotations, which frame the four corners like museum wall text.

**Interactions:**
- Hovering the sculpture reveals a **blue 88px circle "Drag to reshape"** (12px white text) that follows the cursor. It animates opacity 0 → 1 and scale .7 → 1 over .3s, and hides while dragging.
- Pose buttons and the slider morph the sculpture (Rules / Learning / Context). The pressed button turns blue (.3s color).
- Hovering "Begin the story" turns the circle solid carbon with a white arrow and **rotates it 45°**, so ↘ becomes ↓. Timing: background/color .35s, transform .6s ease-out-3.

### 3.2 Prologue (`.prologue`, "Introduction")
**Box:** 1440 × 2070. A 1px hair border-top. The inner `.prologueFrame` is **sticky at top 0** with height 900, so the frame stays pinned for about 1170px of scroll.

**Frame composition:** grid `28% | 72%`, padding 150px 4.5% 130px.
- **Left column** (x=65): "An exhibition / by Jamie McKaye" at 13px / 1.4, top-aligned at y≈312. That is level with the top of the headline.
- **Right column** (x≈432, width ≈ 943px): **headline window** `.prologueCopy` at clamp(40px, 6.8vw, 115px) (98px), lh 1.03, −0.055em. It holds three two-line statements:
  1. "First, we tried to / **write the rules.**"
  2. "Then, we let the / **examples speak.**"
  3. "And the question / **changed shape.**"

  The first line of each is carbon and the second line is **blue**. The window shows one statement at a time (y≈315→500).
- **Below**, at margin-top 28px (y≈585): "Eight chapters in the history of an idea. / Enter at the beginning. Follow what changes." at 14px ink-2.
- **Bottom-right:** "↓" at 48px, absolutely positioned at `bottom: 100px; right: 6%` (x≈1321, y≈745).
- The top ≈270px of the frame is empty paper beneath the header.

**Scroll interaction (scrubbed, pinned):** as you scroll, the statements **roll vertically like a drum or cylinder**.
- The outgoing line tilts away, rotating on the X axis so it appears vertically squashed, and fades to light blue or grey at about 35% opacity.
- The incoming line rises from below the window's clip edge, which is sharply cropped at the bottom (see `f_pro_1200.png`, `d02_1800.png`).
- Mid-transition you see a ghost of the previous line above, the current line in grey, and the top half of the next line clipped.
- The final state is "And the question / changed shape." After that the frame unpins and scrolls away. The dark Ch. 1 stage rises below with a hard horizontal edge (`f_pro_2400.png`).

### 3.3 Chapter 01, "The question" (1936 — 1956)

#### Stage: anamorph (`.anamorphStage`)
**Box:** 1440 × 900 (100svh, min-height 800), night, `overflow: hidden`.
- **Chapter meta row** (shared by all stages): absolute `top: 115px; left/right: 4.5%`, 12px, flex space-between.
  - Left: "01 / 08" plus, 35px to the right, "The question".
  - Right: "1936 — 1956".
  - White text; the "The question" label is silver-tinted.
- **Lead:** "Can a machine" at clamp(27px, 3.5vw, 54px) (50px), −0.035em, white, absolute `top: 185px; left: 6%` (x≈86, y≈470 in page frame).
- **Object:** the word **"THINK?"** as a large anamorphic sculpture. It is a static image (`aligned.webp`, 1800×1000, `contain`, rendered at 1440×620) made of vertical metal slats with a silver gradient. It is centered and occupies x≈265→1175, y≈625→825 of the stage. Dragging or the slider changes the viewpoint, and the word breaks apart when the viewpoint is off-axis.
- **Top-center hint:** "Drag to change your point of view ↔" at 11px silver (x≈616, near the top of the stage).
- **Bottom-left:** "Same object. / A different reading." at clamp(22px, 2.2vw, 36px) (32px), −0.025em, lh 1.2, `bottom: 108px; left: 6%`. Below it, "An anamorphic sculpture. An open question." at 10px silver, `bottom: 76px`.
- **Bottom-right panel** (x≈778–1354, ≈576px wide):
  - "A question of perspective" at 11px silver, with "0°" at the right.
  - A 1px white range track with a white round thumb.
  - Below it: "Resolve the word" (pressed, white, 13px) on the left and "Change perspective ↗" on the right.

#### Reading room (`.readingRoom`), the template shared by every chapter
**Box:** paper, grid `33% | 54%`, gap 13%, padding 120px 8%.
- **Left column** (x=115, w=399):
  1. Index "01 — The question" at 13px **mono** ink-2, margin-bottom 45px.
  2. Thesis (`.understands`) at clamp(27px, 3vw, 44px) (43px), lh 1.16, −0.035em, carbon. Typically 4 lines (≈200px tall), margin-bottom 35px.
  3. "Read this chapter ↗" door: 14px, flex space-between, padding 16px 0, **1px carbon bottom border** spanning the full 399px, arrow at the far right.
  4. Divider hairline, then "▷ Listen to this chapter" at 14px (▷ at 19px, margin-right 10px), then the meta line "Narration, synthesised from Jamie McKaye's voice · 0:58 · the chapter text above is the transcript" at 11px ink-2 (max 40ch).
- **Right column** (x=672, w=653):
  1. **Body paragraph:** a single block at 19px / 1.6, carbon, about 11–12 lines.
  2. **"Inside the archive"** block, margin-top 60px:
     - Header row: "Inside the archive" at 13px on the left, "Selected moments" at 11px ink-2 on the right, margin-bottom 20px.
     - Rows, each with a 1px hair top border and grid `15% | 85%` (≈98px | 555px), padding 15px 0 (row height ≈58px). Contents: year at 11px mono ink-2, title at 14px carbon, and "↗" at 17px pinned right.
- Section ends with about 120px of empty paper, followed by a 1px hair top border on the next section.
- Top-of-viewport fade: body text dims to transparent as it passes under the header gradient.

### 3.4 Chapter 02, "The rules" (1956 — 1974)

#### Lab stage (`.labStage`)
**Box:** paper, min-height 880, 1px hair top border, grid `31% | 62%`, gap 7%, padding 180px 6% 85px. Chapter meta row at `top: 115px; left/right: 6%` (carbon text).
- **Left, `.labIntro` (sticky, top 135px):** stays pinned while the instrument column scrolls past.
  - h2 "The / rules." at 8.8vw (127px), lh .9, −0.065em, each word on its own block line. Occupies x=86→430, y≈440→650.
  - Question "How far could explicitly / programmed reasoning take us?" at 23px / 1.35, max 23ch, margin-top 45px.
  - Invitation row: "An idea you can put to / the test" at 12px ink-2 (max 25ch) plus "↗" at 36px carbon, gap 24px, margin-top 60px.
- **Right, instrument "Try the rules"** (x=568, w=786):
  - Header row: "Try the rules" (12px/500 ink-2) on the left, "6 rules · 7 junctions" (12px ink-2) on the right, then a 1px hairline.
  - **Specimen row:** 8 equal tiles (≈91px each, gap 8px). Each has a 32px outline SVG shape (square, circle, triangle, ring, star, crescent, rounded square, blob), a 11px label beneath, and a 1px hairline under each tile. It is 4 columns on mobile.
  - **Rule tree:** on the left, a thin-outlined **circle about 180px across** holding "Choose / a shape." (52px, −0.05em) and a small subline. A 1px horizontal line connects it to a vertical list of 6 rules. Each rule has a numbered 20px outline bubble joined by a 1px vertical line, with text at 14px ink-2 and line-height 19.6px.
  - **Readout:** a 1px **carbon** top rule (heavier than the hairlines), then "Pick a specimen to run it through the rules." at 19px, then a hairline.
  - "Add a rule" (12px ink-2) and "Reset" (12px, underlined with a 1px border).
  - Three addable rules, each a full-width row with a hairline beneath. A **blue "+"** prefixes 14px text.
  - Footnote at 11px ink-2: "An educational illustration…"
- Then the reading room (padding-top reduced to **40px** after a lab).

### 3.5 Chapter 03, "The promise" (1973 — 1993)

#### Rupture stage (`.rupture`)
- **Container:** the section holds a `.sceneStage` that is **sticky at top 0** (900px) inside a taller track. A CSS variable `--promise-progress` scrubs 0 → 1 over about 1,200px of scroll (y 6828 → ≈8000). The stage then unpins.
- **Art:** full-bleed video (`scene-3.mp4`, 1920×1080, 16:9) over a poster (`scene-3.webp`, 2400×1357). `object-fit: cover`, `scale(1.025)` with camera-offset variables, and a 1.5s opacity crossfade from still to video. The scene is a dark concrete gallery with a diagonal skylight beam and floating metallic ribbons, weighted to the right half.
- **Overlay:** `linear-gradient(transparent 15%, night 95%)` plus `linear-gradient(90deg, night 50%, transparent)`, so the left and bottom are darkened for type.
- **Chapter meta row:** top 115px, 4.5% insets.
- **Title** (`.fractureTitle`): absolute `top: 30%; left/right: 4.5%`.
  - "The" at clamp(42px, 5.5vw, 90px) (79px), margin-bottom 5px.
  - "promise." at **20.5vw (295px)**, lh 1, height 1.08em, nowrap. It spans x≈80→1160, baseline ≈ y610, and runs across the image.
- **Question:** "Why did expectations repeatedly / outrun results?" at 25px / 1.28, max 25ch, absolute `bottom: 15%; left: 61%` (x≈878).
- **Bottom-left:** state line "A promise takes shape." (15px white), then "The work continues." (10px silver). The line swaps to "A promise meets its limits." as progress rises.
- **Bottom-center:** progress track, ≈185px wide at x≈641–825, y≈818. A 1px silver line with a white fill growing left to right as `--promise-progress` increases.
- **Bottom-right:** "An imagined installation" (10–11px silver). Scene caption row at `bottom: 35px`.
- **Scroll effect (fracture):** "promise." is duplicated into about 7 absolutely stacked `.fractureSlices`, each a horizontal band of the word. As progress increases, the slices **shear horizontally and vertically out of register**, so the word splits into offset strips (`f_rup_7628.png`, `d09`). At progress 1 the word is visibly shattered, the title lifts upward, and the stage scrolls off.
- Then the reading room. The archive has 4 rows.

### 3.6 Chapter 04, "The examples" (1986 — 2011)

#### Learning lab (`.labStage.learningStage`)
Same frame as ch. 2: grid `31% | 62%`, sticky intro at top 135px.
- **Left:** h2 "The / examples." (107px, auto-fitted so "examples." fits 391px), the question "What changed when / machines learned from data?" (23px), and the invitation row.
- **Right, instrument "Teach the machine":**
  - Header: "Teach the machine" (13px/500) and "0 steps · training —" (13px ink-2), then a hairline.
  - Two rows of **text tabs**, each 14px with a 1px underline: "Two blobs · Four quadrants · A ring" and "A · a straight wire · B · a wire that bends". Selected tabs are blue text with a blue underline; the rest are carbon with a hair underline.
  - Action row: a **solid blue rectangular button** "Run 50 steps →" (white 15px, ≈151 × 56px, **radius 0**), then text buttons "Add the held-out set" and "Reset" at 12px.
  - **Data plate:** a solid blue square (≈680 × 680px, 1:1) with a faint lighter-blue grid (about 10 × 10) and white dots. Filled dots are group A and ring dots are group B. It shows the decision "wire" after training.
  - Legend row at 11px: "● Group A ○ Group B ◌ Incorrect".
  - Hairline, then a stats pair in two columns: "Training accuracy" and "Training steps" labels at 12px ink-2, values at **72px** ("—", "0").
  - Hairline, then status at 15px, then a footnote at 11px ink-2.
- Then the reading room. The archive has 3 rows.

### 3.7 Chapter 05, "The scale" (2012 — 2016)

#### Scale journey (`.scaleJourney`)
- **Track:** height **220svh** (1980px). `.scaleFrame` is **sticky at top 0, 100svh**, so it stays pinned for ≈1080px.
- **Art:** video `scene-5.mp4` (1280×720) with poster `scene-5.webp`, cover. A spiralling ring of tall metal slats with blue light, in a dark room. Bottom gradient `transparent 40% → night .75`.
- **Stencil** (`.scaleStencil`): a night-colored full-bleed layer with `mix-blend-mode: multiply`. It holds the word **"scale."** at **31vw (446px), weight 500**, −0.075em, transform-origin 50% 52%. The glyphs act as **windows** onto the video, and everything outside the letters is near-black.
- **Scroll effect:** the stencil word **scales up** from fitting inside the viewport (first frames show "scale" letters cropped at the bottom edge, `d13`) to enormous (only the counter of the "a" fills the screen, `d14`, `f_sca_12872`). Eventually the letter interiors exceed the viewport and the full video is revealed (`f_sca_13632`). This reads as flying through the letter into the image.
- **Copy** (`.scaleCopy`): absolute `bottom: 110px; left/right: 4.5%`, flex space-between, align end.
  - Left: "What became possible when / methods, computing and / datasets converged?" at 30px / 1.2, max 23ch.
  - Right: "One unit becomes a / system." at 13px, max 18ch.
- Chapter meta row at top 115px. Scene caption at bottom 35px: "An impossible archive." on the left, "An imagined installation" on the right (11px silver).
- Then the reading room.

### 3.8 Chapter 06, "The context" (2017 — 2021)

#### Context stage (`.contextStage`)
**Box:** **blue** (#234AE8), white text, padding 176px 6% 75px, no border. Footer and header modes are `blue`.
- **Meta row:** top 115px, 6% insets.
- **Intro row** (flex space-between, align start):
  - h2 "The context." at clamp(32px, 4.3vw, 70px) (62px), −0.045em, lh .92, left.
  - "How did attention and transformers / change the picture?" at 21px / 1.3, max 27ch, right (x≈1004).
- **Word field** (`.wordWorld`), full-bleed (edge to edge, 1440 × 500):
  - Canvas or still of **"bank"** as a huge chrome 3D word (≈425px, x≈210→1280).
  - Behind it, a field of fine wavy blue lines made of repeating tiny italic text ("She sat on the bank of the river…").
  - The still is masked with `linear-gradient(transparent, #000 12%, #000 88%, transparent)`, so it fades at top and bottom.
  - Centered below the word: the meaning "a river's edge" at 21px, −0.025em.
- **Tabs** (`.worldTabs`): grid `repeat(3, 30%)`, gap 5%, 1px hair bottom line. Buttons are 76px tall, 22px, left-aligned: "Beside the river" · "A place for money" · "A change of direction". The active tab has a **3px white bottom border**.
- **Sentence** (`.worldSentence`): "She sat on the **bank** of the river." Each word is a button at clamp(24px, 3.6vw, 52px) (52px), −0.04em, flex-wrap with gap 6px 13px, max 85%, margin-top 52px. The active word has a 1px white underline.
- **Explanation:** 18px / 1.5, max 50ch, **margin-left 42%** (x≈619). Below it a note at 11px, same indent, margin-top 25px.
- Then the reading room. The archive has 4 rows.

### 3.9 Chapter 07, "The interface" (2022 — present)

#### Threshold stage (`.stage`, InterfaceThreshold)
- **Track:** the section holds a **sticky 100svh stage** (night). The CSS variable `--opening` scrubs 0 → 1 over about 1,000px of scroll (y 17065 → ≈18065). The rest of the track holds the opened state.
- **State `--opening = 0`** (`d19`): the screen is split by **two night "shutters"**, each 46% wide, that meet at the center.
  - Left half: **"You."** at about 22vw (317px), −0.075em, silver-white, x≈60→555, vertically centered (y≈315→545).
  - Right half: **"The / machine."** (≈150px) starting at x≈910.
  - In the gap: a **vertical 3D seam**, a thin stack of metal rungs about 36px wide running from y≈80 to 730.
  - Centered on it: a **70px circle** (1px silver border, night fill) containing "↔" at 30px, at top 47%.
- **Scrubbed opening:**
  - The shutters slide apart (translateX, .65s ease-out-3 smoothing). The art (`scene-7` video, cover) scales from **1.55 → 1**, and its opacity follows `.07 + opening² × .93`.
  - The seam circle fades out by opening ≈ .25.
  - In the middle phase you see a receding tunnel of rounded-rectangle metal frames (`f_int_17405`, `f_int_17745`).
- **State `--opening = 1`** (`d20`): the full scene is shown (a glass ribbon crossing a blue laser line in a dark hall). The **destination** type "A new / way in." fades in only once opening > .85:
  - Size clamp(110px, 14vw, 220px) (202px), lh .82, −0.065em.
  - Positioned at top 47%, left ≈17%. The second line is indented 16%.
  - It scales from .82 → 1.
- **Constant overlays:**
  - Chapter meta at top 115px. It moves up to ≈88px in the opened state.
  - Bottom-left: "What happens when people can / converse with generative systems?" at 32px, then "Language becomes a way in." at 12px silver.
  - Bottom-right panel (x≈897–1354): "Open the interface ↗" at 20px, which becomes "Close the interface ↙" when opened. Below it a 1px white slider whose thumb tracks `--opening`, then "Drag the seam. Change the distance." at 11px silver.
- Then the reading room.

### 3.10 Chapter 08, "The choices" (An open question)

#### Choices stage (`.choicesStage`)
**Box:** night, padding 175px 6% 95px, **auto height** (≈1,050px). Header and footer modes are carbon.
- **Meta row:** "08 / 08 · The choices" on the left, "An open question" on the right.
- **Top-left:** "The next / shape." at ≈60px, −0.055em, then "Choose where this goes." at 12px silver.
- **Center:** a **3D sculpture**: interlaced ribbons, half **blue** and half **silver**, made of fine parallel grooves. It spans x≈475→1030, y≈215→690. The image or canvas is `object-fit: contain`. The container's height transitions (.85s ease-out-3) from `clamp(340px, 43svh, 520px)` once a tab has been explored. An intro caption fades out (.45s).
- **Bottom-left caption:** "Three paths. One unfolding form." at 10px silver.
- **Tabs:** grid of 3 across the content width with a 1px hair top line. "Purpose ↗ · Evidence ↗ · Consequences ↗" at 43px, −0.035em. The active tab has a **3px white bottom border**.
- **Answer panel** (appears with `answerIn`: opacity 0 → 1, translateY 12px → 0):
  - Left: h3 "Who chooses what intelligence is for?" at 60px, −0.045em, 2 lines, ≈708px wide. Below it, questions at 18px / 1.5 in silver.
  - Right (x≈922–1354): "Follow this question through the archive" at 11px silver, then route rows. Each row has a 1px hair-on-carbon top border, grid `40px | 1fr | 20px`, padding 24px 0: year at 10px silver, title at 16px, "↗" on the right.

#### Reading room
Same template as the other chapters, but there is **no archive list**. The body paragraph stands alone.

#### Ending (`.ending`)
**Box:** **blue**, padding 95px 6% 100px, `overflow: hidden`.
- **"Keep / questioning."** at **13vw (187px)**, lh .83, −0.065em, white. Each word is a block line. The second line is **indented 10%**, and the "q" descender nearly touches the cards. Margin-bottom 80px.
- **Three cards:** grid `repeat(3, 30%)`, space-between, gap 5%. Each card is a link with a **1px white top border** and padding-top 25px, laid out as a flex column with gap 40px:
  - Title at 23px / 1.25: "Every moment. An evolving story." / "Take a closer look." / "Trace every idea to its source."
  - Link at 13px: "Explore the timeline ↗" / "Read the exhibition ↗" / "Follow the evidence ↗"

### 3.11 Site footer (`.footer`)
- **Box:** night, white text. Padding 40px 6vw 100px, no top margin. Grid `1.2fr | 2fr`, align-items end.
- **Left:** wordmark (glyph plus "The Shape of Intelligence" at 15px/500), then "A history of the ideas that taught machines to learn." at 15px / 1.5 in silver, margin-top 10px.
- **Right:** 4-column `dl` grid, gap 16px 32px, 13px.
  - `dt` labels: EXHIBITION / MADE BY / REVIEWED / DATA, in **mono uppercase 12px, tracking .1em, silver**.
  - `dd` links: silver at 13px with 24px min-height, stacked with a 2px gap. Hover turns them white.
  - "Reviewed" shows plain text: "cutoff 2026-06-30 · reviewed 2026-09-12", then "build d2a7bca".

---

## 4. Images, aspect ratios and crops

| Asset | Intrinsic | Ratio | Rendered @1440×900 | Fit / crop |
|---|---|---|---|---|
| Scene stills and videos (`scene-3/5/7`) | 2400×1357 stills; 1920×1080 or 1280×720 video | ≈16:9 | 1476×923 (100vw × 100svh, scaled 1.025) | `cover`, centered. The 2.5% overscale leaves room for camera drift (`--camera-x/y`) |
| Chapters-menu previews (`scene-N-mobile`) | 1080×1440 | 3:4 portrait | left column, full height | `cover`, centered |
| Hero sculpture still (`pose-1`) | 1800×1400 | 9:7 | 1296×486 box | `contain` |
| Anamorph "THINK?" (`aligned`) | 1800×1000 | 9:5 | 1440×620 | `contain` |
| Context field still (`pose-0`) | 1600×600 | 8:3 | 1440×500 | `cover`, with vertical fade mask 0 → 12% / 88% → 100% |
| Choices sculpture (`pose-0`, `pose-3`) | 1800×1200 or 1440×1000 | 3:2 or 1.44:1 | 1440×515 / 1440×900 | `contain` |
| Learning plate | canvas | 1:1 | ≈680×680 | n/a |

- All scene art is dark, desaturated and cool, with a single **blue** light accent that matches `--blue`.
- Stills always load first. Video or WebGL crossfades in on top once ready: 1.5s for video, .5–.7s for canvas.
- No image has a border radius, border or shadow.
- On chapter stages, a gradient scrim sits over the art: left to right night 40% → 0 by 75%, and top to bottom 0 at 35% → night 85%.

---

## 5. Navigation behavior
- **Primary nav:** four text links in the fixed header. The same links appear as the "Exhibition" column in the footer.
- **Chapter navigation:**
  - The foot-bar "Chapters" button opens the fullscreen dialog (§1.4).
  - The foot bar shows the live chapter counter "0N / 08". It updates as each chapter enters and matches `html[data-active-chapter]`.
  - The index icon highlights the active bar.
- **In-page anchors:** "Begin the story ↘" and the prologue "↓" both jump to `#the-question`, smooth-scrolled by Lenis. Chapters have `scroll-margin-top: 0`.
- Each chapter has a "Read this chapter ↗" link out to `/read/<slug>/`. Archive rows link to `/timeline/<event>/`.
- Skip link: "Skip to content" → `#main`.
- The header never hides. The header and foot-bar color modes swap based on the surface underneath them.

## 6. Sticky and pinned elements (desktop, motion on)
| Element | Rule | Pinned duration |
|---|---|---|
| Header | `fixed; top: 0; h: 84px; z: 40` | always |
| Progress hair | `fixed; top: 0; h: 2px; z: 45` | always |
| Foot bar | `fixed; bottom: 0; h: 48px; z: 44` | always (not seen over site footer) |
| Prologue frame | `sticky; top: 0; h: 100svh` in a ≈230svh section | ≈1170px |
| Rules / Examples intro column | `sticky; top: 135px; align-self: start` | length of the instrument column |
| Promise rupture stage | `sticky; top: 0; h: 100svh` | ≈1200px scrub (`--promise-progress`) |
| Scale frame | `sticky; top: 0; h: 100svh` in a 220svh track | ≈1080px scrub (stencil scale) |
| Interface stage | `sticky; top: 0; h: 100svh` | ≈1000px scrub (`--opening`) plus hold |

On mobile (≤759px) and with motion off, the lab intros become `position: static`. The prologue becomes 200svh on mobile, the scale track becomes 175svh on mobile, and the pins are removed when motion is off.

## 7. Scroll interactions (summary)
1. **Header content fade:** the gradient header dissolves content scrolling beneath it.
2. **Prologue drum roll:** three two-line statements rotate through a clipped window, with ghosted tilted outgoing lines and clipped incoming lines.
3. **Promise fracture:** the title word shears into horizontal slices, and the state caption and a 185px progress bar advance.
4. **Scale fly-through:** a giant multiply-blended stencil word scales up until the video behind it is fully revealed.
5. **Interface threshold:** the shutters part, the art zooms from 1.55× to 1× and fades in, the seam fades out, and "A new way in." fades and scales in during the last 15%.
6. **Progress hair and chapter counter:** both track the chapters.
7. **Header and footer mode switching:** paper, carbon and blue.
8. **Section reveals:** `[data-reveal]` elements start at `opacity: 0; translateY(12px)` and animate in when entering the viewport. The tokens suggest `--dur-reveal .7s` with `--ease-out-3`.

## 8. Entrance animations
- `[data-reveal]`: fade plus rise 12px (≈.7s, ease-out-3). Applies to text blocks across the reading rooms and stages. The attribute is removed once revealed.
- Media: poster → video crossfade (1.5s); still → canvas crossfade (.5–.7s); scene media held at a constant `scale(1.025)`.
- `ChoiceFork answerIn`: opacity 0 → 1, translateY 12px → 0 when a choice tab changes.
- `Rules shapeIn`: a specimen shape enters from `perspective(500px) rotateY(-50deg) scale(.85)` at opacity .4 to rotateY(0) scale(1) at opacity 1.
- Sound-wave icon pulse: `scaleY(.35)`, 1.1s ease-in-out infinite alternate, with bars offset by −.7s and −.3s.
- No page-load intro or preloader was observed. The hero is static on load apart from the canvas fading in.

## 9. Hover interactions
| Target | Effect | Timing |
|---|---|---|
| Default underlined links | underline color goes from hair (16%) to currentColor; underline offset .18em, 1px | .15s ease-out-2 |
| Header nav | color set to `--fg` (already full strength, so effectively no change) | .2s ease-out-3 |
| Footer `dd` links | silver → white | – |
| "Begin the story" circle | fills carbon, arrow turns white, rotates 45° | .35s fill; .6s rotate, ease-out-3 |
| Hero sculpture | blue 88px "Drag to reshape" bubble appears (opacity and scale .7 → 1); grab cursor | .3s |
| `.door` buttons | bottom border turns accent blue | .2s |
| Specimen tiles | text and border darken to fg / fg-2; icon `rotate(-12deg) scale(1.15)` | .15s; icon .45s ease-out-3 |
| Addable rules | border turns accent; text turns blue in immersive mode | .15s |
| Chips / tabs | border hair → fg-2 | .2s |
| "Chapters" toggle | all index bars grow 8 → 20px | .35s |
| Dialog rail rows | row turns blue; arrow `translate(4px, -4px)`; preview image crossfades and settles 1.06 → 1 | .4s; .6s / 1s |
| Choices route rows | underline with 5px offset | – |
| Focus (all) | 2px blue outline (white on dark modes), offset 3px, radius 2px | – |

## 10. Transitions between sections
- Sections always change with **hard edges**. There are no gradients or overlaps between surfaces: paper to night is a straight horizontal cut.
- A 1px hair top border marks transitions between paper sections (prologue top, lab top, reading room after the context stage, and so on).
- Dark stages overlay their art with gradient scrims toward night at the bottom, so the art "sets" onto a dark floor before the cut to paper.
- Pinned stages release naturally: the sticky element scrolls away with the rest of the page once its track ends.
- The header and foot bar invert color at each cut, which reinforces the change of surface.

## 11. Responsive notes (≤759px, from 390×844 captures)
- **Header:** 102px tall, 6% inline padding. The wordmark (14px) sits on row 1 and the nav (12px, gap 23px) on row 2, left-aligned.
- **Hero:**
  - 100svh with a 740px minimum.
  - "The Shape" at 17.5vw with "of" at .48em; "Intelligence" at 18.1vw.
  - The sculpture sits between the two lines rather than behind them.
  - The bottom row stacks: copy on the left and a 60px begin circle on the right with its label below; the pose control spans full width underneath.
- **Stages:** padding 180–190px top, 6% sides. Lab titles at 22vw with inline words ("The rules." on one line). Specimens in a 4 × 2 grid.
- **Reading room:** single column. Thesis at 30px, body at 18px, event rows `17% | 83%` at 13px.
- **Promise:** "promise." at 20.7vw; the question sits at left 27%, bottom 155px.
- **Context:** h2 at 37–39px; tabs center-aligned at 12px and 64px tall; sentence words at 30px.
- **Ending:** "Keep questioning." at 16.2vw with no indent; cards stack.
- **Foot bar:** 42px tall, 6% padding. **Dialog:** fullscreen (100svh), rail titles at 9vw.
