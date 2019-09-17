export const getRandomLength = (): number => {
  const min = 32;
  const max = 42;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const dec2hex = (dec: any) => {
  return `0${dec.toString(16)}`.substr(-2);
};

export const generateId = (len?: number) => {
  const arr = new Uint8Array((len || 40) / 2);
  const cryptoObj = window.crypto || (window as any).msCrypto; // for IE 11
  cryptoObj.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};
