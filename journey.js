import { t, ui, grammarHelp } from './i18n.js';
import { iconFor } from './word-icons.js';
import { avatarFor } from './characters.js';
import { highlightGrammar } from './grammar-highlight.js';
import { dialogueJa } from './dialogue-ja.js';
import { unitTranslation } from './content-translations.js';
import { groupedVocabulary } from './vocabulary-groups.js';
function meaning(english, unitId, language, section, index) {
  if (language === 'en') return english;
  return unitTranslation(unitId, language, section, index) || '번역 준비 중';
}
export function displayGrammarPattern(pattern) {
  return pattern.replace(/(^|\s)-/g, '$1~').replace(/-(?=$|\s)/g, '~');
}
export const journeyStages=['scene1','words1','grammar1','practice1','scene2','words2','grammar2','practice2','listening','speaking','reading','writing','quiz'];
const stageNames={scene1:'대화 1',words1:'어휘 1',grammar1:'문법 1',practice1:'대화 1 연습',scene2:'대화 2',words2:'어휘 2',grammar2:'문법 2',practice2:'대화 2 연습',listening:'듣기',speaking:'말하기',reading:'읽기',writing:'쓰기',quiz:'마무리 퀴즈'};
const english={
  '-고':'and; connects two actions or states','그런데':'but / however','못':'cannot','-아서/어서':'because; so','-(으)ㄹ래요':'would like to','무슨':'what kind of','이/가 걸리다':'takes (time)','-에서 -까지':'from ... to ...','(으)로':'toward / by way of','-아/어 주다':'do something for someone','-지요?':'right? / isn’t it?','-(으)ㄴ':'describes a noun','-고 있다':'be doing / wearing','의':'of / belonging to','-(으)시-':'honorific form','-아/어 보다':'try / have experienced','-고 싶다':'want to','-지 말다':'do not','-(으)ㄴ 후에':'after doing','-아야/어야 하다':'must / have to','-(으)ㄹ게요':'I will (promise)','-지만':'but / although','보다':'than','-(으)ㄹ 때':'when','-(으)러 가다':'go to do','-(으)려고':'in order to','-(으)면':'if'
};
function choiceBlock(q,s,esc,lang) {
  const done=s.answerChecked;
  return `<div class="activity-question"><span class="mini-label">이해 확인</span><h3>${esc(q.question)}</h3><div class="activity-options">${q.choices.map((choice,i)=>`<button class="activity-option ${s.answerChoice===i?'picked':''} ${done&&i===q.answer?'good':''} ${done&&s.answerChoice===i&&i!==q.answer?'bad':''}" data-action="journey-choice" data-index="${i}" ${done?'disabled':''}><b>${i+1}</b>${esc(choice)}</button>`).join('')}</div>${s.hintLevel?`<div class="activity-hint">💡 ${esc(q.hint[Math.min(s.hintLevel-1,q.hint.length-1)])}</div>`:''}${done?`<div class="activity-feedback ${s.answerChoice===q.answer?'success':''}">${s.answerChoice===q.answer?'✓ 맞았어요! Great job.':'다시 생각해 봐요. Try again.'}</div>`:''}<div class="answer-actions"><button class="secondary" data-action="journey-hint" ${s.hintLevel>=3?'disabled':''}>힌트 ${s.hintLevel||0}/3</button><button class="small-primary" data-action="journey-check" ${s.answerChoice===null?'disabled':''}>${esc(ui(lang,done&&s.answerChoice!==q.answer?'retry':'check'))}</button></div></div>`;
}
function dialogue(lines,esc,lang,unitId,section){return `<div class="journey-dialogue">${lines.map((line,i)=>`<div class="journey-line ${i%2?'other':''}"><span class="speaker-face"><img src="${avatarFor(line.speaker)}" alt="${esc(line.speaker)} 얼굴"></span><div><small>${esc(line.speaker)}</small><div class="bubble-ko">${esc(line.text)}</div>${lang==='ko'?'':`<span class="bubble-en" lang="${lang}">${esc(lang==='ja'?(dialogueJa[unitId]?.[section]?.[i]||'번역 준비 중'):meaning(line.meaning,unitId,lang,section==='scene1'?'d1':'d2',i))}</span>`}</div></div>`).join('')}</div>`;}
function playDialogueButton(lines,esc) {
  return `<div class="dialogue-play"><button class="secondary" data-action="journey-tts" data-text="${esc(lines.map(line=>line.text).join(' '))}" aria-label="대화 전체 듣기">🔊 대화 전체 듣기</button><small>대화 순서대로 한국어 합성 음성으로 들려줍니다.</small></div>`;
}
export function puzzleTokens(unit,step){
  const sentence=(step==='practice1'?unit.dialoguePractice.one:unit.dialoguePractice.two).sentence;
  const ordered=sentence.trim().split(/\s+/);
  return {ordered,mixed:[...ordered].reverse()};
}
function puzzleBlock(unit,s,esc){
  const {ordered,mixed}=puzzleTokens(unit,s.step),selected=s.puzzleSelected||[];
  return `<div class="puzzle-card"><span class="mini-label">문장 배열 · SENTENCE BUILDER</span><div class="puzzle-heading"><h3>낱말을 눌러 대화의 문장을 완성해 보세요.</h3></div><div class="puzzle-answer">${selected.length?selected.map(i=>`<span>${esc(mixed[i])}</span>`).join(''):'여기에 문장이 만들어져요.'}</div><div class="puzzle-chips">${mixed.map((token,i)=>`<button data-action="journey-token" data-index="${i}" ${selected.includes(i)?'disabled':''}>${esc(token)}</button>`).join('')}</div>${s.puzzleChecked?`<div class="activity-feedback ${selected.map(i=>mixed[i]).join(' ')===ordered.join(' ')?'success':''}">${selected.map(i=>mixed[i]).join(' ')===ordered.join(' ')?'✓ 문장을 잘 만들었어요!':'순서를 다시 살펴보세요.'}</div>`:''}<div class="puzzle-actions"><button class="secondary" data-action="journey-puzzle-clear">다시 배열하기</button><button class="small-primary" data-action="journey-puzzle-check" ${selected.length!==ordered.length?'disabled':''}>문장 확인</button><button class="secondary" data-action="journey-tts" data-text="${esc(ordered.join(' '))}" aria-label="배열할 문장 듣기">🔊 문장 듣기</button></div></div>`;
}
function nav(s,lang){const i=journeyStages.indexOf(s.step);return `<div class="journey-nav"><button class="secondary" data-action="journey-prev" ${i===0?'disabled':''}>← ${ui(lang,'previous')}</button><button class="primary" data-action="journey-next">${ui(lang,i===journeyStages.length-1?'finish':'next')} →</button></div>`;}
function learningOverview(unit,esc){
  const overview=unit.learningOverview;
  if(!overview) return '';
  return `<section class="learning-overview" aria-labelledby="learning-goals-title"><div class="overview-heading"><span class="mini-label">LESSON PREVIEW</span><h2 id="learning-goals-title">${Number(unit.unitId.slice(1))}단원에서 배울 내용</h2></div><div class="overview-columns"><div><h3>학습 목표</h3><ul>${overview.goals.map(goal=>`<li>${esc(goal)}</li>`).join('')}</ul><div class="overview-topics">${overview.topics.map(topic=>`<span>${esc(topic)}</span>`).join('')}</div></div><div><h3>이렇게 학습해요</h3><ol>${overview.plan.map(item=>`<li>${esc(item)}</li>`).join('')}</ol></div></div></section>`;
}

