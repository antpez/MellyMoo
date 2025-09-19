#!/usr/bin/env node

/**
 * Color Assist Validation Script
 * 
 * Validates that all theme items have corresponding glyphs
 * and checks for consistency across the Color Assist system
 */

const { validateThemeGlyphs, getAllGlyphs } = require('../src/features/play/components/ColorAssist');

console.log('🎨 Color Assist System Validation\n');

// Validate theme glyphs
console.log('📋 Validating theme glyphs...');
const validation = validateThemeGlyphs();

if (validation.missing.length > 0) {
  console.log('❌ Missing glyphs:');
  validation.missing.forEach(item => console.log(`   - ${item}`));
} else {
  console.log('✅ All theme items have corresponding glyphs');
}

if (validation.extra.length > 0) {
  console.log('⚠️  Extra glyphs (not used in level configs):');
  validation.extra.forEach(item => console.log(`   - ${item}`));
}

// Display complete glyph catalog
console.log('\n📚 Complete Glyph Catalog:');
const allGlyphs = getAllGlyphs();

console.log('\n🎨 Colors:');
allGlyphs.colors.forEach(glyph => {
  console.log(`   ${glyph.symbol} - ${glyph.description}`);
});

console.log('\n🎁 Items:');
allGlyphs.items.forEach(glyph => {
  console.log(`   ${glyph.symbol} - ${glyph.description} (${glyph.theme})`);
});

console.log('\n✨ Specials:');
allGlyphs.specials.forEach(glyph => {
  console.log(`   ${glyph.symbol} - ${glyph.description} (${glyph.theme})`);
});

console.log('\n⚠️  Avoiders:');
allGlyphs.avoiders.forEach(glyph => {
  console.log(`   ${glyph.symbol} - ${glyph.description} (${glyph.theme})`);
});

// Summary
console.log('\n📊 Summary:');
console.log(`   Colors: ${allGlyphs.colors.length}`);
console.log(`   Items: ${allGlyphs.items.length}`);
console.log(`   Specials: ${allGlyphs.specials.length}`);
console.log(`   Avoiders: ${allGlyphs.avoiders.length}`);
console.log(`   Total: ${allGlyphs.colors.length + allGlyphs.items.length + allGlyphs.specials.length + allGlyphs.avoiders.length}`);

if (validation.missing.length === 0) {
  console.log('\n🎉 Color Assist system is complete and consistent!');
} else {
  console.log('\n❌ Color Assist system needs attention.');
  process.exit(1);
}
