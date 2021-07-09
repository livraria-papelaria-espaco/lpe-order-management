export const isISBN = (isbn: string) => {
  if (!isbn || isbn.length !== 13 || !isbn.startsWith('978')) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i], 10);
    if (i % 2 === 1) sum += 3 * digit;
    else sum += digit;
  }
  const check = (10 - (sum % 10)) % 10;
  return check === parseInt(isbn[isbn.length - 1], 10);
};

export default isISBN;
