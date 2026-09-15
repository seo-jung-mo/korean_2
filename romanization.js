const initials = ['g','kk','n','d','tt','r','m','b','pp','s','ss','ng','j','jj','ch','k','t','p','h'];
const vowels = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const finals = ['', 'k','k','ks','n','nj','nh','t','l','lk','lm','lb','ls','lt','lp','lh','m','p','ps','t','t','ng','t','t','k','t','p','h'];

export function romanizeKorean(value) {
  return String(value).split(/(\s+)/).map(part => {
    if (/^\s+$/.test(part)) return part;
    return Array.from(part).map(char => {
      const code = char.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) return char;
      const initial = Math.floor(code / 588);
      const vowel = Math.floor((code % 588) / 28);
      const final = code % 28;
      return initials[initial] + vowels[vowel] + finals[final];
    }).join('');
  }).join('');
}
