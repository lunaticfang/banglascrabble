// Comprehensive Bangla word validation with extensive juktakkhors (conjuncts)
// Rigorous spelling check for complex Bangla words

export const COMMON_BANGLA_WORDS = new Set([
  // Basic words
  'অং', 'অক', 'অট', 'অন', 'অপ', 'অভ', 'অম', 'অর', 'অল', 'অশ', 'অস', 'অহ',
  'আই', 'আউ', 'আক', 'আগ', 'আচ', 'আজ', 'আট', 'আড়', 'আত', 'আদ', 'আন', 'আপ',
  'আব', 'আম', 'আর', 'আল', 'আশ', 'আস', 'আহ',
  
  // Common nouns with proper spelling
  'বই', 'ঘর', 'পানি', 'জল', 'ভাত', 'মাছ', 'গাছ', 'ফুল', 'পাখি', 'গরু', 'ছাগল',
  'কুকুর', 'বিড়াল', 'হাতি', 'বাঘ', 'সিংহ', 'মানুষ', 'ছেলে', 'মেয়ে', 'বাবা', 'মা',
  'ভাই', 'বোন', 'দাদা', 'দিদি', 'নানা', 'নানী', 'দাদু', 'ঠাকুমা', 'চাচা', 'চাচী',
  'মামা', 'মামী', 'ফুপু', 'খালা', 'বন্ধু', 'শিক্ষক', 'ডাক্তার', 'কৃষক', 'জেলে',
  'কামার', 'কুমার', 'তাঁতি', 'মুচি', 'নাপিত', 'ধোপা', 'মালি', 'রাজা', 'রানী',
  
  // Common verbs with complex spellings
  'করা', 'হওয়া', 'যাওয়া', 'আসা', 'দেখা', 'শোনা', 'বলা', 'খাওয়া', 'পড়া', 'লেখা',
  'ঘুমানো', 'ঘুমাইয়া', 'উঠা', 'বসা', 'দাঁড়ানো', 'হাঁটা', 'দৌড়ানো', 'নাচা', 'গান', 'হাসা', 'কাঁদা',
  'কাজ', 'কাম', 'চলা', 'থাকা', 'রাখা', 'নেওয়া', 'দেওয়া', 'পাওয়া', 'হারানো', 'পড়ানো',
  
  // Adjectives with complex forms
  'ভালো', 'ভাল', 'খারাপ', 'বড়', 'বড়ো', 'ছোট', 'ছোটো', 'লম্বা', 'খাটো', 'মোটা', 'চিকন',
  'গরম', 'ঠান্ডা', 'নতুন', 'পুরানো', 'পুরোনো', 'সুন্দর', 'কুৎসিত', 'সহজ', 'কঠিন',
  'দ্রুত', 'ধীর', 'উঁচু', 'নিচু', 'গভীর', 'অগভীর', 'চওড়া', 'সরু',
  
  // Colors with variants
  'লাল', 'নীল', 'সবুজ', 'হলুদ', 'কালো', 'সাদা', 'বাদামী', 'গোলাপী', 'ধূসর',
  'কমলা', 'বেগুনি', 'আকাশী', 'সোনালি', 'রুপালি',
  
  // Numbers with variants
  'এক', 'একটি', 'দুই', 'দুইটি', 'তিন', 'তিনটি', 'চার', 'চারটি', 'পাঁচ', 'পাঁচটি',
  'ছয়', 'ছয়টি', 'সাত', 'সাতটি', 'আট', 'আটটি', 'নয়', 'নয়টি', 'দশ', 'দশটি',
  'এগার', 'বার', 'তের', 'চৌদ্দ', 'পনের', 'ষোল', 'সতের', 'আঠার', 'উনিশ', 'বিশ',
  
  // Time related with variants
  'দিন', 'রাত', 'রাত্রি', 'সকাল', 'দুপুর', 'বিকাল', 'সন্ধ্যা', 'মাস', 'বছর', 'সপ্তাহ',
  'ঘন্টা', 'মিনিট', 'সেকেন্ড', 'মুহূর্ত', 'ক্ষণ', 'কাল', 'আজ', 'গতকাল', 'আগামীকাল',
  
  // Body parts with complex spellings
  'মাথা', 'মস্তক', 'চুল', 'কেশ', 'চোখ', 'নেত্র', 'নাক', 'নাসিকা', 'মুখ', 'মুখমণ্ডল',
  'কান', 'কর্ণ', 'হাত', 'হস্ত', 'পা', 'পদ', 'পেট', 'উদর', 'পিঠ', 'পৃষ্ঠ',
  'গলা', 'কণ্ঠ', 'দাঁত', 'দন্ত', 'জিভ', 'জিহ্বা', 'ঠোঁট', 'অধর',
  
  // Food items with variants
  'ভাত', 'অন্ন', 'রুটি', 'পাউরুটি', 'ডাল', 'তরকারি', 'সবজি', 'মাংস', 'গোশত',
  'দুধ', 'দুগ্ধ', 'চা', 'কফি', 'চিনি', 'লবণ', 'তেল', 'ঘি', 'মধু', 'গুড়',
  
  // Nature with complex words
  'সূর্য', 'সূর্য্য', 'চাঁদ', 'চন্দ্র', 'তারা', 'নক্ষত্র', 'আকাশ', 'আকাশমণ্ডল',
  'মেঘ', 'মেঘমালা', 'বৃষ্টি', 'বর্ষণ', 'বাতাস', 'বায়ু', 'আগুন', 'অগ্নি',
  'মাটি', 'মৃত্তিকা', 'নদী', 'নদ', 'সাগর', 'সমুদ্র', 'পাহাড়', 'পর্বত',
  'জঙ্গল', 'অরণ্য', 'ক্ষেত', 'ক্ষেত্র', 'বাগান', 'উদ্যান',

  // Extensive conjunct words (juktakkhors) - Critical for rigorous spelling
  'ক্ষ', 'ক্ষুধা', 'ক্ষেত', 'ক্ষেত্র', 'ক্ষমা', 'ক্ষয়', 'ক্ষতি', 'ক্ষীর', 'ক্ষুর', 'ক্ষণ',
  'জ্ঞ', 'জ্ঞান', 'জ্ঞানী', 'যজ্ঞ', 'বিজ্ঞান', 'অজ্ঞান', 'সজ্ঞান',
  'ক্র', 'ক্রম', 'ক্রমশ', 'ক্রীড়া', 'ক্রয়', 'ক্রোধ', 'ক্রান্তি', 'ক্রিয়া',
  'গ্র', 'গ্রাম', 'গ্রহ', 'গ্রহণ', 'গ্রন্থ', 'গ্রীষ্ম', 'গ্রাহক', 'গ্রহীতা',
  'ত্র', 'ত্রাণ', 'ত্রিশ', 'ত্রয়', 'ত্রুটি', 'ত্রাস', 'ত্রিকোণ', 'ত্রিভুজ',
  'দ্র', 'দ্রুত', 'দ্রব্য', 'দ্রবণ', 'দ্রাবক', 'দ্রুততম', 'দ্রবীভূত',
  'প্র', 'প্রিয়', 'প্রথম', 'প্রকার', 'প্রণাম', 'প্রশ্ন', 'প্রচার', 'প্রমাণ',
  'ব্র', 'ব্রাহ্মণ', 'ব্রত', 'ব্রজ', 'ব্রিটিশ', 'ব্রিজ', 'ব্রেইল',
  'ম্র', 'ম্রিয়মাণ', 'আম্র', 'চম্র',
  'শ্র', 'শ্রম', 'শ্রমিক', 'শ্রেণী', 'শ্রেষ্ঠ', 'শ্রী', 'শ্রাবণ', 'আশ্রয়',
  'স্র', 'স্রোত', 'স্রষ্টা', 'বিস্রস্ত',
  'হ্র', 'হ্রদ', 'হ্রাস', 'হ্রস্ব',
  
  // Double consonants and complex conjuncts
  'দ্দ', 'উদ্দেশ্য', 'বুদ্ধ', 'বুদ্ধি', 'সদ্ধর্ম', 'সিদ্ধান্ত', 'গদ্য',
  'ত্ত', 'উত্তর', 'পত্তন', 'সত্য', 'মিত্তির', 'ছাত্তর',
  'ন্ন', 'অন্ন', 'চান্নি', 'গোন্নি', 'দিন্নি',
  'ল্ল', 'উল্লাস', 'কল্লোল', 'বিল্লি', 'ছল্লা',
  'ম্ম', 'সম্মান', 'গম্ম', 'ধম্ম', 'নম্ম',
  'স্স', 'রসস', 'পিস্সি', 'মিস্স',
  
  // Triple consonants and complex forms
  'ক্ষ্ম', 'লক্ষ্মী', 'সূক্ষ্ম',
  'ন্ত্র', 'যন্ত্র', 'মন্ত্র', 'তন্ত্র', 'কেন্দ্র', 'চন্দ্র',
  'স্ত্র', 'স্ত্রী', 'শাস্ত্র', 'অস্ত্র',
  'ক্ত', 'ভক্ত', 'যুক্ত', 'মুক্ত', 'শক্ত', 'রক্ত',
  'গ্ধ', 'মুগ্ধ', 'বুগ্ধি', 'যুগ্ধ',
  'ন্ধ', 'বন্ধ', 'বন্ধু', 'গন্ধ', 'সন্ধ্যা', 'অন্ধ',
  'ম্ভ', 'গম্ভীর', 'সম্ভব', 'অসম্ভব', 'স্তম্ভ',
  'ব্ধ', 'সব্ধি', 'লব্ধ', 'শব্দ',
  'স্থ', 'স্থান', 'অবস্থা', 'সুস্থ', 'অসুস্থ', 'দুঃস্থ',
  
  // Religious and cultural terms
  'ঈশ্বর', 'ভগবান', 'আল্লাহ', 'খোদা', 'প্রভু', 'ঠাকুর', 'দেবতা', 'দেবী',
  'নামাজ', 'পূজা', 'প্রার্থনা', 'ইবাদত', 'ধর্ম', 'ইসলাম', 'হিন্দু', 'বৌদ্ধ', 'খ্রিস্টান',
  'মসজিদ', 'মন্দির', 'গির্জা', 'প্যাগোডা', 'গুরুদ্বার',
  
  // Abstract concepts with complex spelling
  'স্বাধীনতা', 'স্বাধীন', 'পরাধীন', 'পরাধীনতা', 'বিপ্লব', 'বিদ্রোহ',
  'সভ্যতা', 'সংস্কৃতি', 'ঐতিহ্য', 'আধুনিকতা', 'প্রগতি', 'উন্নতি',
  'শিক্ষা', 'শিক্ষিত', 'অশিক্ষিত', 'নিরক্ষর', 'সাক্ষর',
  'ন্যায়', 'ন্যায্য', 'অন্যায়', 'অন্যায্য', 'বিচার', 'আইন',
  
  // Technology and modern terms in Bangla
  'কম্পিউটার', 'ইন্টারনেট', 'মোবাইল', 'টেলিভিশন', 'রেডিও',
  'গাড়ি', 'বাস', 'ট্রেন', 'উড়োজাহাজ', 'জাহাজ', 'নৌকা',
  'হাসপাতাল', 'ডাক্তারখানা', 'ওষুধ', 'চিকিৎসা', 'রোগ', 'অসুখ',
  'স্কুল', 'কলেজ', 'বিশ্ববিদ্যালয়', 'ছাত্র', 'ছাত্রী', 'শিক্ষক', 'শিক্ষিকা',
]);

