// Each recurring speaker keeps the same illustrated face throughout the course.
const names=['하나','다니엘','나영','준호','지수','에밀','리나','도윤','유진','현우','서연','마테오','다혜','민호','소라','지안','민아','아린','현수','윤아','정민','루카','혜진','보라','태오','나래','레오'];
const skin=['#f5c7a9','#e8ad84','#d99671','#bd805d'];
const hair=['#292a36','#67442f','#352a28','#915a39','#202f3a'];
const shirt=['#6aa989','#db8f76','#8a9fc8','#c4a16c','#9f86b5','#6cabb8'];

export function avatarFor(name){
  const known=names.indexOf(name);
  const id=known<0?[...name].reduce((sum,ch)=>sum+ch.codePointAt(0),0):known;
  const face=skin[(id*3)%skin.length],locks=hair[(id*7)%hair.length],top=shirt[(id*5)%shirt.length];
  const hairline=[
    '<path d="M15 29Q13 9 32 10Q52 9 49 31L43 24Q28 29 19 23Z"/>',
    '<path d="M14 30Q11 8 32 10Q52 8 50 31Q44 21 37 20Q30 28 18 25Z"/>',
    '<path d="M14 29Q17 8 33 10Q52 11 49 31L45 22Q33 17 20 25Z"/>',
    '<path d="M14 31Q11 9 31 10Q51 7 50 32L45 24Q34 28 20 23Z"/>'
  ][id%4];
  const glasses=id%5===1?'<path d="M21 31h9m4 0h9M30 31h4" stroke="#465b65" stroke-width="1.7"/><circle cx="25" cy="31" r="5" fill="none" stroke="#465b65" stroke-width="1.5"/><circle cx="39" cy="31" r="5" fill="none" stroke="#465b65" stroke-width="1.5"/>':'';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img"><rect width="64" height="64" rx="32" fill="#eef3eb"/><path d="M8 64Q9 50 23 47L32 51L41 47Q55 50 56 64" fill="${top}"/><path d="M27 44h10v10H27z" fill="${face}"/><ellipse cx="32" cy="31" rx="18" ry="21" fill="${face}"/><path d="${hairline.slice(9,-3)}" fill="${locks}"/><circle cx="26" cy="32" r="1.4" fill="#383536"/><circle cx="38" cy="32" r="1.4" fill="#383536"/><path d="M28 40Q32 43 36 40" fill="none" stroke="#a45c58" stroke-width="1.6" stroke-linecap="round"/>${glasses}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
