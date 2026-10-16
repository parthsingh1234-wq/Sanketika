import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  REGIONAL_LANGUAGES,
  REGIONAL_DICTIONARY,
  translateSignToRegional,
  getLocaleForLang,
  type SupportedRegionalLang,
} from '../utils/regionalLanguages.ts';

describe('Regional Languages Localization Suite', () => {
  it('should support all 12 defined regional languages with valid metadata', () => {
    const expectedLangs: SupportedRegionalLang[] = [
      'en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn', 'gu', 'ml', 'pa', 'es', 'fr'
    ];

    for (const code of expectedLangs) {
      const info = REGIONAL_LANGUAGES[code];
      assert.ok(info, `Language ${code} should exist in REGIONAL_LANGUAGES`);
      assert.strictEqual(info.code, code);
      assert.ok(info.label.length > 0, `Language ${code} must have an English label`);
      assert.ok(info.nativeLabel.length > 0, `Language ${code} must have a native script label`);
      assert.ok(info.locale.includes('-'), `Language ${code} must have a valid BCP-47 locale tag`);
    }
  });

  it('should correctly return BCP-47 locale codes for speech synthesis', () => {
    assert.strictEqual(getLocaleForLang('hi'), 'hi-IN');
    assert.strictEqual(getLocaleForLang('ta'), 'ta-IN');
    assert.strictEqual(getLocaleForLang('te'), 'te-IN');
    assert.strictEqual(getLocaleForLang('bn'), 'bn-IN');
    assert.strictEqual(getLocaleForLang('es'), 'es-ES');
    assert.strictEqual(getLocaleForLang('fr'), 'fr-FR');
    assert.strictEqual(getLocaleForLang('en'), 'en-US');
  });

  it('should translate core signs into Hindi with native script and phonetics', () => {
    const hello = translateSignToRegional('HELLO', 'hi');
    assert.strictEqual(hello.isDictionaryMatch, true);
    assert.strictEqual(hello.text, 'नमस्ते');
    assert.strictEqual(hello.phonetic, 'Namaste');

    const water = translateSignToRegional('WATER', 'hi');
    assert.strictEqual(water.isDictionaryMatch, true);
    assert.strictEqual(water.text, 'पानी');
    assert.strictEqual(water.phonetic, 'Paani');

    const help = translateSignToRegional('HELP', 'hi');
    assert.strictEqual(help.isDictionaryMatch, true);
    assert.ok(help.text.includes('मदद'));
  });

  it('should translate core signs into South Indian languages (Tamil, Telugu, Kannada, Malayalam)', () => {
    const helloTamil = translateSignToRegional('HELLO', 'ta');
    assert.strictEqual(helloTamil.isDictionaryMatch, true);
    assert.strictEqual(helloTamil.text, 'வணக்கம்');
    assert.strictEqual(helloTamil.phonetic, 'Vanakkam');

    const helloTelugu = translateSignToRegional('HELLO', 'te');
    assert.strictEqual(helloTelugu.isDictionaryMatch, true);
    assert.strictEqual(helloTelugu.text, 'నమస్కారం');

    const thankYouKannada = translateSignToRegional('THANK_YOU', 'kn');
    assert.strictEqual(thankYouKannada.isDictionaryMatch, true);
    assert.strictEqual(thankYouKannada.text, 'ಧನ್ಯವಾದಗಳು');

    const waterMalayalam = translateSignToRegional('WATER', 'ml');
    assert.strictEqual(waterMalayalam.isDictionaryMatch, true);
    assert.strictEqual(waterMalayalam.text, 'വെള്ളം');
  });

  it('should translate emergency and public services phrases into regional languages', () => {
    const emergencySos = translateSignToRegional('EMERGENCY_SOS', 'hi');
    assert.strictEqual(emergencySos.isDictionaryMatch, true);
    assert.ok(emergencySos.text.includes('आपातकालीन'));

    const bankWithdraw = translateSignToRegional('BANK_WITHDRAW', 'ta');
    assert.strictEqual(bankWithdraw.isDictionaryMatch, true);
    assert.ok(bankWithdraw.text.includes('பணம்'));

    const transit = translateSignToRegional('TRANSIT_ROUTE', 'bn');
    assert.strictEqual(transit.isDictionaryMatch, true);
    assert.ok(transit.text.includes('বাস'));
  });

  it('should handle missing or unrecognized phrases gracefully with fallback', () => {
    const unknown = translateSignToRegional('NON_EXISTENT_PHRASE_123', 'hi');
    assert.strictEqual(unknown.isDictionaryMatch, false);
    assert.strictEqual(unknown.text, 'NON_EXISTENT_PHRASE_123');

    const empty = translateSignToRegional('', 'hi');
    assert.strictEqual(empty.text, '');
    assert.strictEqual(empty.isDictionaryMatch, false);
  });
});