export function renderJourney({unit,state,chrome,esc,manifest}){
  const s=state.journey,stage=s.step,index=journeyStages.indexOf(stage),unitIcon=manifest.units.find(x=>x.unitId===unit.unitId)?.icon||'📖';
  let body='';
  if(stage==='scene1'||stage==='scene2'){
    const second=stage==='scene2';
    const lines=second?unit.dialogue2.lines:unit.dialogue.lines;
    body=`${!second?learningOverview(unit,esc):''}<div class="journey-intro"><span class="eyebrow">${second?'SCENE TWO':'SCENE ONE'} · SITUATION</span><h1>${second?'한 번 더 말해 봐요':'먼저 상황을 살펴봐요'}</h1><p>${esc(unit.subtitle||'대화를 읽고 어떤 상황인지 생각해 보세요.')}</p></div><div class="scene-banner"><div class="scene-emoji">${unitIcon}</div><div><small>오늘의 장면</small><strong>${esc(unit.title)}</strong><span>${second?'같은 주제로 이어지는 두 번째 대화예요.':'그림을 보고 어떤 이야기가 나올지 예상해 보세요.'}</span></div></div>${playDialogueButton(lines,esc)}${dialogue(lines,esc,state.language,unit.unitId,second?'scene2':'scene1')}<div class="activity-tip">💡 한국어 표현을 소리 내어 따라 읽어 보세요.</div>`;
  } else if(stage==='words1'||stage==='words2'){
    const groups=groupedVocabulary(unit,stage==='words1'?1:2);
    body=`<div class="journey-intro"><span class="eyebrow">VOCABULARY · ${stage==='words1'?'PART 1':'PART 2'}</span><h1>그림으로 단어 익히기</h1><p>비슷한 역할을 하는 말을 묶어서 익히고, 소리 내어 읽어 보세요.</p></div><div class="vocabulary-groups">${groups.map(group=>`<section class="vocabulary-group"><h2>${esc(group.title)}</h2><div class="visual-words">${group.words.map(v=>`<div class="visual-word"><span class="visual-emoji">${iconFor(v.ko)}</span><div class="visual-text"><strong>${esc(v.ko)}</strong>${v.form?`<span class="word-form">대화에서는 ${esc(v.form)}</span>`:''}${state.language==='ko'?'':`<span>${esc(meaning(v.meaning,unit.unitId,state.language,'v',unit.vocabulary.indexOf(v)))}</span>`}${v.romanization&&state.language!=='ko'?`<small>${esc(v.romanization)}</small>`:''}</div><button class="speak-icon" data-action="journey-tts" data-text="${esc(v.ko)}" aria-label="${esc(v.ko)} 발음 듣기">🔊</button></div>`).join('')}</div></section>`).join('')}</div><div class="activity-tip">✦ 각 묶음의 말을 사용해 짧은 문장을 말해 보세요.</div>`;
  } else if(stage==='grammar1'||stage==='grammar2'){
    const g=unit.grammar[stage==='grammar1'?0:1]||unit.grammar[0];
    body=`<div class="journey-intro"><span class="eyebrow">GRAMMAR · ${stage==='grammar1'?'PART 1':'PART 2'}</span><h1>문장을 만드는 열쇠</h1><p>형태와 의미를 보고, 예문을 천천히 읽어 보세요.</p></div><div class="journey-grammar"><span class="mini-label">오늘의 문법</span><h2>${esc(displayGrammarPattern(g.pattern))}</h2>${state.language==='en'?`<span class="grammar-english">${esc(english[g.pattern]||'Useful Korean expression')}</span>`:''}<p>${esc(g.explanation)}</p><div class="grammar-details"><div><small>① 만드는 법</small><p>${esc(g.details.form)}</p></div><div><small>② 언제 써요?</small><p>${esc(g.details.usage)}</p></div><div><small>③ 주의할 점</small><p>${esc(g.details.watchOut)}</p></div></div><div class="example-label">예문에서 색으로 표시된 부분을 보세요</div>${g.examples.map((ex,i)=>`<div class="j-example"><strong>${highlightGrammar(ex.ko,g.pattern,esc)}</strong>${state.language==='ko'?'':`<span>${esc(meaning(ex.meaning,unit.unitId,state.language,'g',unit.grammar.slice(0,unit.grammar.indexOf(g)).reduce((n,item)=>n+item.examples.length,0)+i))}</span>`}<button class="speak-icon" data-action="journey-tts" data-text="${esc(ex.ko)}" aria-label="예문 듣기">🔊</button></div>`).join('')}</div><div class="activity-tip">🗣️ 예문에서 한 단어를 바꿔 자신만의 문장을 말해 보세요.</div>`;
  } else if(stage==='practice1'||stage==='practice2'){
    const first=stage==='practice1',activity=first?unit.dialoguePractice.one:unit.dialoguePractice.two;
    const lines=first?unit.dialogue.lines:unit.dialogue2.lines;
    body=`<div class="journey-intro"><span class="eyebrow">대화 ${first?'1':'2'} · 연습</span><h1>대화를 내 것으로 만들어요</h1><p>아래 대화를 읽고 문제를 풀어 보세요.</p></div><div class="practice-source-label">📖 대화 ${first?'1':'2'} 다시 보기</div>${playDialogueButton(lines,esc)}${dialogue(lines,esc,state.language,unit.unitId,first?'scene1':'scene2')}${choiceBlock(activity.question,s,esc,state.language)}${puzzleBlock(unit,s,esc)}`;
  } else if(stage==='listening'){
    const q=unit.listening.question;
    body=`<div class="journey-intro"><span class="eyebrow">LISTENING · 듣고 이해하기</span><h1>귀로 먼저 만나 봐요</h1><p>질문을 읽고 음성을 들어 보세요. 필요하면 대본을 열 수 있어요.</p></div><div class="listening-stage"><div class="sound-art">🎧<span>♪</span></div><button class="primary play-button" data-action="journey-tts" data-text="${esc(unit.listening.script)}">▶ 한국어 듣기</button><small>${esc(t(state.language,'tts'))}</small><button class="text-link" data-action="journey-transcript">${s.transcript?'대본 숨기기':'대본 보기 · Show transcript'} →</button>${s.transcript?`<p class="transcript">${esc(unit.listening.script)}</p>`:''}</div>${choiceBlock(q,s,esc,state.language)}`;
  } else if(stage==='speaking'){
    body=`<div class="journey-intro"><span class="eyebrow">SPEAKING · 나의 말로 표현하기</span><h1>이번에는 내가 말할 차례</h1><p>대화의 표현을 바꿔 자기 이야기로 말해 보세요.</p></div><div class="speaking-card"><span class="speaking-emoji">🎙️</span><span class="mini-label">SPEAKING PROMPT</span><h2>${esc(unit.speaking.prompt)}</h2><div class="speaking-help"><strong>말하기 순서 · Speaking guide</strong><ol><li>핵심 단어 두 개를 고르세요.</li><li>짧은 문장으로 먼저 말하세요.</li><li>문법 표현을 넣어 다시 말하세요.</li></ol></div><button class="small-primary" data-action="journey-tts" data-text="${esc(unit.dialogue.lines[0].text)}">🔊 대화 첫 문장 듣기</button></div>`;
  } else if(stage==='reading'){
    body=`<div class="journey-intro"><span class="eyebrow">READING · 읽고 이해하기</span><h1>짧은 글을 읽어 봐요</h1><p>모르는 단어가 있어도 전체 상황을 먼저 생각해 보세요.</p></div><article class="reading-card"><span class="reading-icon">📖</span><span class="mini-label">SHORT READING</span><p>${esc(unit.reading.text)}</p></article>${choiceBlock(unit.reading.question,s,esc,state.language)}`;
  } else if(stage==='writing'){
    const draft=s.draft||'';
    body=`<div class="journey-intro"><span class="eyebrow">WRITING · 직접 써 보기</span><h1>나의 한국어로 써 봐요</h1><p>완벽한 문장보다 내 생각을 표현하는 것이 중요해요.</p></div><div class="writing-card"><span class="mini-label">WRITING PROMPT</span><h2>${esc(unit.writing.prompt)}</h2><textarea id="journey-draft" placeholder="여기에 한국어로 써 보세요...">${esc(draft)}</textarea><div class="writing-tools"><span>✎ 이 글은 이 브라우저에만 저장돼요.</span><button class="small-primary" data-action="journey-save-writing">글 저장하기</button></div>${s.saved?'<div class="activity-feedback success">✓ 글을 저장했어요.</div>':''}<div class="self-check"><strong>스스로 확인하기 · Self-check</strong><label><input type="checkbox"> 주제에 맞는 말을 썼어요.</label><label><input type="checkbox"> 오늘 배운 단어를 썼어요.</label><label><input type="checkbox"> 문장을 소리 내어 읽었어요.</label></div></div>`;
  } else {
    const q=unit.quiz[s.quizIndex];
    body=`<div class="journey-intro"><span class="eyebrow">FINAL CHECK · 마무리 퀴즈</span><h1>오늘 배운 것을 확인해요</h1><p>정답을 고르고 피드백을 확인해 보세요. ${s.quizIndex+1}/${unit.quiz.length}문제</p></div>${choiceBlock(q,s,esc,state.language)}${s.answerChecked&&s.answerChoice===q.answer?`<div class="quiz-ready">✓ 정답을 확인했어요. 다음을 눌러 계속하세요.</div>`:''}`;
  }
  const helpKey=stage.startsWith('scene')?'scene':stage.startsWith('words')?'words':stage.startsWith('grammar')?'grammar':stage.startsWith('practice')?'practice':stage;
  const currentGrammar=stage==='grammar1'?unit.grammar[0]:stage==='grammar2'?unit.grammar[1]:null;
  const nativeText=`${t(state.language,helpKey)}${currentGrammar&&grammarHelp(state.language,currentGrammar.pattern)?` ${grammarHelp(state.language,currentGrammar.pattern)}`:''}`;
  body=`<div class="native-help"><span>🌐 ${esc(state.language.toUpperCase())} · ${state.language==='ko'?'학습 안내':'GUIDE'}</span><p>${esc(nativeText)}</p></div>${body}`;
  const pct=Math.round(index/journeyStages.length*100);
  const groups=[['대화 1',0,3],['대화 2',4,7],['듣고 말하기',8,9],['읽고 쓰기',10,11],['마무리',12,12]];
  return chrome(`<button class="back-link" data-action="units">← ${esc(ui(state.language,'units'))}</button><div class="journey-header"><div><span class="eyebrow">${unit.unitId.slice(1)} LESSON · ${esc(unit.title)}</span><strong>${stageNames[stage]}</strong></div><span>${index+1} / ${journeyStages.length} 활동</span></div><div class="journey-progress"><div style="width:${pct}%"></div></div><div class="journey-groups">${groups.map(([name,start,end])=>`<span class="${index>=start&&index<=end?'on':index>end?'done':''}">${index>end?'✓ ':''}${name}</span>`).join('')}</div>${body}${nav(s,state.language)}`,'units');
}
