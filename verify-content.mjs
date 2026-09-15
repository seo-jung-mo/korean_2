import fs from 'node:fs';
import { wordIcons } from './word-icons.js';
import { highlightGrammar } from './grammar-highlight.js';
import { renderJourney, journeyStages, puzzleTokens } from './journey.js';
import { languageOptions, grammarHelp, t } from './i18n.js';

const manifest=JSON.parse(fs.readFileSync('content/manifest.json','utf8'));
if(manifest.units.length!==18) throw Error('Expected 18 course entries');
for(const entry of manifest.units){
  const unit=JSON.parse(fs.readFileSync(`.${entry.content}`,'utf8'));
  if(unit.unitId!==entry.unitId)throw Error(`Unit ID mismatch: ${entry.unitId}`);
  if(unit.kind==='culture'){
    if(!unit.reading||!unit.comprehension?.choices?.length)throw Error(`Incomplete culture corner: ${entry.unitId}`);
    continue;
  }
  if(unit.grammar.length<2||!unit.dialogue2?.lines?.length||!unit.dialoguePractice?.one?.question||!unit.dialoguePractice?.two?.question||!unit.listening?.question||!unit.speaking?.prompt||!unit.reading?.question||!unit.writing?.prompt)throw Error(`Incomplete lesson: ${entry.unitId}`);
  if(unit.vocabulary.filter(v=>v.source==='textbook-vocabulary').length<5)throw Error(`Too few textbook words: ${entry.unitId}`);
  for(const word of unit.vocabulary)if(!wordIcons[word.ko])throw Error(`Missing word icon: ${entry.unitId}/${word.ko}`);
  if(unit.unitId==='u01'){
    const byWord=Object.fromEntries(unit.vocabulary.map(word=>[word.ko,word]));
    if(byWord['요즘'].part!==1||byWord['잘 지내요?'].part!==1||byWord['바쁘다'].part!==2||byWord['바쁘다'].form!=='바빠요')throw Error('Unit 1 vocabulary grouping is inconsistent');
  }
  for(const point of unit.grammar){
    if(!point.details?.form||!point.details?.usage||!point.details?.watchOut||point.examples.length<2)throw Error(`Incomplete grammar: ${entry.unitId}/${point.pattern}`);
    for(const example of point.examples)if(!highlightGrammar(example.ko,point.pattern,text=>text).includes('class="grammar-highlight"'))throw Error(`Grammar form not highlighted: ${entry.unitId}/${point.pattern}/${example.ko}`);
  }
  for(const practice of ['practice1','practice2']){
    const {ordered,mixed}=puzzleTokens(unit,practice);
    if(ordered.length<2||mixed.length!==ordered.length)throw Error(`Invalid sentence puzzle: ${entry.unitId}/${practice}`);
  }
  for(const [language] of languageOptions){
    if(language!=='ko')for(const grammar of unit.grammar)if(!grammarHelp(language,grammar.pattern))throw Error(`Missing ${language} grammar: ${grammar.pattern}`);
    for(const step of journeyStages){
      const state={language,journey:{step,answerChoice:null,answerChecked:false,hintLevel:0,puzzleSelected:[],puzzleChecked:false,quizIndex:0,transcript:false,draft:'',saved:false}};
      const html=renderJourney({unit,state,chrome:x=>x,esc:x=>String(x),manifest});
      if(!html.includes('journey-nav')||html.includes('undefined')||html.includes('null'))throw Error(`Render problem: ${entry.unitId}/${language}/${step}`);
      if(!t(language,step.startsWith('scene')?'scene':step.startsWith('words')?'words':step.startsWith('grammar')?'grammar':step.startsWith('practice')?'practice':step))throw Error(`Missing guide: ${language}/${step}`);
      if(['practice1','practice2','listening','reading','quiz'].includes(step)){
        const question=step==='listening'?unit.listening.question:step==='reading'?unit.reading.question:step==='practice1'?unit.dialoguePractice.one.question:step==='practice2'?unit.dialoguePractice.two.question:unit.quiz[0];
        state.journey.answerChoice=question.answer;state.journey.answerChecked=true;
        if(!renderJourney({unit,state,chrome:x=>x,esc:x=>String(x),manifest}).includes('activity-feedback success'))throw Error(`Correct feedback missing: ${entry.unitId}/${step}`);
      }
    }
  }
}
console.log('18 units, 14 complete learning flows, 9 guide languages: OK');
