export const onlyLetters = (value) =>
    value.replace(/[^A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s'-]/g, "");

export const onlyNumbers = (value) => value.replace(/\D/g, "");

export const onlyDecimal = (value) => value.replace(/[^0-9.]/g, "");

export const lettersPattern = String.raw`[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s'-]+`;
export const numbersPattern = "[0-9]+";