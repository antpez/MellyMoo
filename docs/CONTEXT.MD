## Melly Moo – Game Design Overview

### 5.2 Screen Specs

Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
UI Framework: React Native Paper
AI Processing: OpenAI

### Title
- **Hero**: Logo, Melly Moo waving.
- **CTA**: “Tap to play” with a large touch area.

### Home
- **Primary**: Big Play button.
- **Shortcuts**: Sticker Book, Farmyard, Wardrobe.
- **Footer buttons**: Settings (kid-safe), Grown-ups (parent gate).

### Play Setup
- **World carousel**: Farm → Beach → …
- **Objective card**: Auto-selected or “Surprise!” option.
- **Accessibility toggles**: Reduce Motion, Color Assist icons on bubbles, Long-press mode.
- **Start**: Begin play.

### Gameplay HUD
- **Top-left**: Objective icon (e.g., color swatch).
- **Top-right**: Soft timer bar (friendly).
- **Bottom**: Melly Moo + Friend Meter.
- **Pause**: Small button at top center.

### Pause
- **Resume** (large).
- **Home**.
- **Settings**: Limited (music/sfx/haptics).

### Results
- **Celebration**: “You did it!” with confetti.
- **Summary**: Stars earned, stickers found.
- **Flow**: Continue → Reward Reveal.

### Reward Reveal
- **Pack opening**: Sticker, costume, or decor.
- **Quick action**: “Place now?” (Farmyard) / “Wear now?” (Wardrobe).

### Sticker Book
- **Pages**: Themed pages with outlined silhouettes.
- **Interaction**: Drag and drop stickers to fill.

### Farmyard (Decor Mode)
- **Placement**: Drag-drop decorations within safe boundaries.
- **UX**: No micro-precision required.

### Wardrobe
- **Dress-up**: Outfit Melly Moo.
- **Preview**: Idle preview; save outfit.

### Settings (Kid-safe)
- **Audio**: Music/SFX/Haptics sliders (icon-driven, no text needed).
- **Accessibility**: Toggles for motion, color assist, long-press.
- **Language**: Selector.
- **Resets**: Cloud/offline save reset available only in Grown-ups area.

### Grown-ups Area (Parent Gate)
- **Age gate**: Simple adult-only challenge (e.g., basic math).
- **Commerce & Compliance**: IAP packs, privacy policy, data options, support link.

---

### 6) Content System

#### 6.1 Themes (starter asset lists)

### Farm
- **BG**: Rolling hills, barn, clouds.
- **Items**: Flower, carrot, apple.
- **Special**: Rainbow Bubble.
- **Friend**: Duck.

### Beach
- **BG**: Shoreline, waves.
- **Items**: Shell, starfish, pail.
- **Special**: Disco Bubble.
- **Friend**: Pig (snorkel variant).

### Candy Land
- **BG**: Gumdrop hills.
- **Items**: Lollipop, jellybean, cupcake.
- **Special**: Giggle Bubble.
- **Friend**: Goat (candy collar).

### Space
- **BG**: Stars/nebula.
- **Items**: Star, planet, comet.
- **Special**: Freeze Bubble.
- **Friend**: Duck (astronaut reskin).

#### 6.2 Bubble Spawn Curves (defaults)
- **Spawn interval**: 700 ms → 350 ms over level.
- **Float speed**: 40 → 120 px/s over level (device-adjusted).
- **Probability example (Farm L1)**:
  - 70% Color (evenly split among 3 colors)
  - 20% Item
  - 7% Special (Rainbow 5%, Giggle 2%)
  - 3% Avoider (Mud)

---

### 7) Safety, Compliance, Accessibility

#### 7.1 Kid-Safety
- **No fail states**: No “game over”.
- **No social/UGC**: No chat or user-generated content.
- **Ads**: Opt-in reward ads only, max 2/day, shown only on Results/Reward screens; never during gameplay; verified kid-safe networks.
- **IAP**: Only in Grown-ups area behind parent gate.

#### 7.2 Privacy
- **Children’s privacy**: COPPA-compliant.
- **Data**: No personal data collection without verifiable parental consent.
- **Offline-first**: Analytics (if any) are aggregate and device-local; opt-in upload via Grown-ups.

#### 7.3 Accessibility
- **Color Assist**: Icon/shape inside color bubbles.
- **Reduce Motion**: Fewer particles; slower transitions.
- **Long-press mode**: Alternative to quick taps.
- **Readable UI**: Minimum 48 dp touch targets; generous spacing.

---

### 8) Monetization (Kid-Safe)
- **Model**: Free core game.
- **Unlockable Packs**: Content bundles; direct unlock, no loot boxes.
  - Theme Packs (Beach, Candy, Space) include BG, item set, 1 special bubble, 10 stickers, 5 decorations, 3 costumes.
- **Costume Packs**: Example: “Dress-up Day”.
- **Rewarded Ads (opt-in)**: +1 Reward Bubble at Results, or +50% stars.
- **Progression**: No paywalls; all core play available.

