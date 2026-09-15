import fs from 'node:fs';
import assert from 'node:assert/strict';
import { renderJourney } from './journey.js';

const esc = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
for (let number = 1; number <= 14; number++) {
  const id = `u${String(number).padStart(2, '0')}`;
  const unit = JSON.parse(fs.readFileSync(`content/units/${id}.json`, 'utf8'));
  const manifest = { units: [{ unitId: id, icon: '★' }] };
  for (const [step, lines] of [
    ['scene1', unit.dialogue.lines],
    ['practice1', unit.dialogue.lines],
    ['scene2', unit.dialogue2.lines],
    ['practice2', unit.dialogue2.lines]
  ]) {
    const state = { language: 'ko', journey: { step, answerChoice: null, hintLevel: 0, puzzleSelected: [] } };
    const html = renderJourney({ unit, state, chrome: content => content, esc, manifest });
    const allLines = esc(lines.map(line => line.text).join(' '));
    assert.ok(html.includes(`data-text="${allLines}"`), `${id} ${step} whole dialogue audio`);
    if (step.startsWith('practice')) {
      const sentence = step === 'practice1' ? unit.dialoguePractice.one.sentence : unit.dialoguePractice.two.sentence;
      const puzzle = html.slice(html.indexOf('class="puzzle-card"'));
      assert.ok(puzzle.includes(`data-text="${esc(sentence)}"`), `${id} ${step} sentence audio in puzzle`);
      assert.ok(!html.includes('aria-label="대화 문장 듣기"'), `${id} ${step} no duplicate audio below dialogue`);
      assert.ok(!html.includes('class="practice-recap"'), `${id} ${step} no duplicate sentence box`);
    }
  }
}
console.log('All 14 units play every line in both dialogue and practice screens: OK');
