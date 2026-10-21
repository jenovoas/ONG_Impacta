export function validateRut(rut: string): boolean {
  const cleanRut = rut.replace(/\./g, '').replace(/,/g, '');
  if (!/^[0-9]+-[0-9kK]{1}$/.test(cleanRut)) return false;
  const [num, dv] = cleanRut.split('-');
  let total = 0;
  let multiplier = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    total += parseInt(num[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDv = 11 - (total % 11);
  let dvStr = '';
  if (expectedDv === 11) dvStr = '0';
  else if (expectedDv === 10) dvStr = 'K';
  else dvStr = expectedDv.toString();

  return dvStr.toUpperCase() === dv.toUpperCase();
}