#### IAP Flow
1. Tap “Grown-ups” → parent gate.
2. View shop cards with clear content list and one-time price.
3. Confirm via native purchase sheet.
4. Content unlocks immediately; restore purchases supported.

---

### 9) Technical Architecture (engine-agnostic)

#### Core Systems
- **BubbleSpawner**: Spawn curves, lanes, probabilities.
- **Bubble**: Type, color, lifetime, float, pop logic.
- **MatchController**: Tap/swipe detection, group selection, combo.
- **ObjectiveController**: Goal tracking.
- **Director**: Dynamic difficulty (speed/colors/spawn rate).
- **VFX/SFX/VOManager**.
- **HelperController**: Duck/pig/goat timers.
- **RewardsManager**: Drops, reveal UI.
- **Inventory**: Stickers, costumes, decorations.
- **Economy**: Stars, costs.
- **SaveService**: Local cloudless save; optional cloud in parent area.
- **IAPService**: Parent-gated purchases.
- **AdsService**: Frequency caps, kid-safe networks.
- **SettingsService**: Audio, motion, accessibility.
- **LocalizationService**: String table, VO map.
- **Telemetry**: Local counters; opt-in upload only.

#### Performance Targets
- **Frame rate**: 60 FPS on phones/tablets; 120 FPS where possible.
- **Draw calls**: < 120.
- **Active particles**: < 400 (halve when Reduce Motion is on).
- **Assets**: Texture atlas per theme; lazy-load and cross-fade between scenes.

---

### 10) Data Storage (Local-first, no backend)

All data is stored locally on-device. There is no remote login or cloud backend. The app uses a local save to persist child profiles, accessibility settings, inventory ownership, economy, and layouts. Optional telemetry is device-local and only uploaded if a future parent-gated export is added.

Principles:
- Keep it offline-first and private by default.
- No personal data collection; child names are nicknames stored locally.
- If a future cloud sync is desired, it must remain opt-in behind the Grown-ups gate.

---

### 11) App Folder Structure (Expo Router)

Optimized for React Native + TypeScript + Expo + Expo Router + React Native Paper. Uses feature-first organization with shared libs and services.

```text
app/
  _layout.tsx                    # Expo Router root layout (providers, Paper theme)
  index.tsx                      # Title screen (Tap to Play)
  home.tsx                       # Home with Play + shortcuts
  play/
    _layout.tsx                  # Play stack (setup → gameplay → results)
    setup.tsx                    # World carousel, objective, accessibility toggles
    gameplay.tsx                 # HUD, interactions
    pause.tsx                    # Pause modal/screen
    results.tsx                  # Stars, stickers found
    reward-reveal.tsx            # Pack opening
  sticker-book.tsx               # Sticker Book
  farmyard.tsx                   # Decor mode
  wardrobe.tsx                   # Dress-up
  settings.tsx                   # Kid-safe settings
  grownups/
    _layout.tsx
    index.tsx                    # Parent gate entry
    parent-gate.tsx              # Age gate challenge
    shop.tsx                     # IAP shop
    privacy.tsx
    support.tsx

assets/
  fonts/
  images/
    themes/
  audio/
  lottie/

src/
  components/                    # Reusable UI (Buttons, Cards, Sliders)
    ui/
    gameplay/
  features/
    play/
      hud/
      spawner/
      controllers/
    sticker-book/
    farmyard/
    wardrobe/
    grownups/
  hooks/
    useAccessibility.ts
    useAudio.ts
    useColors.ts
  lib/
    theme/                       # React Native Paper theme
      index.ts
    i18n/                        # Localization setup
      index.ts
    navigation/                  # Typed links/helpers for Expo Router
      index.ts
  services/
    settings.ts                  # SettingsService (wraps storage + db)
    save.ts                      # SaveService (local-first)
    rewards.ts                   # RewardsManager
    inventory.ts                 # Inventory API
    economy.ts                   # Economy API
    iap.ts                       # IAPService
    ads.ts                       # AdsService
    telemetry.ts                 # Telemetry (opt-in)
    localization.ts              # LocalizationService facade
    audio.ts                     # VFX/SFX/VOManager facade
  state/                         # Store (e.g., Zustand), slices per feature
    index.ts
    accessibility.slice.ts
    gameplay.slice.ts
    inventory.slice.ts
  types/
    domain.ts                    # Domain models/enums shared across app
  utils/
    format.ts
    math.ts
    time.ts

config/
  app.config.ts                  # Expo config
  env.ts                         # Env schema/loader

scripts/
  supabase-gen-types.sh          
```

Conventions:
- Feature-first structure under `src/features` with UI, logic, and controllers colocated.
- All service singletons live in `src/services` and avoid UI imports.
- Keep route screens thin; delegate logic to feature modules and `state/` slices.

