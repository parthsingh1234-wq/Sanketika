import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  INCLUSIVE_SERVICE_CARDS,
  AAC_CORE_TILES,
  PAIN_SCALE_LEVELS,
  type ServiceCategory,
} from '../utils/inclusiveServices.ts';
import { REGIONAL_DICTIONARY } from '../utils/regionalLanguages.ts';

describe('Inclusive Digital Services & AAC Suite', () => {
  it('should define valid service cards covering all critical public access sectors', () => {
    assert.ok(INCLUSIVE_SERVICE_CARDS.length >= 8, 'Must have at least 8 essential service cards');

    const expectedCategories: ServiceCategory[] = ['emergency', 'health', 'transit', 'banking'];
    const presentCategories = new Set(INCLUSIVE_SERVICE_CARDS.map(c => c.category));

    for (const cat of expectedCategories) {
      assert.ok(presentCategories.has(cat), `Category "${cat}" must be covered in service cards`);
    }

    for (const card of INCLUSIVE_SERVICE_CARDS) {
      assert.ok(card.id, 'Card must have an id');
      assert.ok(card.title, 'Card must have a title');
      assert.ok(card.emoji, 'Card must have an emoji');
      assert.ok(card.fullMessage.length > 10, 'Card must have a detailed accessible message');
      assert.ok(card.accentColor.startsWith('#'), 'Card must have a valid hex color');
    }
  });

  it('should map service card regional keys to valid dictionary entries or fallbacks', () => {
    for (const card of INCLUSIVE_SERVICE_CARDS) {
      if (card.regionalKey) {
        const dictEntry = REGIONAL_DICTIONARY[card.regionalKey];
        assert.ok(
          dictEntry !== undefined,
          `Card ${card.id} regionalKey "${card.regionalKey}" must be defined in REGIONAL_DICTIONARY`
        );
      }
    }
  });

  it('should define a comprehensive Wong-Baker pain scale from 0 to 10', () => {
    assert.strictEqual(PAIN_SCALE_LEVELS.length, 6);
    assert.strictEqual(PAIN_SCALE_LEVELS[0].score, 0);
    assert.strictEqual(PAIN_SCALE_LEVELS[PAIN_SCALE_LEVELS.length - 1].score, 10);

    for (const level of PAIN_SCALE_LEVELS) {
      assert.ok(level.score >= 0 && level.score <= 10);
      assert.ok(level.emoji, 'Level must have a facial emoji');
      assert.ok(level.label, 'Level must have a clinical label');
      assert.ok(level.description, 'Level must have descriptive criteria');
      assert.ok(level.color, 'Level must have a high-contrast color code');
    }
  });

  it('should define core AAC communication tiles with necessary daily needs', () => {
    assert.ok(AAC_CORE_TILES.length >= 10, 'Must have at least 10 core AAC tiles');

    const tileIds = AAC_CORE_TILES.map(t => t.id);
    assert.ok(tileIds.includes('water'), 'AAC must include water');
    assert.ok(tileIds.includes('food'), 'AAC must include food');
    assert.ok(tileIds.includes('toilet'), 'AAC must include restroom');
    assert.ok(tileIds.includes('help'), 'AAC must include help');
    assert.ok(tileIds.includes('yes'), 'AAC must include yes');
    assert.ok(tileIds.includes('no'), 'AAC must include no');

    for (const tile of AAC_CORE_TILES) {
      assert.ok(tile.phrase.length > 0, `Tile ${tile.id} must have a spoken phrase`);
      assert.ok(['needs', 'social', 'feeling', 'action'].includes(tile.category));
    }
  });
});
