// Bangla Scrabble tile distribution and point values
export const BANGLA_LETTERS = {
  // Vowels
  'অ': { points: 1, count: 8 },
  'আ': { points: 1, count: 7 },
  'ই': { points: 1, count: 6 },
  'ঈ': { points: 2, count: 4 },
  'উ': { points: 2, count: 4 },
  'ঊ': { points: 3, count: 2 },
  'ঋ': { points: 8, count: 1 },
  'এ': { points: 1, count: 6 },
  'ঐ': { points: 4, count: 2 },
  'ও': { points: 2, count: 4 },
  'ঔ': { points: 4, count: 2 },

  // Consonants - High frequency
  'ক': { points: 2, count: 6 },
  'খ': { points: 4, count: 3 },
  'গ': { points: 3, count: 4 },
  'ঘ': { points: 5, count: 2 },
  'ঙ': { points: 6, count: 2 },
  'চ': { points: 4, count: 3 },
  'ছ': { points: 5, count: 2 },
  'জ': { points: 3, count: 4 },
  'ঝ': { points: 6, count: 2 },
  'ঞ': { points: 7, count: 1 },
  'ট': { points: 3, count: 4 },
  'ঠ': { points: 5, count: 2 },
  'ড': { points: 4, count: 3 },
  'ঢ': { points: 6, count: 2 },
  'ণ': { points: 3, count: 4 },
  'ত': { points: 2, count: 6 },
  'থ': { points: 4, count: 3 },
  'দ': { points: 2, count: 6 },
  'ধ': { points: 4, count: 3 },
  'ন': { points: 1, count: 8 },
  'প': { points: 2, count: 5 },
  'ফ': { points: 4, count: 3 },
  'ব': { points: 2, count: 5 },
  'ভ': { points: 4, count: 3 },
  'ম': { points: 2, count: 5 },
  'য': { points: 3, count: 4 },
  'র': { points: 1, count: 8 },
  'ল': { points: 2, count: 5 },
  'শ': { points: 3, count: 4 },
  'ষ': { points: 4, count: 3 },
  'স': { points: 2, count: 5 },
  'হ': { points: 3, count: 4 },

  // Additional letters
  'য়': { points: 5, count: 2 },
  'ড়': { points: 5, count: 2 },
  'ঢ়': { points: 6, count: 2 },
  'ৎ': { points: 7, count: 1 },
  'ং': { points: 4, count: 3 },
  'ঃ': { points: 6, count: 2 },
  'ঁ': { points: 7, count: 1 },

  // Common conjuncts
  'ক্ষ': { points: 5, count: 2 },
  'জ্ঞ': { points: 6, count: 2 },
  'ক্র': { points: 4, count: 2 },
  'গ্র': { points: 4, count: 2 },
  'ত্র': { points: 4, count: 2 },
  'দ্র': { points: 4, count: 2 },
  'প্র': { points: 4, count: 2 },
  'ব্র': { points: 4, count: 2 },
  'ম্র': { points: 4, count: 2 },
  'শ্র': { points: 5, count: 2 },
  'স্র': { points: 4, count: 2 },
  'হ্র': { points: 5, count: 2 },

  // Blank tiles
  '': { points: 0, count: 2 }, // Blank tiles
};

// Generate tile bag based on letter distribution
export const BANGLA_TILES: string[] = [];

Object.entries(BANGLA_LETTERS).forEach(([letter, info]) => {
  for (let i = 0; i < info.count; i++) {
    BANGLA_TILES.push(letter);
  }
});

export function getTilePoints(letter: string): number {
  return BANGLA_LETTERS[letter as keyof typeof BANGLA_LETTERS]?.points || 0;
}

export function isValidBanglaLetter(letter: string): boolean {
  return letter in BANGLA_LETTERS;
}