### 12) Tuning Defaults
- **Base pop**: +10; **Group bonus**: +5 per extra bubble.
- **Combo cap**: +50% (decays 10%/s while idle).
- **Helper cadence**: Every 10 s baseline or when Friend Meter is full.
- **Rewarded ad cap**: 2 per calendar day (local device).
- **Sticker drop**: 25% per level (no duplicates until set complete).

---

### 13) Localization
- **Design**: Text-light UI; icon-first.
- **Strings**: Table for VO captions and parent area.
- **Audio**: VO per language for 8–12 core lines.

---

### 14) QA & Kid Review Checklist
- **Responsiveness**: Pop response within 100 ms (haptics + SFX).
- **Input safety**: No dead touches near edges; respect safe insets.
- **Ads policy**: Never shown mid-gameplay or on first session.
- **Gating**: Parent gate always before IAP/links.
- **Accessibility**: Reduce Motion honored across scenes.
- **Offline**: No crashes when ad/IAP services are unavailable.

---

### 15) Build & Release
- **Content**: Packs as addressable bundles by theme.
- **Saves**: Migration via schema versioning.
- **Stability**: Crash & ANR monitoring; analytics opt-in toggle in Grown-ups.
- **Restore**: Purchases restored on first boot after reinstall.

---

### 16) Implementation Notes (optional engine tips)

#### Unity
- **Rendering**: 2D URP; sprite atlas per theme.
- **Animation**: DOTween/Timeline for reveals.
- **Input/Physics**: New Input System; Physics2D for swipe hit tests (circle overlap).
- **Content**: Addressables for themes; ScriptableObjects for LevelConfig.

#### Godot
- **Entities**: Area2D bubbles.
- **UI**: TileMap/CanvasLayer HUD.
- **Effects**: Tween for pop bursts.
- **Content**: Resource assets for configs; autoload singletons for services.

---

### 17) Open Tasks (MVP)
- Finalize color palette & icon set for Color Assist.
- Author 4 starter worlds (8 levels each).
- Record VO (child-safe, warm tone).
- Implement Director + reward tables.
- Parent gate & IAP/Ad integration (test with sandbox).
- Accessibility QA pass (reduce-motion, long-press).r
- [x] Sticker Book UI
- [x] Farmyard placeables (inventory, placement, persistence)

Completed since last update:
- Wardrobe system (equip/clear costumes, persisted, preview)
- Color Assist glyphs in gameplay (toggle-wired). Note: palette/icon set finalization still pending.
- Director: dynamic spawn interval ramps from 800 ms → 350 ms over 45s.
- Rewards: Per-level (1–20) tables. Early levels favor stickers; later shift toward decor; costumes remain rare but increase slightly. Theme-aware and prefers unowned items.

### 18) Build Plan (Step-by-step)
- [x] Initialize Expo project with TypeScript and Expo Router.
- [x] Install core deps: expo-router, react-native-paper, zustand.
- [x] Add global providers: PaperProvider + navigation theme in `app/_layout.tsx`.
- [x] Scaffold folders per Section 11 structure and add placeholders.
- [x] Implement `app/index.tsx` (Title) with “Tap to play” → navigates to Home.
- [x] Implement `app/home.tsx` with Play and shortcuts (Sticker Book, Farmyard, Wardrobe).
- [x] Setup env handling (`config/env.ts`) for local-only mode.
- [x] Add state slices: `accessibility.slice.ts`, `gameplay.slice.ts` (combined in `state/index.ts`).
- [x] Implement Settings screen (sliders, toggles) wired to state, persisted locally.
- [x] Implement Play flow: `play/setup.tsx` → `gameplay.tsx` → `results.tsx` → `reward-reveal.tsx`.
- [x] Wire Inventory/Rewards services to reflect unlocks in UI flows.
- [x] Implement Parent Gate + Shop (stubbed receipts) behind grown-ups route.
- [x] Add localization scaffolding and basic string table.
- [x] Add telemetry (opt-in) with local queue and backoff.
- [x] Prepare build config, icons/splash, EAS if used.

### 19) Next Steps (Gameplay Slice)
- Game loop: ticker (RAF) with start/stop, dt accumulation.
- Bubble model: id, type, color, x/y, radius, vy, lifetime.
- Spawner: timer + probability table (use Farm L1 defaults).
- Motion: float upward; cull off-screen or when popped.
- Input: tap to pop (circle hit test); support long-press mode.
- Scoring: base +10; group bonus +5 each; track color objective.
- HUD: timer bar, score, friend meter.
- Pause/Resume overlay: stop/start loop; resume/home/settings.
- Results aggregation: stars, stickers; handoff to Reward Reveal.
- Dev toggles: slow-mo, spawn rate multiplier, deterministic seed.
- Files to add:
  - `src/features/play/controllers/GameLoop.ts`
  - `src/features/play/spawner/BubbleSpawner.ts`
  - `src/features/play/components/Bubble.tsx`
  - `src/features/play/hud/HUD.tsx`
  - `src/state/gameplay.slice.ts` (bubbles, score, timer) 


