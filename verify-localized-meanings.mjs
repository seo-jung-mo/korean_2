import fs from 'node:fs';
import assert from 'node:assert/strict';
import { unitTranslationData } from './content-translations.js';
import { dialogueJa } from './dialogue-ja.js';

const languages = ['ja', 'zh', 'vi', 'ne', 'th', 'uz', 'mn'];
for (let number = 1; number <= 14; number++) {
  const id = `u${String(number).padStart(2, '0')}`;
  const unit = JSON.parse(fs.readFileSync(`content/units/${id}.json`, 'utf8'));
  const counts = {
    v: unit.vocabulary.length,
    g: unit.grammar.flatMap(item => item.examples).length,
    d1: unit.dialogue.lines.length,
    d2: unit.dialogue2.lines.length
  };
  for (const language of languages) {
    for (const [section, count] of Object.entries(counts)) {
      const values = language === 'ja' && section.startsWith('d')
        ? dialogueJa[id]?.[section === 'd1' ? 'scene1' : 'scene2']
        : unitTranslationData[id]?.[language]?.[section]?.split('|');
      assert.equal(values?.length, count, `${id} ${language} ${section} count`);
      assert.ok(values.every(value => value.trim()), `${id} ${language} ${section} empty meaning`);
    }
  }
}
console.log('All 14 units have complete meanings in seven selected languages: OK');
