/**
 * Generates a random seed string.
 *
 * @returns {string} The generated seed string.
 */
export const generateSeed = (length: number = 30): string => {
  let output = "";
  for (let i = 0; i < length; i++) {
    output += Math.floor(Math.random() * 10);
  }

  return output;
};
