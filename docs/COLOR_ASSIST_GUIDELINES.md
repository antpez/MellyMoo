# Color Assist System Guidelines

## Overview
The Color Assist system provides accessible visual glyphs for users who need assistance identifying bubble types and colors. This system ensures consistency across all themes and bubble types while maintaining accessibility standards.

## Design Principles

### 1. Accessibility First
- **High Contrast**: White text with black shadow for maximum visibility
- **Distinct Shapes**: Each color/item has a unique, easily distinguishable symbol
- **Screen Reader Support**: All glyphs include descriptive accessibility labels
- **Consistent Sizing**: Glyphs scale appropriately with bubble size

### 2. Visual Hierarchy
- **Color Bubbles**: Geometric shapes (▲, ■, ●, ◆, ★, ♥)
- **Item Bubbles**: Emoji representations of actual items
- **Special Bubbles**: Unique symbols for special effects
- **Avoider Bubbles**: Warning symbols to indicate caution

### 3. Theme Consistency
- Each theme has its own set of items, specials, and avoiders
- Universal color glyphs work across all themes
- Theme-specific items are clearly categorized

## Color Palette

### Primary Colors
| Color | Symbol | Description | Hex Code |
|-------|--------|-------------|----------|
| Red | ▲ | Red Triangle | #FF6F61 |
| Blue | ■ | Blue Square | #4A90E2 |
| Green | ● | Green Circle | #7ED321 |
| Yellow | ◆ | Yellow Diamond | #F5A623 |
| Purple | ★ | Purple Star | #9013FE |
| Pink | ♥ | Pink Heart | #FF69B4 |

### Color Selection Rationale
- **Red Triangle (▲)**: Sharp, attention-grabbing, associated with urgency
- **Blue Square (■)**: Stable, reliable, associated with trust
- **Green Circle (●)**: Natural, organic, associated with growth
- **Yellow Diamond (◆)**: Bright, energetic, associated with joy
- **Purple Star (★)**: Special, magical, associated with wonder
- **Pink Heart (♥)**: Warm, friendly, associated with love

## Theme-Specific Items

### Farm Theme
| Item | Symbol | Description |
|------|--------|-------------|
| Flower | ✿ | Flower symbol |
| Carrot | 🥕 | Carrot emoji |
| Apple | 🍎 | Apple emoji |

### Beach Theme
| Item | Symbol | Description |
|------|--------|-------------|
| Shell | 🐚 | Shell emoji |
| Starfish | ⭐ | Star emoji |
| Bucket | 🪣 | Bucket emoji |

### Candy Theme
| Item | Symbol | Description |
|------|--------|-------------|
| Lollipop | 🍭 | Lollipop emoji |
| Jellybean | 🍬 | Candy emoji |
| Cupcake | 🧁 | Cupcake emoji |

### Space Theme
| Item | Symbol | Description |
|------|--------|-------------|
| Star | ⭐ | Star emoji |
| Planet | 🪐 | Planet emoji |
| Comet | ☄️ | Comet emoji |

## Special Effects

| Special | Symbol | Description | Theme |
|---------|--------|-------------|-------|
| Rainbow | 🌈 | Rainbow | Farm |
| Disco | 💫 | Sparkles | Beach |
| Giggle | 😄 | Laughing face | Candy |
| Freeze | ❄️ | Snowflake | Space |

## Avoider Warnings

| Avoider | Symbol | Description | Theme |
|---------|--------|-------------|-------|
| Mud | ⚠️ | Warning sign | Farm |
| Thorns | 🌵 | Cactus | Beach |
| Slime | 🟢 | Green circle | Candy |
| Ice | 🧊 | Ice cube | Space |

## Implementation Guidelines

### 1. Glyph Rendering
```typescript
// Font size scales with bubble size
fontSize: Math.max(bubble.radius * 0.8, 12)

// High contrast styling
color: '#FFFFFF'
textShadowColor: '#000000'
textShadowOffset: { width: 1, height: 1 }
textShadowRadius: 2
```

### 2. Accessibility Labels
```typescript
// Each glyph includes descriptive text for screen readers
accessibilityLabel={getColorAssistGlyph(bubble).description}
```

### 3. Fallback System
- Unknown items default to appropriate category fallbacks
- Color: ● (circle)
- Item: 🎁 (gift box)
- Special: ✨ (sparkles)
- Avoider: ⚠️ (warning)

## Testing Checklist

### Visual Testing
- [ ] All glyphs are clearly visible on their respective bubble colors
- [ ] High contrast is maintained across all themes
- [ ] Glyphs scale properly with bubble sizes (small, medium, large)
- [ ] No glyphs are cut off or overlapping

### Accessibility Testing
- [ ] Screen readers announce correct descriptions
- [ ] Color Assist toggle works properly
- [ ] Glyphs are distinguishable for colorblind users
- [ ] High contrast mode displays correctly

### Theme Testing
- [ ] Farm theme shows correct farm items
- [ ] Beach theme shows correct beach items
- [ ] Candy theme shows correct candy items
- [ ] Space theme shows correct space items
- [ ] Color glyphs work consistently across all themes

### Edge Cases
- [ ] Unknown items show appropriate fallback glyphs
- [ ] Missing assets don't break the system
- [ ] Performance is maintained with many bubbles
- [ ] Glyphs update correctly when theme changes

## Future Enhancements

### Potential Additions
1. **Custom Glyph Sets**: Allow users to choose different glyph styles
2. **Size Preferences**: User-adjustable glyph sizes
3. **Color Preferences**: Alternative color schemes for glyphs
4. **Animation**: Subtle animations for special effects
5. **Sound Cues**: Audio feedback for different bubble types

### Accessibility Improvements
1. **Voice Descriptions**: Spoken descriptions of bubble types
2. **Haptic Feedback**: Different vibrations for different bubble types
3. **Custom Labels**: User-defined descriptions for glyphs
4. **High Contrast Modes**: Additional contrast options

## Technical Implementation

### File Structure
```
src/features/play/components/
├── ColorAssist.ts          # Main Color Assist system
├── Bubble.ts              # Bubble type definitions
└── BubbleRenderer.tsx     # Bubble rendering component
```

### Key Functions
- `getColorAssistGlyph(bubble)`: Get appropriate glyph for any bubble
- `getThemeGlyphs(theme)`: Get all glyphs for a specific theme
- `validateThemeGlyphs()`: Ensure all theme items have glyphs
- `getAllGlyphs()`: Get complete glyph catalog

### Integration Points
- **Gameplay Screen**: Renders glyphs on bubbles when Color Assist is enabled
- **Settings Screen**: Toggle for enabling/disabling Color Assist
- **Accessibility Settings**: Part of overall accessibility configuration
- **Theme System**: Integrates with level configuration system

## Maintenance

### Regular Updates
1. **New Themes**: Add glyphs for new theme items
2. **New Bubble Types**: Extend glyph system for new bubble categories
3. **Accessibility Standards**: Update to meet latest accessibility guidelines
4. **User Feedback**: Incorporate user suggestions for improvements

### Quality Assurance
1. **Cross-Platform Testing**: Ensure glyphs work on iOS and Android
2. **Device Testing**: Test on various screen sizes and resolutions
3. **Accessibility Audits**: Regular accessibility testing
4. **Performance Monitoring**: Ensure glyph rendering doesn't impact performance
