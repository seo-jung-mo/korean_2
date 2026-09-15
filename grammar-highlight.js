// Highlight the form being taught, leaving the full sentence available for TTS.
const forms={
  '-고':/고(?=\s)/g,'그런데':/그런데/g,'못':/못(?=\s)/g,
  '-아서/어서':/아서|어서|와서/g,'-(으)ㄹ래요':/을래요|실래요|ㄹ래요/g,'무슨':/무슨/g,
  '이/가 걸리다':/걸려요/g,'-에서 -까지':/에서|까지/g,'(으)로':/으로|로(?=\s)/g,
  '-아/어서':/어서|아서|서(?=\s)/g,'-아/어 주다':/주세요/g,'-지요?':/지요/g,'-(으)ㄴ':/큰|긴/g,
  '-고 있다':/고\s있(?:어요|는)/g,'의':/의(?=\s|[가-힣])/g,'-(으)시-':/세요/g,
  '-아/어 보다':/봤어요|봐요/g,'-고 싶다':/고\s싶어요/g,'-지 말다':/지\s마세요/g,
  '-(으)ㄴ 후에':/[은한]\s후에/g,'-아야/어야 하다':/해야\s해요|워야\s해요/g,
  '-(으)ㄹ게요':/게요/g,'-지만':/지만/g,'보다':/보다/g,
  '-(으)ㄹ 때':/[을ㄹ]\s때/g,'-(으)러 가다':/러(?=\s)/g,
  '-(으)려고':/려고/g,'-(으)면':/으면/g
};

export function highlightGrammar(sentence,pattern,escape){
  const matcher=forms[pattern];
  if(!matcher)return escape(sentence);
  let result='',cursor=0;
  for(const match of sentence.matchAll(matcher)){
    result+=escape(sentence.slice(cursor,match.index));
    result+=`<mark class="grammar-highlight">${escape(match[0])}</mark>`;
    cursor=match.index+match[0].length;
  }
  return result+escape(sentence.slice(cursor));
}