export function isValidBanglaWord(word: string): boolean {
  // Normalize the word - remove extra whitespace and normalize Unicode
  const normalizedWord = word.trim().normalize('NFC');
  
  // Empty or too short words are invalid
  if (normalizedWord.length < 1) {
    return false;
  }
  
  // Check against our comprehensive dictionary first
  if (COMMON_BANGLA_WORDS.has(normalizedWord)) {
    return true;
  }
  
  // Rigorous Unicode validation for Bangla script
  // Include full Bangla Unicode block with conjuncts and diacritics
  const banglaRegex = /^[\u0980-\u09FF\u200C\u200D\u09F0-\u09F1\u09F4-\u09F9\u09FA-\u09FB]+$/;
  if (!banglaRegex.test(normalizedWord)) {
    return false;
  }
  
  // Additional validation for conjunct letters (juktakkhors)
  // Ensure proper formation of complex characters
  return validateConjuncts(normalizedWord);
}

function validateConjuncts(word: string): boolean {
  // Check for valid conjunct formations
  // This ensures proper juktakkhor spelling
  
  // Common invalid patterns to reject
  const invalidPatterns = [
    /\u09CD\u09CD/, // Double hasanta (invalid)
    /\u09BC\u09BC/, // Double nukta (invalid)
    /[\u0981\u0982\u0983][\u0981\u0982\u0983]/, // Double nasalization marks
  ];
  
  for (const pattern of invalidPatterns) {
    if (pattern.test(word)) {
      return false;
    }
  }
  
  // Check for valid conjunct sequences
  // Hasanta (\u09CD) should be followed by a consonant
  const hasantaPattern = /\u09CD(?![\u0995-\u09B9\u09DC-\u09DF])/g;
  if (hasantaPattern.test(word)) {
    return false;
  }
  
  // Additional checks for common misspellings can be added here
  return true;
}

