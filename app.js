import { renderJourney, journeyStages, puzzleTokens } from './journey.js';
import { t, ui, languageOptions } from './i18n.js';
import { unitTranslation } from './content-translations.js';
const $app = document.querySelector('#app');
const STORAGE = 'korean-journey-v1';
const steps = ['vocabulary', 'grammar', 'dialogue', 'quiz'];
const labels = { vocabulary: '어휘', grammar: '문법', dialogue: '대화', quiz: '퀴즈' };
const state = { manifest: null, unit: null, vocabulary: [], vocabularyIndexById: {}, screen: 'home', step: 'vocabulary', card: 0, grammar: 0, quiz: 0, choice: null, checked: false, hint: 0, showMeaning: false, matching: [], selectedMatch: null, diagnostic: 0, notice: '', language: localStorage.getItem('korean-journey-language')||'ko', sidebarCollapsed: localStorage.getItem('korean-journey-sidebar-collapsed')==='true', mobileMenuOpen: false, journey: null };

function readProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE)) || {}; } catch { return {}; }
}
let progress = { completed: [], xp: 0, reviews: {}, lastStudy: null, streak: 0, awarded: [], ...readProgress() };
function save() { localStorage.setItem(STORAGE, JSON.stringify(progress)); }
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function today() { return new Date().toLocaleDateString('en-CA'); }
function study() {
  const date = today();
  if (progress.lastStudy === date) return;
  const previous = new Date(); previous.setDate(previous.getDate() - 1);
  progress.streak = progress.lastStudy === previous.toLocaleDateString('en-CA') ? progress.streak + 1 : 1;
  progress.lastStudy = date; save();
}
function reward(key, xp) {
  if (progress.awarded.includes(key)) return;
  progress.awarded.push(key); progress.xp += xp; study(); save();
}
function schedule(id, correct) {
  const current = progress.reviews[id] || { interval: 0, ease: 2.5 };
  const interval = correct ? (current.interval === 0 ? 1 : current.interval === 1 ? 3 : Math.max(4, Math.round(current.interval * current.ease))) : 1;
  const date = new Date(); date.setDate(date.getDate() + (correct ? interval : 0));
  progress.reviews[id] = { interval, ease: Math.max(1.3, current.ease + (correct ? 0.1 : -0.2)), dueAt: date.toLocaleDateString('en-CA'), lastResult: correct };
  study(); save();
}
function dueCount() { return Object.values(progress.reviews).filter(x => x.dueAt <= today()).length; }
function icon(name) { return `<span aria-hidden="true">${name}</span>`; }
function languagePicker(className='') {return `<label class="language-select ${className}"><span>🌐 ${esc(ui(state.language,'language'))}</span><select class="language-picker" aria-label="${esc(ui(state.language,'language'))}">${languageOptions.map(([code,label])=>`<option value="${code}" ${state.language===code?'selected':''}>${label}</option>`).join('')}</select></label>`;}
function chrome(content, active='learn') {
  const complete = progress.completed.length;
  return `<div class="shell ${state.sidebarCollapsed?'sidebar-collapsed':''} ${state.mobileMenuOpen?'mobile-menu-open':''} ${state.screen==='lesson'?'lesson-screen':''}"><aside class="sidebar" id="course-sidebar"><button class="mobile-menu-close" data-action="close-mobile-menu" aria-label="메뉴 닫기">×</button>
    <button class="brand" data-action="home" aria-label="모모 한국어 강좌 홈"><span class="brand-badge"><span class="brand-logo-window"><img src="/momo-logo-transparent.png" alt="모니터 모양의 모모 로고"></span><span class="brand-course-name">한국어 강좌</span></span><span class="brand-caption">하루 한 걸음</span></button>
    <div class="side-section">LEARN</div>
    <button class="nav ${active==='learn'?'active':''}" data-action="home">${icon('▦')} ${esc(ui(state.language,'dashboard'))}</button>
    <button class="nav ${active==='units'?'active':''}" data-action="units">${icon('◫')} ${esc(ui(state.language,'units'))}</button>
    <button class="nav ${active==='review'?'active':''}" data-action="review">${icon('↻')} ${esc(ui(state.language,'review'))} <span class="nav-count">${dueCount()}</span></button>
    ${languagePicker('sidebar-language')}
    <div class="side-section side-section-later">MY JOURNEY</div>
    <div class="side-stat"><span>✦</span><div><strong>${progress.xp} XP</strong><small>모은 경험치</small></div></div>
    <div class="side-stat"><span>♨</span><div><strong>${progress.streak}일 연속</strong><small>학습 스트릭</small></div></div>
    <div class="sidebar-bottom"><div class="avatar">배</div><div><strong>배우는 사람</strong><small>초급 학습자</small></div><span>⋯</span></div>
  </aside><button class="mobile-backdrop" data-action="close-mobile-menu" aria-label="메뉴 닫기"></button><main class="main"><header class="topbar"><div class="topbar-start"><button class="sidebar-toggle" data-action="toggle-sidebar" aria-controls="course-sidebar" aria-expanded="${!state.sidebarCollapsed}" aria-label="${state.sidebarCollapsed?'왼쪽 패널 펼치기':'왼쪽 패널 숨기기'}" title="${state.sidebarCollapsed?'왼쪽 패널 펼치기':'왼쪽 패널 숨기기'}">${state.sidebarCollapsed?'☰':'‹'}</button><button class="mobile-menu-toggle" data-action="toggle-mobile-menu" aria-controls="course-sidebar" aria-expanded="${state.mobileMenuOpen}" aria-label="${state.mobileMenuOpen?'메뉴 닫기':'메뉴 열기'}">${state.mobileMenuOpen?'×':'☰'}</button><span class="breadcrumb">나의 학습 여정 <span class="crumb-arrow">›</span> ${active==='units'?'전체 단원':active==='review'?'복습':'세종한국어 2'}</span></div><div class="topstats">${languagePicker('mobile-language')}<span>♨ ${progress.streak}일</span><span>✦ ${progress.xp} XP</span><span class="top-avatar">배</span></div></header><div class="content">${content}</div></main></div>`;
}
function guide(key){return `<div class="native-help page-guide"><span>🌐 ${esc(state.language.toUpperCase())} · ${state.language==='ko'?'학습 안내':'GUIDE'}</span><p>${esc(t(state.language,key))}</p></div>`;}
function home() {
  const total = state.manifest.units.length;
  const pct = Math.round(progress.completed.length / total * 100);
  const next = state.manifest.units.find(x => !progress.completed.includes(x.unitId)) || state.manifest.units.at(-1);
  const first = state.manifest.units.slice(0, 4);
  return chrome(`${guide('home')}<div class="eyebrow">YOUR LEARNING JOURNEY <span class="sparkle">✦</span></div><div class="heading-row"><div><h1>오늘도 한 걸음,<br><em>한국어와 더 가까이</em></h1><p class="lead">작은 배움이 모여 큰 자신감이 돼요. 오늘의 여정을 시작해 볼까요?</p></div><div class="flower" aria-hidden="true"><span>✳</span><i>✦</i></div></div>
    <section class="hero"><div class="hero-copy"><span class="pill">✦ LEVEL 2 · 초급</span><h2>세종한국어 2</h2><p>일상 속 자연스러운 한국어, 한 걸음씩 함께 배워요.</p><div class="hero-progress"><div><span>학습 진행률</span><strong>${pct}%</strong></div><div class="bar"><div style="width:${pct}%"></div></div><small>${completeText()} / ${total}개 단원 완료</small></div><button class="primary light" data-action="${next.unitId==='u01'?'start':'units'}">${progress.completed.length?esc(ui(state.language,'units')):esc(ui(state.language,'start'))} <span>↗</span></button></div><div class="hero-art" aria-hidden="true"><div class="orbit o1"></div><div class="orbit o2"></div><span class="bubble b1">안녕하세요!</span><span class="big-book">📖</span><span class="bubble b2">잘 지내요?</span><span class="mini-star">✳</span></div></section>
    <div class="section-head"><div><span class="eyebrow">AT A GLANCE</span><h3>나의 학습 현황</h3></div><button class="text-link" data-action="units">전체 단원 보기 <span>→</span></button></div>
    <div class="stats"><div class="stat"><span class="stat-icon peach">◫</span><div><small>완료한 단원</small><strong>${completeText()}<span> / ${total}</span></strong></div></div><div class="stat"><span class="stat-icon yellow">✦</span><div><small>획득한 XP</small><strong>${progress.xp}<span> XP</span></strong></div></div><div class="stat"><span class="stat-icon mint">♨</span><div><small>연속 학습</small><strong>${progress.streak}<span> 일</span></strong></div></div></div>
    <div class="section-head lower"><div><span class="eyebrow">EXPLORE & LEARN</span><h3>이어서 배워 볼까요?</h3></div><button class="text-link" data-action="units">모든 단원 <span>→</span></button></div>
    <div class="unit-preview">${first.map((u,i)=>unitCard(u,i)).join('')}</div><div class="footer-note">✦ 하루에 한 걸음씩, 충분해요.</div>`, 'learn');
}
function completeText() { return progress.completed.length; }
function unitCard(u, i) {
  const done = progress.completed.includes(u.unitId), available = !!u.content, locked = !!u.unlockAfter && !progress.completed.includes(u.unlockAfter);
  const status = done?'완료':!available?'준비 중':locked?'잠김':'학습 가능';
  return `<button class="unit-card ${locked||!available?'muted':''}" data-action="open-unit" data-id="${u.unitId}"><div class="unit-card-top"><span class="unit-emoji">${u.icon}</span><span class="unit-state ${done?'done':''}">${done?'✓ ':locked?'⌁ ':''}${status}</span></div><small>${u.kind==='culture'?'문화 코너':`${u.unitId.slice(1)} LESSON`}</small><strong>${esc(u.title)}</strong><span class="unit-arrow">↗</span></button>`;
}
function units() {
  return chrome(`${guide('units')}<div class="page-head"><div class="eyebrow">THE ROAD AHEAD ✦</div><h1>배움의 지도</h1><p>순서대로 배우며 한국어의 세계를 넓혀 보세요.</p></div><div class="course-summary"><span>🌿</span><div><strong>세종한국어 2 · 초급 과정</strong><small>14개 단원과 4개의 문화 코너</small></div><div class="course-bar"><div style="width:${Math.round(progress.completed.length/18*100)}%"></div></div><b>${progress.completed.length}/18</b></div><div class="unit-grid">${state.manifest.units.map(unitCard).join('')}</div>`, 'units');
}
function openUnit(id) {
  const item = state.manifest.units.find(x => x.unitId === id);
  if (!item) return;
  if (!item.content) { state.notice = '이 단원은 자료가 도착하면 열릴 예정이에요.'; render(); return; }
  if (item.unlockAfter && !progress.completed.includes(item.unlockAfter)) { state.notice = '앞 단원을 완료하면 열려요. 보상 없이 둘러볼 수 있어요.'; state.lockedId = id; render(); return; }
  loadUnit(item);
}
async function loadUnit(item, explore=false) {
  const res = await fetch(item.content);
  state.unit = await res.json(); state.step=state.unit.kind==='culture'?'culture':'scene1'; state.journey={step:'scene1',answerChoice:null,answerChecked:false,hintLevel:0,puzzleSelected:[],puzzleChecked:false,quizIndex:0,transcript:false,draft:localStorage.getItem('korean-journey-draft-'+state.unit.unitId)||'',saved:false}; state.card=0; state.grammar=0; state.quiz=0; state.choice=null; state.checked=false; state.hint=0; state.explore=explore; state.screen='lesson'; state.notice=''; render();
}
function lesson() {
  if(state.unit.kind==='culture') return cultureLesson();
  return renderJourney({unit:state.unit,state,chrome,esc,manifest:state.manifest});
  const unit=state.unit, index=steps.indexOf(state.step), pct=((index+(state.step==='vocabulary'?state.card/unit.vocabulary.length:state.step==='grammar'?state.grammar/unit.grammar.length:state.step==='quiz'?state.quiz/unit.quiz.length:0))/4)*100;
  let body='';
  if(state.step==='vocabulary') {
    const v=unit.vocabulary[state.card];
    body=`<div class="lesson-title"><span class="eyebrow">STEP 01 · WORDS TO KNOW</span><h1>오늘의 단어를 만나요</h1><p>카드를 눌러 뜻을 확인하고, 소리 내어 읽어 보세요.</p></div><div class="flash-wrap"><div class="flash-count">${state.card+1} / ${unit.vocabulary.length}</div><button class="flash-card ${state.showMeaning?'flipped':''}" data-action="flip"><span class="flash-decoration">✳</span><small>${state.showMeaning?'뜻 확인하기':'KOREAN WORD'}</small><strong>${esc(v.ko)}</strong><span class="roman">${esc(v.romanization)}</span><span class="meaning">${state.showMeaning?esc(v.meaning):'카드를 눌러 뜻 보기 ↗'}</span></button><div class="flash-actions"><button class="secondary" data-action="vocab-answer" data-correct="false">다시 볼래요</button><button class="primary" data-action="vocab-answer" data-correct="true">알겠어요 <span>→</span></button></div><small class="help">선택한 단어는 복습 일정에 자동으로 담겨요.</small></div>`;
  } else if(state.step==='grammar') {
    const g=unit.grammar[state.grammar];
    body=`<div class="lesson-title"><span class="eyebrow">STEP 02 · GRAMMAR</span><h1>문장을 만드는 방법</h1><p>규칙을 읽고 예문에서 어떻게 쓰이는지 살펴봐요.</p></div><div class="grammar-card"><div class="grammar-index">문법 ${state.grammar+1} / ${unit.grammar.length}</div><h2>${esc(g.pattern)}</h2><p>${esc(g.explanation)}</p><div class="example-label">EXAMPLE SENTENCES</div>${g.examples.map(x=>`<div class="example"><strong>${esc(x.ko)}</strong><span>${esc(x.meaning)}</span></div>`).join('')}</div><div class="step-actions"><button class="secondary" data-action="back-step">← 이전</button><button class="primary" data-action="next-grammar">${state.grammar<unit.grammar.length-1?'다음 문법':'대화로 넘어가기'} →</button></div>`;
  } else if(state.step==='dialogue') {
    body=`<div class="lesson-title"><span class="eyebrow">STEP 03 · REAL CONVERSATION</span><h1>대화 속에서 써 봐요</h1><p>친구들이 안부를 묻는 장면이에요. 뜻은 직접 열어 볼 수 있어요.</p></div><div class="dialogue-card"><div class="dialogue-top"><span>☕ 카페에서 만난 두 친구</span><button class="small-button" data-action="toggle-meaning">${state.showMeaning?'번역 숨기기':'번역 보기'}</button></div>${unit.dialogue.lines.map((l,i)=>`<div class="speech ${i%2?'right':''}"><div class="person">${esc(l.speaker.slice(0,1))}</div><div><small>${esc(l.speaker)}</small><p>${esc(l.text)}</p>${state.showMeaning?`<span>${esc(l.meaning)}</span>`:''}</div></div>`).join('')}</div><div class="step-actions"><button class="secondary" data-action="back-step">← 이전</button><button class="primary" data-action="next-step">퀴즈 풀기 →</button></div>`;
  } else {
    const q=unit.quiz[state.quiz];
    body=`<div class="lesson-title"><span class="eyebrow">STEP 04 · QUICK CHECK</span><h1>배운 것을 확인해요</h1><p>틀려도 괜찮아요. 힌트를 보며 다시 생각해 봐요.</p></div><div class="quiz-card"><div class="quiz-top"><span>문제 ${state.quiz+1} / ${unit.quiz.length}</span><span>+50 XP를 향해 ✦</span></div><h2>${esc(q.question)}</h2><div class="choices">${q.choices.map((x,i)=>`<button class="choice ${state.choice===i?'selected':''} ${state.checked&&i===q.answer?'correct':''} ${state.checked&&state.choice===i&&i!==q.answer?'wrong':''}" data-action="choice" data-index="${i}" ${state.checked?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(x)}${state.checked&&i===q.answer?'<b>✓</b>':''}</button>`).join('')}</div>${state.hint?`<div class="hint">💡 ${esc(q.hint[Math.min(state.hint-1,2)])}</div>`:''}${state.checked?`<div class="feedback ${state.choice===q.answer?'positive':''}"><strong>${state.choice===q.answer?'정답이에요!':'한 번 더 생각해 볼까요?'}</strong><span>${esc(q.explanation)}</span></div>`:''}<div class="quiz-actions"><button class="secondary" data-action="hint" ${state.hint>=3?'disabled':''}>힌트 ${state.hint}/3</button><button class="primary" data-action="check" ${state.choice===null?'disabled':''}>${state.checked?(state.choice===q.answer?'다음 문제 →':'다시 풀기'):'정답 확인'}</button></div></div>`;
  }
  return chrome(`<button class="back-link" data-action="units">← 전체 단원</button><div class="lesson-progress"><div><strong>${unit.unitId.slice(1)} · ${esc(unit.title)}</strong><span>${labels[state.step]} · ${index+1}/4 단계</span></div><div class="bar"><div style="width:${pct}%"></div></div></div><div class="stepper">${steps.map((s,i)=>`<span class="${i===index?'current':i<index?'past':''}"><i>${i<index?'✓':i+1}</i>${labels[s]}</span>`).join('')}</div>${body}`, 'units');
}
function cultureLesson() {
  const u=state.unit,q=u.comprehension;
  return chrome(`<button class="back-link" data-action="units">← 전체 단원</button><div class="native-help"><span>🌐 ${esc(state.language.toUpperCase())} · ${state.language==='ko'?'학습 안내':'GUIDE'}</span><p>${esc(t(state.language,'culture'))}</p></div><div class="lesson-title"><span class="eyebrow">CULTURE CORNER ✦</span><h1>${esc(u.title)}</h1><p>글을 읽고 한 가지 질문에 답해 보세요.</p></div><div class="culture-card"><div class="culture-illustration">${state.manifest.units.find(x=>x.unitId===u.unitId)?.icon||'🌿'}</div><span class="eyebrow">READ & DISCOVER</span><p>${esc(u.reading)}</p></div><div class="quiz-card culture-quiz"><div class="quiz-top"><span>이해도 확인 · 1문항</span></div><h2>${esc(q.question)}</h2><div class="choices">${q.choices.map((x,i)=>`<button class="choice ${state.choice===i?'selected':''} ${state.checked&&i===q.answer?'correct':''} ${state.checked&&state.choice===i&&i!==q.answer?'wrong':''}" data-action="choice" data-index="${i}" ${state.checked?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(x)}</button>`).join('')}</div>${state.checked?`<div class="feedback ${state.choice===q.answer?'positive':''}"><strong>${state.choice===q.answer?'정답이에요!':'다시 읽고 골라 보세요.'}</strong></div>`:''}<div class="quiz-actions"><span></span><button class="primary" data-action="check-culture" ${state.choice===null?'disabled':''}>${state.checked?(state.choice===q.answer?'완료하기 →':'다시 풀기'):'정답 확인'}</button></div></div>`, 'units');
}
function result() {
  return chrome(`<div class="result"><div class="result-confetti">✳ <span>✦</span> ✳</div><div class="result-badge">🏅</div><span class="eyebrow">LESSON COMPLETE</span><h1>${esc(state.unit.title)} 완료!</h1><p>오늘도 한국어와 한 걸음 더 가까워졌어요.</p><div class="result-xp">${state.justCompleted?`✦ +${state.unit.rewards.xpOnComplete} XP <span>·</span> ${esc(state.unit.rewards.badge)} 배지`:'학습 내용 다시 보기 완료'}</div><div class="result-actions"><button class="secondary" data-action="review">복습하러 가기</button><button class="primary" data-action="units">다음 단원 보기 →</button></div></div>`, 'units');
}
function review() {
  const all=state.vocabulary;
  const due=all.filter(v=>progress.reviews[v.id]?.dueAt<=today());
  return chrome(`${guide('review')}<button class="back-link" data-action="home">← 대시보드</button><div class="page-head"><div class="eyebrow">SPACED REPETITION ✦</div><h1>오늘의 복습</h1><p>잊기 전에 한 번 더. 기억이 오래 남는 작은 습관이에요.</p></div><div class="review-panel"><div class="review-illustration">↻</div><h2>${due.length?`${due.length}개 단어가 기다려요`:'오늘 복습을 마쳤어요!'}</h2><p>${due.length?'단어를 떠올리고 기억 정도를 선택해 주세요.':'새 단어를 배우면 복습 일정이 자동으로 생겨요.'}</p>${due.length?`<div class="review-word"><strong>${esc(due[0].ko)}</strong><span>${state.showMeaning?esc(state.language==='en'?due[0].meaning:unitTranslation(state.vocabularyIndexById[due[0].id]?.unitId,state.language,'v',state.vocabularyIndexById[due[0].id]?.index)||'번역 준비 중'):'뜻을 떠올려 보세요'}</span></div><button class="secondary" data-action="toggle-meaning">${state.showMeaning?'뜻 숨기기':'뜻 보기'}</button><div class="review-buttons"><button class="secondary" data-action="review-answer" data-correct="false">다시 볼래요</button><button class="primary" data-action="review-answer" data-correct="true">기억했어요</button></div>`:`<button class="primary" data-action="units">단원 둘러보기 →</button>`}</div>`, 'review');
}
function render() {
  $app.innerHTML = state.screen==='home'?home():state.screen==='units'?units():state.screen==='lesson'?lesson():state.screen==='result'?result():review();
  if(state.notice) $app.insertAdjacentHTML('beforeend', `<div class="toast" role="status">${esc(state.notice)} ${state.lockedId?'<button data-action="explore">둘러보기</button>':''}<button data-action="dismiss">×</button></div>`);
  syncSidebarAccess();
}
function syncSidebarAccess() {
  const sidebar=$app.querySelector?.('#course-sidebar');
  if(!sidebar) return;
  const mobile=window.matchMedia?.('(max-width:1100px)').matches ?? false;
  const hidden=mobile?!state.mobileMenuOpen:state.sidebarCollapsed;
  sidebar.toggleAttribute('inert',hidden);
  if(hidden) sidebar.setAttribute('aria-hidden','true'); else sidebar.removeAttribute('aria-hidden');
}
function setMobileMenu(open) {
  state.mobileMenuOpen=open;
  $app.querySelector('.shell')?.classList.toggle('mobile-menu-open',open);
  const button=$app.querySelector('.mobile-menu-toggle');
  if(button){button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');button.textContent=open?'×':'☰';}
  syncSidebarAccess();
  if(open) $app.querySelector('#course-sidebar .brand')?.focus(); else button?.focus();
}
function nextStep() { state.step=steps[steps.indexOf(state.step)+1]; state.showMeaning=false; render(); window.scrollTo(0,0); }
function finish() {
  state.justCompleted=!state.explore && !progress.completed.includes(state.unit.unitId);
  if(state.justCompleted) { progress.completed.push(state.unit.unitId); reward('complete:'+state.unit.unitId,state.unit.rewards.xpOnComplete); save(); }
  state.screen='result'; render(); window.scrollTo(0,0);
}
$app.addEventListener('click', async e => {
  const el=e.target.closest('[data-action]'); if(!el) return;
  const a=el.dataset.action;
  if(a==='toggle-sidebar') {
    state.sidebarCollapsed=!state.sidebarCollapsed;
    localStorage.setItem('korean-journey-sidebar-collapsed',state.sidebarCollapsed);
    $app.querySelector('.shell').classList.toggle('sidebar-collapsed',state.sidebarCollapsed);
    syncSidebarAccess();
    const label=state.sidebarCollapsed?'왼쪽 패널 펼치기':'왼쪽 패널 숨기기';
    el.setAttribute('aria-expanded',String(!state.sidebarCollapsed));
    el.setAttribute('aria-label',label);
    el.title=label;
    el.textContent=state.sidebarCollapsed?'☰':'‹';
    return;
  }
  if(a==='toggle-mobile-menu'||a==='close-mobile-menu') {setMobileMenu(a==='toggle-mobile-menu'?!state.mobileMenuOpen:false);return;}
  if(a==='home'||a==='units'||a==='review') { state.mobileMenuOpen=false;state.screen=a; state.notice=''; state.showMeaning=false; render(); window.scrollTo(0,0); return; }
  if(a==='start') { openUnit('u01'); return; }
  if(a==='open-unit') { openUnit(el.dataset.id); return; }
  if(a==='dismiss') { state.notice=''; render(); return; }
  if(a==='explore') {const item=state.manifest.units.find(x=>x.unitId===state.lockedId);state.lockedId=null;loadUnit(item,true);return;}
  if(a==='journey-tts') { speak(el.dataset.text); return; }
  if(a==='journey-transcript') {state.journey.transcript=!state.journey.transcript;render();return;}
  if(a==='journey-choice') {state.journey.answerChoice=Number(el.dataset.index);render();return;}
  if(a==='journey-check') {const j=state.journey;if(j.answerChecked&&j.answerChoice!==currentJourneyQuestion().answer){j.answerChecked=false;j.answerChoice=null;}else {j.answerChecked=true;if(j.answerChoice===currentJourneyQuestion().answer)state.notice='';}render();return;}
  if(a==='journey-hint') {state.journey.hintLevel=Math.min(3,state.journey.hintLevel+1);render();return;}
  if(a==='journey-token') {const j=state.journey,index=Number(el.dataset.index);if(!j.puzzleSelected.includes(index)){j.puzzleSelected.push(index);j.puzzleChecked=false;render();}return;}
  if(a==='journey-puzzle-clear') {state.journey.puzzleSelected=[];state.journey.puzzleChecked=false;render();return;}
  if(a==='journey-puzzle-check') {const j=state.journey;const {ordered,mixed}=puzzleTokens(state.unit,j.step);j.puzzleChecked=true;if(j.puzzleSelected.map(i=>mixed[i]).join(' ')===ordered.join(' '))state.notice='';render();return;}
  if(a==='journey-next') { journeyNext(); return; }
  if(a==='journey-prev') {const j=state.journey;const i=journeyStages.indexOf(j.step);if(i>0){if(j.step==='writing')j.draft=document.querySelector('#journey-draft')?.value||j.draft;j.step=journeyStages[i-1];j.answerChoice=null;j.answerChecked=false;j.hintLevel=0;j.puzzleSelected=[];j.puzzleChecked=false;render();window.scrollTo(0,0);}return;}
  if(a==='journey-save-writing') {const draft=document.querySelector('#journey-draft')?.value||'';state.journey.draft=draft;state.journey.saved=true;localStorage.setItem('korean-journey-draft-'+state.unit.unitId,draft);render();return;}
  if(a==='flip'||a==='toggle-meaning') { state.showMeaning=!state.showMeaning; render(); return; }
  if(a==='vocab-answer') { const v=state.unit.vocabulary[state.card]; if(!state.explore)schedule(v.id,el.dataset.correct==='true'); state.showMeaning=false; if(state.card<state.unit.vocabulary.length-1) state.card++; else nextStep(); render(); return; }
  if(a==='next-grammar') { if(state.grammar<state.unit.grammar.length-1) {state.grammar++;render();} else nextStep(); return; }
  if(a==='back-step') {state.step=steps[steps.indexOf(state.step)-1];render();return;}
  if(a==='next-step') {nextStep();return;}
  if(a==='choice') {state.choice=Number(el.dataset.index);render();return;}
  if(a==='hint') {state.hint=Math.min(3,state.hint+1);render();return;}
  if(a==='check') {
    if(!state.checked) {state.checked=true; if(!state.explore && state.choice===state.unit.quiz[state.quiz].answer) reward('quiz:'+state.unit.unitId+':'+state.quiz,5); render();}
    else if(state.choice!==state.unit.quiz[state.quiz].answer) {state.checked=false;state.choice=null;render();}
    else if(state.quiz<state.unit.quiz.length-1) {state.quiz++;state.choice=null;state.checked=false;state.hint=0;render();}
    else finish();
    return;
  }
  if(a==='check-culture') {
    if(!state.checked) {state.checked=true;render();}
    else if(state.choice!==state.unit.comprehension.answer) {state.checked=false;state.choice=null;render();}
    else finish();
    return;
  }
  if(a==='review-answer') {const v=state.vocabulary.find(x=>progress.reviews[x.id]?.dueAt<=today());if(v) {schedule(v.id,el.dataset.correct==='true');if(el.dataset.correct==='true') reward('review:'+v.id+':'+today(),3);}state.showMeaning=false;render();}
});
$app.addEventListener('change', e=>{if(e.target.matches('.language-picker')){if(state.journey?.step==='writing')state.journey.draft=document.querySelector('#journey-draft')?.value||state.journey.draft;state.language=e.target.value;localStorage.setItem('korean-journey-language',state.language);render();}});
window.addEventListener?.('resize',syncSidebarAccess);
window.addEventListener?.('keydown',e=>{if(e.key==='Escape'&&state.mobileMenuOpen)setMobileMenu(false);});
function speak(value){
  if(!('speechSynthesis' in window)){state.notice=t(state.language,'speechUnavailable');render();return;}
  window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(value);utterance.lang='ko-KR';utterance.rate=.82;window.speechSynthesis.speak(utterance);
}
function currentJourneyQuestion(){const j=state.journey;return j.step==='listening'?state.unit.listening.question:j.step==='reading'?state.unit.reading.question:j.step==='practice1'?state.unit.dialoguePractice.one.question:j.step==='practice2'?state.unit.dialoguePractice.two.question:state.unit.quiz[j.quizIndex];}
function journeyNext(){
  const j=state.journey;
  if(['practice1','practice2','listening','reading','quiz'].includes(j.step)&&(!j.answerChecked||j.answerChoice!==currentJourneyQuestion().answer)){state.notice=t(state.language,'answerFirst');render();return;}
  if(j.step==='practice1'||j.step==='practice2'){
    const {ordered,mixed}=puzzleTokens(state.unit,j.step);
    if(!j.puzzleChecked||j.puzzleSelected.map(i=>mixed[i]).join(' ')!==ordered.join(' ')){state.notice=t(state.language,'puzzleFirst');render();return;}
  }
  state.notice='';
  if(j.step==='quiz'&&j.quizIndex<state.unit.quiz.length-1){if(!state.explore)reward('quiz:'+state.unit.unitId+':'+j.quizIndex,5);j.quizIndex++;j.answerChoice=null;j.answerChecked=false;j.hintLevel=0;render();return;}
  if(j.step==='quiz'){if(!state.explore)reward('quiz:'+state.unit.unitId+':'+j.quizIndex,5);finish();return;}
  if(j.step==='writing'){const draft=document.querySelector('#journey-draft')?.value||'';j.draft=draft;localStorage.setItem('korean-journey-draft-'+state.unit.unitId,draft);}
  j.step=journeyStages[journeyStages.indexOf(j.step)+1];
  if(!state.explore&&(j.step==='words1'||j.step==='words2')){
    const words=state.unit.vocabulary.filter(v=>v.part===(j.step==='words1'?1:2));
    const date=new Date();date.setDate(date.getDate()+1);
    for(const word of words)if(!progress.reviews[word.id])progress.reviews[word.id]={interval:1,ease:2.5,dueAt:date.toLocaleDateString('en-CA'),lastResult:null};
    save();
  }
  j.answerChoice=null;j.answerChecked=false;j.hintLevel=0;j.puzzleSelected=[];j.puzzleChecked=false;j.saved=false;render();window.scrollTo(0,0);
}

async function init() {
  try { const res=await fetch('/content/manifest.json'); state.manifest=await res.json(); const contents=await Promise.all(state.manifest.units.map(async item=>{const r=await fetch(item.content);return r.json();}));state.vocabulary=contents.flatMap(x=>x.vocabulary);state.vocabularyIndexById=Object.fromEntries(contents.flatMap(u=>u.vocabulary.map((v,index)=>[v.id,{unitId:u.unitId,index}])));state.unit=contents[0];state.screen='home';const linked=state.manifest.units.find(x=>`#${x.unitId}`===location.hash);if(linked&&linked.unitId==='u01')await loadUnit(linked);else render(); }
  catch { $app.innerHTML='<div class="load-error">앱을 불러오지 못했어요. 개발 서버에서 다시 열어 주세요.</div>'; }
}
init();
