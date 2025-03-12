export const tokenize = (text: string) => text.split(/([^\wà-üÀ-Ü])/g).filter(item => item !== '');