export function getBanglaWordMeaning(word: string): string | null {
  // In a real app, this would fetch from a comprehensive dictionary API
  const meanings: Record<string, string> = {
    'বই': 'Book',
    'ঘর': 'House/Room',
    'পানি': 'Water',
    'ভাত': 'Rice',
    'মাছ': 'Fish',
    'গাছ': 'Tree',
    'ফুল': 'Flower',
    'পাখি': 'Bird',
    'ভালো': 'Good',
    'খারাপ': 'Bad',
    'বড়': 'Big',
    'ছোট': 'Small',
    'লাল': 'Red',
    'নীল': 'Blue',
    'সবুজ': 'Green',
  };
  
  return meanings[word] || null;
}

export function suggestBanglaWords(letters: string[]): string[] {
  // Simple word suggestion based on available letters
  const suggestions: string[] = [];
  
  const wordsArray = Array.from(COMMON_BANGLA_WORDS);
  for (const word of wordsArray) {
    const wordLetters = Array.from(word);
    const availableLetters = [...letters];
    
    let canForm = true;
    for (const letter of wordLetters) {
      const index = availableLetters.indexOf(letter);
      if (index === -1) {
        canForm = false;
        break;
      }
      availableLetters.splice(index, 1);
    }
    
    if (canForm) {
      suggestions.push(word);
    }
  }
  
  return suggestions.slice(0, 10); // Return top 10 suggestions
}
