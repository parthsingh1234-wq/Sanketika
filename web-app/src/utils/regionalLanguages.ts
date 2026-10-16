/**
 * regionalLanguages.ts
 * Comprehensive Regional Language & Accessibility Localization Engine for Sanketika (संकेतिका).
 * Supports 12 regional languages with native scripts, phonetic transliteration,
 * and offline-first fallback dictionary for sign language & inclusive digital services.
 */

export type SupportedRegionalLang =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'es' // Spanish (Español)
  | 'fr'; // French (Français)

export interface RegionalLanguageInfo {
  code: SupportedRegionalLang;
  label: string;
  nativeLabel: string;
  locale: string; // BCP-47 tag
  region: string;
  scriptDir: 'ltr' | 'rtl';
}

export const REGIONAL_LANGUAGES: Record<SupportedRegionalLang, RegionalLanguageInfo> = {
  en: { code: 'en', label: 'English', nativeLabel: 'English', locale: 'en-US', region: 'Global', scriptDir: 'ltr' },
  hi: { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', locale: 'hi-IN', region: 'North / Central India', scriptDir: 'ltr' },
  ta: { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', locale: 'ta-IN', region: 'Tamil Nadu, South India & Sri Lanka', scriptDir: 'ltr' },
  te: { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', locale: 'te-IN', region: 'Andhra Pradesh & Telangana', scriptDir: 'ltr' },
  bn: { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', locale: 'bn-IN', region: 'West Bengal & Bangladesh', scriptDir: 'ltr' },
  mr: { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', locale: 'mr-IN', region: 'Maharashtra, Western India', scriptDir: 'ltr' },
  kn: { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', locale: 'kn-IN', region: 'Karnataka, South India', scriptDir: 'ltr' },
  gu: { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', locale: 'gu-IN', region: 'Gujarat, Western India', scriptDir: 'ltr' },
  ml: { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', locale: 'ml-IN', region: 'Kerala, South India', scriptDir: 'ltr' },
  pa: { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', locale: 'pa-IN', region: 'Punjab, Northern India', scriptDir: 'ltr' },
  es: { code: 'es', label: 'Spanish', nativeLabel: 'Español', locale: 'es-ES', region: 'Spain & Latin America', scriptDir: 'ltr' },
  fr: { code: 'fr', label: 'French', nativeLabel: 'Français', locale: 'fr-FR', region: 'France & Francophonie', scriptDir: 'ltr' },
};

export interface RegionalEntry {
  native: string;
  phonetic: string;
}

/**
 * Offline-first lexical dictionary for signs, emergency alerts, medical, and services.
 */
export const REGIONAL_DICTIONARY: Record<string, Partial<Record<SupportedRegionalLang, RegionalEntry>>> = {
  // Common Signs & Greetings
  HELLO: {
    en: { native: 'Hello', phonetic: 'Hello' },
    hi: { native: 'नमस्ते', phonetic: 'Namaste' },
    ta: { native: 'வணக்கம்', phonetic: 'Vanakkam' },
    te: { native: 'నమస్కారం', phonetic: 'Namaskaram' },
    bn: { native: 'নমস্কার', phonetic: 'Nomoshkar' },
    mr: { native: 'नमस्कार', phonetic: 'Namaskar' },
    kn: { native: 'ನಮಸ್ಕಾರ', phonetic: 'Namaskara' },
    gu: { native: 'નમસ્તે', phonetic: 'Namaste' },
    ml: { native: 'നമസ്കാരം', phonetic: 'Namaskaram' },
    pa: { native: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', phonetic: 'Sat Sri Akal' },
    es: { native: 'Hola', phonetic: 'Hola' },
    fr: { native: 'Bonjour', phonetic: 'Bonjour' },
  },
  THANK_YOU: {
    en: { native: 'Thank you', phonetic: 'Thank you' },
    hi: { native: 'धन्यवाद', phonetic: 'Dhanyavaad' },
    ta: { native: 'நன்றி', phonetic: 'Nandri' },
    te: { native: 'ధన్యవాదాలు', phonetic: 'Dhanyavaadaalu' },
    bn: { native: 'ধন্যবাদ', phonetic: 'Dhonnobaad' },
    mr: { native: 'धन्यवाद', phonetic: 'Dhanyavaad' },
    kn: { native: 'ಧನ್ಯವಾದಗಳು', phonetic: 'Dhanyavaadagalu' },
    gu: { native: 'આભાર', phonetic: 'Aabhar' },
    ml: { native: 'നന്ദി', phonetic: 'Nandi' },
    pa: { native: 'ਧੰਨਵਾਦ', phonetic: 'Dhanvaad' },
    es: { native: 'Gracias', phonetic: 'Gracias' },
    fr: { native: 'Merci', phonetic: 'Merci' },
  },
  PLEASE: {
    en: { native: 'Please', phonetic: 'Please' },
    hi: { native: 'कृपया', phonetic: 'Kripya' },
    ta: { native: 'தயவுசெய்து', phonetic: 'Thayavu seithu' },
    te: { native: 'దయచేసి', phonetic: 'Dayachesi' },
    bn: { native: 'দয়া করে', phonetic: 'Doya kore' },
    mr: { native: 'कृपया', phonetic: 'Krupaya' },
    kn: { native: 'ದಯವಿಟ್ಟು', phonetic: 'Dayavittu' },
    gu: { native: 'મહેરબાની કરીને', phonetic: 'Maherbani kari ne' },
    ml: { native: 'ദയവായി', phonetic: 'Dayavaayi' },
    pa: { native: 'ਕਿਰਪਾ ਕਰਕੇ', phonetic: 'Kirpa karke' },
    es: { native: 'Por favor', phonetic: 'Por favor' },
    fr: { native: "S'il vous plaît", phonetic: 'Seel voo play' },
  },
  SORRY: {
    en: { native: 'Sorry', phonetic: 'Sorry' },
    hi: { native: 'क्षमा करें', phonetic: 'Kshama karein' },
    ta: { native: 'மன்னிக்கவும்', phonetic: 'Mannikkavum' },
    te: { native: 'క్షమించండి', phonetic: 'Kshaminchandi' },
    bn: { native: 'দুঃখিত', phonetic: 'Dukkhito' },
    mr: { native: 'माफ करा', phonetic: 'Maaf kara' },
    kn: { native: 'ಕ್ಷಮಿಸಿ', phonetic: 'Kshamisi' },
    gu: { native: 'માફ કરશો', phonetic: 'Maaf karsho' },
    ml: { native: 'ക്ഷമിക്കണം', phonetic: 'Kshamikkaṇam' },
    pa: { native: 'ਮਾਫ਼ ਕਰਨਾ', phonetic: 'Maaf karna' },
    es: { native: 'Perdón', phonetic: 'Perdón' },
    fr: { native: 'Désolé', phonetic: 'Day-zoh-lay' },
  },
  HELP: {
    en: { native: 'Help me please', phonetic: 'Help me please' },
    hi: { native: 'कृपया मेरी मदद करें', phonetic: 'Kripya meri madad karein' },
    ta: { native: 'எனக்கு உதவி செய்யுங்கள்', phonetic: 'Enakku uthavi seiyungal' },
    te: { native: 'దయచేసి నాకు సహాయం చేయండి', phonetic: 'Dayachesi naaku sahayam cheyandi' },
    bn: { native: 'আমাকে সাহায্য করুন', phonetic: 'Amake sahajjo korun' },
    mr: { native: 'कृपया मला मदत करा', phonetic: 'Krupaya mala madat kara' },
    kn: { native: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ', phonetic: 'Dayavittu nanage sahaaya maadi' },
    gu: { native: 'કૃપા કરીને મને મદદ કરો', phonetic: 'Krupa kari ne mane madad karo' },
    ml: { native: 'ദയവായി എന്നെ സഹായിക്കൂ', phonetic: 'Dayavaayi enne sahāyikkū' },
    pa: { native: 'ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ', phonetic: 'Kirpa karke meri madad karo' },
    es: { native: 'Ayuda por favor', phonetic: 'Ayuda por favor' },
    fr: { native: "À l'aide s'il vous plaît", phonetic: 'Ah laid seel voo play' },
  },
  WATER: {
    en: { native: 'Water', phonetic: 'Water' },
    hi: { native: 'पानी', phonetic: 'Paani' },
    ta: { native: 'தண்ணீர்', phonetic: 'Thanneer' },
    te: { native: 'నీళ్ళు', phonetic: 'Neellu' },
    bn: { native: 'জল', phonetic: 'Jol' },
    mr: { native: 'पाणी', phonetic: 'Paani' },
    kn: { native: 'ನೀರು', phonetic: 'Neeru' },
    gu: { native: 'પાણી', phonetic: 'Paani' },
    ml: { native: 'വെള്ളം', phonetic: 'Vellam' },
    pa: { native: 'ਪਾਣੀ', phonetic: 'Paani' },
    es: { native: 'Agua', phonetic: 'Agua' },
    fr: { native: 'Eau', phonetic: 'Oh' },
  },
  EAT: {
    en: { native: 'Food / Eat', phonetic: 'Food' },
    hi: { native: 'खाना', phonetic: 'Khaana' },
    ta: { native: 'உணவு', phonetic: 'Unavu' },
    te: { native: 'ఆహారం', phonetic: 'Aahaaram' },
    bn: { native: 'খাবার', phonetic: 'Khabar' },
    mr: { native: 'जेवण', phonetic: 'Jevan' },
    kn: { native: 'ಊಟ', phonetic: 'Oota' },
    gu: { native: 'ખોરાક', phonetic: 'Khorak' },
    ml: { native: 'ഭക്ഷണം', phonetic: 'Bhakshanam' },
    pa: { native: 'ਖਾਣਾ', phonetic: 'Khaana' },
    es: { native: 'Comida', phonetic: 'Comida' },
    fr: { native: 'Nourriture', phonetic: 'Noo-ree-toor' },
  },
  TOILET: {
    en: { native: 'Restroom / Washroom', phonetic: 'Washroom' },
    hi: { native: 'शौचालय कहाँ है?', phonetic: 'Shauchalaya kahan hai?' },
    ta: { native: 'கழிப்பறை எங்கே?', phonetic: 'Kazhipparai engae?' },
    te: { native: 'వాష్‌రూమ్ ఎక్కడ ఉంది?', phonetic: 'Washroom ekkada undi?' },
    bn: { native: 'শৌচাগার কোথায়?', phonetic: 'Shouchagar kothay?' },
    mr: { native: 'शौचालय कुठे आहे?', phonetic: 'Shauchalay kuthe aahe?' },
    kn: { native: 'ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?', phonetic: 'Shauchalaya ellide?' },
    gu: { native: 'શૌચાલય ક્યાં છે?', phonetic: 'Shauchalay kyan chhe?' },
    ml: { native: 'ടോയ്‌ലറ്റ് എവിടെയാണ്?', phonetic: 'Toilet evideyāṇu?' },
    pa: { native: 'ਟਾਇਲਟ ਕਿੱਥੇ ਹੈ?', phonetic: 'Toilet kitthe hai?' },
    es: { native: '¿Dónde está el baño?', phonetic: 'Don-day es-tah el bah-nyo' },
    fr: { native: 'Où sont les toilettes ?', phonetic: 'Oo son lay twa-let' },
  },
  YES: {
    en: { native: 'Yes', phonetic: 'Yes' },
    hi: { native: 'हाँ', phonetic: 'Haan' },
    ta: { native: 'ஆம்', phonetic: 'Aam' },
    te: { native: 'అవును', phonetic: 'Avunu' },
    bn: { native: 'হ্যাঁ', phonetic: 'Hya' },
    mr: { native: 'होय', phonetic: 'Hoy' },
    kn: { native: 'ಹೌದು', phonetic: 'Haudu' },
    gu: { native: 'હા', phonetic: 'Haa' },
    ml: { native: 'അതെ', phonetic: 'Athe' },
    pa: { native: 'ਹਾਂ', phonetic: 'Haan' },
    es: { native: 'Sí', phonetic: 'See' },
    fr: { native: 'Oui', phonetic: 'Wee' },
  },
  NO: {
    en: { native: 'No', phonetic: 'No' },
    hi: { native: 'नहीं', phonetic: 'Nahin' },
    ta: { native: 'இல்லை', phonetic: 'Illai' },
    te: { native: 'కాదు', phonetic: 'Kaadu' },
    bn: { native: 'না', phonetic: 'Na' },
    mr: { native: 'नाही', phonetic: 'Naahi' },
    kn: { native: 'ಇಲ್ಲ', phonetic: 'Illa' },
    gu: { native: 'ના', phonetic: 'Naa' },
    ml: { native: 'അല്ല', phonetic: 'Alla' },
    pa: { native: 'ਨਹੀਂ', phonetic: 'Nahin' },
    es: { native: 'No', phonetic: 'No' },
    fr: { native: 'Non', phonetic: 'Noh' },
  },
  STOP: {
    en: { native: 'Stop', phonetic: 'Stop' },
    hi: { native: 'रुकिए', phonetic: 'Rukiye' },
    ta: { native: 'நிறுத்துங்கள்', phonetic: 'Nirutthungal' },
    te: { native: 'ఆగండి', phonetic: 'Aagandi' },
    bn: { native: 'থামুন', phonetic: 'Thamun' },
    mr: { native: 'थांबा', phonetic: 'Thamba' },
    kn: { native: 'ನಿಲ್ಲಿಸಿ', phonetic: 'Nillisi' },
    gu: { native: 'થોભો', phonetic: 'Thobho' },
    ml: { native: 'നിർത്തൂ', phonetic: 'Nirthu' },
    pa: { native: 'ਰੁਕੋ', phonetic: 'Ruko' },
    es: { native: 'Deténgase', phonetic: 'Deh-teng-ah-say' },
    fr: { native: 'Arrêtez', phonetic: 'Ah-reh-tay' },
  },
  WAIT: {
    en: { native: 'Wait a moment', phonetic: 'Wait' },
    hi: { native: 'कृपया प्रतीक्षा करें', phonetic: 'Kripya pratiksha karein' },
    ta: { native: 'கொஞ்சம் பொறுங்கள்', phonetic: 'Konjam porungal' },
    te: { native: 'కాసేపు వేచి ఉండండి', phonetic: 'Kaasepu vechi undandi' },
    bn: { native: 'একটু অপেক্ষা করুন', phonetic: 'Ektu opekkha korun' },
    mr: { native: 'कृपया थांबा', phonetic: 'Krupaya thamba' },
    kn: { native: 'ಸ್ವಲ್ಪ ಕಾಯಿರಿ', phonetic: 'Svalpa kaayiri' },
    gu: { native: 'થોડીવાર રાહ જુઓ', phonetic: 'Thodivaar raah juo' },
    ml: { native: 'കുറച്ചു കാത്തിരിക്കൂ', phonetic: 'Kurachu kātthirikkū' },
    pa: { native: 'ਇੱਕ ਮਿੰਟ ਰੁਕੋ', phonetic: 'Ikk minute ruko' },
    es: { native: 'Espere un momento', phonetic: 'Es-peh-ray oon moh-men-toh' },
    fr: { native: 'Attendez un instant', phonetic: 'Ah-tahn-day oon an-stahn' },
  },
  GOOD: {
    en: { native: 'Good', phonetic: 'Good' },
    hi: { native: 'अच्छा', phonetic: 'Achha' },
    ta: { native: 'நல்லது', phonetic: 'Nallathu' },
    te: { native: 'మంచిది', phonetic: 'Manchidi' },
    bn: { native: 'ভালো', phonetic: 'Bhalo' },
    mr: { native: 'चांगले', phonetic: 'Changle' },
    kn: { native: 'ಉತ್ತಮ', phonetic: 'Uttama' },
    gu: { native: 'સારું', phonetic: 'Saaru' },
    ml: { native: 'നല്ലത്', phonetic: 'Nallath' },
    pa: { native: 'ਚੰਗਾ', phonetic: 'Changa' },
    es: { native: 'Bueno', phonetic: 'Bueno' },
    fr: { native: 'Bien', phonetic: 'Byan' },
  },
  BAD: {
    en: { native: 'Bad', phonetic: 'Bad' },
    hi: { native: 'खराब', phonetic: 'Kharab' },
    ta: { native: 'மோசமானது', phonetic: 'Mosamaanathu' },
    te: { native: 'చెడ్డది', phonetic: 'Cheddadi' },
    bn: { native: 'খারাপ', phonetic: 'Kharaph' },
    mr: { native: 'वाईट', phonetic: 'Vaait' },
    kn: { native: 'ಕೆಟ್ಟದ್ದು', phonetic: 'Kettaddu' },
    gu: { native: 'ખરાબ', phonetic: 'Kharab' },
    ml: { native: 'മോശം', phonetic: 'Mosham' },
    pa: { native: 'ਮਾੜਾ', phonetic: 'Mada' },
    es: { native: 'Malo', phonetic: 'Mah-lo' },
    fr: { native: 'Mauvais', phonetic: 'Moh-vay' },
  },
  I_LOVE_YOU: {
    en: { native: 'I love you', phonetic: 'I love you' },
    hi: { native: 'मैं तुमसे प्यार करता हूँ', phonetic: 'Main tumse pyaar karta hoon' },
    ta: { native: 'நான் உன்னை நேசிக்கிறேன்', phonetic: 'Naan unnai nesikkiren' },
    te: { native: 'నేను నిన్ను ప్రేమిస్తున్నాను', phonetic: 'Nenu ninnu premistunnanu' },
    bn: { native: 'আমি তোমাকে ভালোবাসি', phonetic: 'Ami tomake bhalobashi' },
    mr: { native: 'माझे तुझ्यावर प्रेम आहे', phonetic: 'Majhe tuzyavar prem aahe' },
    kn: { native: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ', phonetic: 'Naanu ninnannu preethisutthene' },
    gu: { native: 'હું તમને પ્રેમ કરું છું', phonetic: 'Hoon tamne prem karun chhun' },
    ml: { native: 'ഞാൻ നിന്നെ സ്നേഹിക്കുന്നു', phonetic: 'Njan ninne snehikkunnu' },
    pa: { native: 'ਮੈਂ ਤੁਹਾਨੂੰ ਪਿਆਰ ਕਰਦਾ ਹਾਂ', phonetic: 'Main tuhanu pyar karda haan' },
    es: { native: 'Te quiero', phonetic: 'Te kyeh-ro' },
    fr: { native: "Je t'aime", phonetic: 'Zhuh tem' },
  },

  // Emergency & Public Services
  EMERGENCY_SOS: {
    en: { native: 'EMERGENCY: I need urgent medical assistance!', phonetic: 'Emergency medical assistance' },
    hi: { native: 'आपातकालीन: मुझे तत्काल चिकित्सा सहायता की आवश्यकता है!', phonetic: 'Aapatkaaleen: Mujhe tatkaal chikitsa sahayata chahiye!' },
    ta: { native: 'அவசரம்: எனக்கு உடனடி மருத்துவ உதவி தேவை!', phonetic: 'Avasaram: Enakku udanadi maruthuva uthavi thevai!' },
    te: { native: 'అత్యవసరం: నాకు తక్షణ వైద్య సహాయం కావాలి!', phonetic: 'Athyavasaram: Naaku thakshana vaidya sahayam kaavali!' },
    bn: { native: 'জরুরী: আমার অবিলম্বে চিকিৎসা সহায়তা প্রয়োজন!', phonetic: 'Joruri: Amar obilombe chikitsa sahajjo proyojon!' },
    mr: { native: 'तातडीची मदत: मला त्वरित वैद्यकीय मदतीची गरज आहे!', phonetic: 'Taatadichi madat: Mala twarit vaidyakiya madatichi garaj aahe!' },
    kn: { native: 'ತುರ್ತು: ನನಗೆ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕು!', phonetic: 'Thurtu: Nanage thurtu vaidyakeeya neravu beku!' },
    gu: { native: 'કટોકટી: મને તાત્કાલિક તબીબી સહાયની જરૂર છે!', phonetic: 'Katokati: Mane tatkalik tabibi sahaya ni jaroor chhe!' },
    ml: { native: 'അടിയന്തരാവസ്ഥ: എനിക്ക് അടിയന്തര വൈദ്യസഹായം ആവശ്യമാണ്!', phonetic: 'Adiyantharāvastha: Enikku adiyanthara vaidyasahāyam aavashyamāṇu!' },
    pa: { native: 'ਐਮਰਜੈਂਸੀ: ਮੈਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ!', phonetic: 'Emergency: Mainu turant daaktari sahayata di lod hai!' },
    es: { native: '¡EMERGENCIA: Necesito asistencia médica urgente!', phonetic: 'Emergencia: Necesito asistencia medica urgente!' },
    fr: { native: "URGENCE : J'ai besoin d'une aide médicale urgente !", phonetic: 'Urgence : Jhay buh-zwan doon aid may-dee-kal oor-zhant !' },
  },
  POLICE_HELP: {
    en: { native: 'Please call the police immediately, I feel unsafe.', phonetic: 'Call police please' },
    hi: { native: 'कृपया तुरंत पुलिस को बुलाएं, मुझे खतरा महसूस हो रहा है।', phonetic: 'Kripya turant police ko bulayein' },
    ta: { native: 'தயவுசெய்து உடனடியாக காவல்துறையை அழைக்கவும்.', phonetic: 'Thayavu seithu kaval thuraiyai azhaikkavum' },
    te: { native: 'దయచేసి వెంటనే పోలీసులను పిలవండి.', phonetic: 'Dayachesi ventane policelanu pilavandi' },
    bn: { native: 'দয়া করে অবিলম্বে পুলিশ ডাকুন।', phonetic: 'Doya kore obilombe police daakun' },
    mr: { native: 'कृपया त्वरित पोलिसांना बोलवा.', phonetic: 'Krupaya twarit policana bolva' },
    kn: { native: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ಪೊಲೀಸರನ್ನು ಕರೆಯಿರಿ.', phonetic: 'Dayavittu thakshana policarannu kareyiri' },
    gu: { native: 'કૃપા કરીને તરત જ પોલીસને બોલાવો.', phonetic: 'Krupa kari ne tarat ja police ne bolavo' },
    ml: { native: 'ദയവായി ഉടൻ പോലീസിനെ വിളിക്കൂ.', phonetic: 'Dayavaayi udan policine vilikkū' },
    pa: { native: 'ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਪੁਲਿਸ ਨੂੰ ਬੁਲਾਓ।', phonetic: 'Kirpa karke turant police nu bulao' },
    es: { native: 'Por favor llame a la policía de inmediato.', phonetic: 'Por favor yame a la policia' },
    fr: { native: 'Veuillez appeler la police immédiatement.', phonetic: 'Vuh-yay ah-puh-lay la po-lees' },
  },
  CANNOT_SPEAK: {
    en: { native: 'I am deaf / speech-impaired. Please communicate in writing.', phonetic: 'I communicate by writing' },
    hi: { native: 'मैं सुन/बोल नहीं सकता। कृपया लिखकर बात करें।', phonetic: 'Main sun/bol nahin sakta. Kripya likhkar baat karein.' },
    ta: { native: 'என்னால் பேசவோ கேட்கவோ முடியாது. எழுதி தொடர்பு கொள்ளவும்.', phonetic: 'Ennal pesa mudiyadhu. Ezhuthi thodarbu kollavum.' },
    te: { native: 'నేను మాట్లాడలేను/వినలేను. దయచేసి రాసి చూపించండి.', phonetic: 'Nenu matladalenu. Dayachesi raasi chupinchandi.' },
    bn: { native: 'আমি কথা বলতে বা শুনতে পারি না। দয়া করে লিখে জানান।', phonetic: 'Ami kotha bolte pari na. Doya kore likhe janan.' },
    mr: { native: 'मी बोलू/ऐकू शकत नाही. कृपया लिहून सांगा.', phonetic: 'Mee bolu/aiku shakat naahi. Krupaya lihun saanga.' },
    kn: { native: 'ನನಗೆ ಮಾತನಾಡಲು/ಕೇಳಲು ಆಗುವುದಿಲ್ಲ. ದಯವಿಟ್ಟು ಬರೆದು ತಿಳಿಸಿ.', phonetic: 'Nanage mathanadalu aguvudilla. Dayavittu baredu thilisi.' },
    gu: { native: 'હું બોલી કે સાંભળી શકતો નથી. કૃપા કરીને લખીને જણાવો.', phonetic: 'Hoon boli ke sambhli shakto nathi. Likhine janavo.' },
    ml: { native: 'എനിക്ക് സംസാരിക്കാനോ കേൾക്കാനോ കഴിയില്ല. ദയവായി എഴുതി കാണിക്കൂ.', phonetic: 'Enikku samsarikkan kazhiyilla. Ezhuthi kaanikkū.' },
    pa: { native: 'ਮੈਂ ਬੋਲ/ਸੁਣ ਨਹੀਂ ਸਕਦਾ। ਕਿਰਪਾ ਕਰਕੇ ਲਿਖ ਕੇ ਦੱਸੋ।', phonetic: 'Main bol/sun nahin sakda. Likh ke dasso.' },
    es: { native: 'Soy sordo / mudo. Por favor comuníquese por escrito.', phonetic: 'Soy sordo. Por favor comuniquese por escrito.' },
    fr: { native: 'Je suis sourd / muet. Veuillez communiquer par écrit.', phonetic: 'Zhuh swee soor. Vuh-yay ko-moo-nee-kay par ay-kree.' },
  },
  BANK_WITHDRAW: {
    en: { native: 'I would like to withdraw cash from my bank account.', phonetic: 'Bank cash withdrawal' },
    hi: { native: 'मैं अपने खाते से नकदी निकालना चाहता हूँ।', phonetic: 'Main apne khaate se nakdi nikalna chahta hoon.' },
    ta: { native: 'எனது கணக்கிலிருந்து பணம் எடுக்க விரும்புகிறேன்.', phonetic: 'Enadhu kanakkilirundhu panam edukka virumbugiren.' },
    te: { native: 'నా ఖాతా నుండి నగదు తీసుకోవాలనుకుంటున్నాను.', phonetic: 'Naa khaata nundi nagadu teesukovaalanukuntunnanu.' },
    bn: { native: 'আমি আমার অ্যাকাউন্ট থেকে টাকা তুলতে চাই।', phonetic: 'Ami amar account theke taka tulte chai.' },
    mr: { native: 'मला माझ्या खात्यातून रोख रक्कम काढायची आहे.', phonetic: 'Mala majhya khaatyatun rokh rakkam kadhaychi aahe.' },
    kn: { native: 'ನನ್ನ ಖಾತೆಯಿಂದ ನಗದು ಹಣವನ್ನು ಹಿಂಪಡೆಯಲು ಬಯಸುತ್ತೇನೆ.', phonetic: 'Nanna khaatheyinda nagadu himpadeyalu bayasutthene.' },
    gu: { native: 'હું મારા ખાતામાંથી રોકડ ઉપાડવા માંગુ છું.', phonetic: 'Hoon mara khaata mathi rokad upadva maangu chhun.' },
    ml: { native: 'എന്റെ അക്കൗണ്ടിൽ നിന്ന് പണം പിൻവലിക്കാൻ ആഗ്രഹിക്കുന്നു.', phonetic: 'Ente accountil ninnu panam pinvalikkan aagrahikkunnu.' },
    pa: { native: 'ਮੈਂ ਆਪਣੇ ਖਾਤੇ ਵਿੱਚੋਂ ਪੈਸੇ ਕਢਵਾਉਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।', phonetic: 'Main apne khaate vicho paise kadhvauna chaunda haan.' },
    es: { native: 'Deseo retirar dinero en efectivo de mi cuenta.', phonetic: 'Deseo retirar dinero de mi cuenta.' },
    fr: { native: 'Je souhaite retirer des espèces de mon compte.', phonetic: 'Zhuh sweht ruh-tee-ray dayz es-pess.' },
  },
  TRANSIT_ROUTE: {
    en: { native: 'Does this bus / train stop at Central Station?', phonetic: 'Does this stop at Central Station?' },
    hi: { native: 'क्या यह बस / ट्रेन सेंट्रल स्टेशन पर रुकती है?', phonetic: 'Kya yeh bus/train Central Station par rukti hai?' },
    ta: { native: 'இந்த பேருந்து சென்ட்ரல் நிலையத்தில் நிற்குமா?', phonetic: 'Indha perundhu Central nilayathil nirkuma?' },
    te: { native: 'ఈ బస్సు సెంట్రల్ స్టేషన్ దగ్గర ఆగుతుందా?', phonetic: 'Ee bus Central Station daggara aagutunda?' },
    bn: { native: 'এই বাসটি কি সেন্ট্রাল স্টেশনে থামে?', phonetic: 'Ei bus ti ki Central Station e thame?' },
    mr: { native: 'ही बस सेंट्रल स्टेशनला थांबते का?', phonetic: 'Hee bus Central Station la thambte ka?' },
    kn: { native: 'ಈ ಬಸ್ಸು ಸೆಂಟ್ರಲ್ ನಿಲ್ದಾಣದಲ್ಲಿ ನಿಲ್ಲುತ್ತದೆಯೇ?', phonetic: 'Ee bus Central nildhanadalli nillutthadeye?' },
    gu: { native: 'શું આ બસ સેન્ટ્રલ સ્ટેશને ઉભી રહે છે?', phonetic: 'Shu aa bus Central Station e ubhi rahe chhe?' },
    ml: { native: 'ഈ ബസ് സെൻട്രൽ സ്റ്റേഷനിൽ നിർത്തുമോ?', phonetic: 'Ee bus Central Stationil nirthumo?' },
    pa: { native: 'ਕੀ ਇਹ ਬੱਸ ਸੈਂਟਰਲ ਸਟੇਸ਼ਨ ਤੇ ਰੁਕਦੀ ਹੈ?', phonetic: 'Ki eh bus Central Station te rukdi hai?' },
    es: { native: '¿Este autobús/tren se detiene en la Estación Central?', phonetic: 'Este autobus para en la Estacion Central?' },
    fr: { native: "Est-ce que ce bus s'arrête à la Gare Centrale ?", phonetic: 'Es-kuh suh boos sah-ret ah la Gar Sahn-tral ?' },
  },
  PAIN_SCALE: {
    en: { native: 'Severe pain level reported.', phonetic: 'Pain report' },
    hi: { native: 'तीव्र दर्द स्तर की सूचना दी गई।', phonetic: 'Teevra dard ki soochna' },
    ta: { native: 'கடுமையான வலி பதிவாகியுள்ளது.', phonetic: 'Kadu-maiyaana vali' },
    te: { native: 'తీవ్రమైన నొప్పి ఉన్నట్లు నివేదించబడింది.', phonetic: 'Teevramaina noppi' },
    bn: { native: 'তীব্র ব্যথার কথা জানানো হয়েছে।', phonetic: 'Tibro byatha' },
    mr: { native: 'तीव्र वेदनांची नोंद करण्यात आली आहे.', phonetic: 'Teevra vedna' },
    kn: { native: 'ತೀವ್ರವಾದ ನೋವು ವರದಿಯಾಗಿದೆ.', phonetic: 'Teevravaada novu' },
    gu: { native: 'ગંભીર દુખાવાની જાણ કરવામાં આવી છે.', phonetic: 'Gambhir dukhava ni jaan' },
    ml: { native: 'കഠിനമായ വേദന രേഖപ്പെടുത്തിയിട്ടുണ്ട്.', phonetic: 'Kadinamaaya vedana' },
    pa: { native: 'ਗੰਭੀਰ ਦਰਦ ਦਰਜ ਕੀਤਾ ਗਿਆ।', phonetic: 'Gambhir dard daraj keeta gaya.' },
    es: { native: 'Dolor severo reportado.', phonetic: 'Dolor severo reportado.' },
    fr: { native: 'Douleur intense signalée.', phonetic: 'Doo-loor an-tahnss see-nyah-lay.' },
  },
};

/**
 * Translates a phrase or sign key into the target regional language.
 * Falls back gracefully to English or raw text.
 */
export function translateSignToRegional(
  signOrText: string,
  targetLang: SupportedRegionalLang
): { text: string; phonetic: string; isDictionaryMatch: boolean } {
  if (!signOrText) {
    return { text: '', phonetic: '', isDictionaryMatch: false };
  }

  const normalized = signOrText.trim().toUpperCase().replace(/\s+/g, '_');
  const entry = REGIONAL_DICTIONARY[normalized];

  if (entry && entry[targetLang]) {
    return {
      text: entry[targetLang]!.native,
      phonetic: entry[targetLang]!.phonetic,
      isDictionaryMatch: true,
    };
  }

  // Check English fallback in dictionary
  if (entry && entry.en) {
    return {
      text: entry.en.native,
      phonetic: entry.en.phonetic,
      isDictionaryMatch: true,
    };
  }

  // Not in dictionary: return original text
  return {
    text: signOrText,
    phonetic: signOrText,
    isDictionaryMatch: false,
  };
}

/**
 * Returns BCP-47 locale tag for SpeechSynthesis
 */
export function getLocaleForLang(lang: SupportedRegionalLang): string {
  return REGIONAL_LANGUAGES[lang]?.locale || 'en-US';
}
