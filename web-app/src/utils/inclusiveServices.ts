/**
 * inclusiveServices.ts
 * Inclusive Digital Services & AAC Communicator Hub
 * Empowering persons with disabilities to independently access public,
 * financial, transit, healthcare, and emergency services.
 */

export type ServiceCategory = 'emergency' | 'health' | 'transit' | 'banking' | 'aac_core';

export interface ServiceCard {
  id: string;
  category: ServiceCategory;
  title: string;
  emoji: string;
  summary: string;
  fullMessage: string;
  regionalKey: string;
  urgency: 'critical' | 'high' | 'normal';
  accentColor: string;
}

export interface PainScaleLevel {
  score: number; // 0 to 10
  emoji: string;
  label: string;
  description: string;
  color: string;
}

export const PAIN_SCALE_LEVELS: PainScaleLevel[] = [
  { score: 0, emoji: '😊', label: 'No Hurt', description: 'Completely comfortable and pain-free.', color: '#10B981' },
  { score: 2, emoji: '🙂', label: 'Hurts A Little Bit', description: 'Mild annoyance, can be ignored easily.', color: '#34D399' },
  { score: 4, emoji: '😐', label: 'Hurts A Little More', description: 'Noticeable pain, interferes with complex tasks.', color: '#FBBF24' },
  { score: 6, emoji: '🙁', label: 'Hurts Even More', description: 'Moderate to strong pain, difficulty concentrating.', color: '#F97316' },
  { score: 8, emoji: '😣', label: 'Hurts A Whole Lot', description: 'Severe pain, impedes ability to communicate.', color: '#EF4444' },
  { score: 10, emoji: '😭', label: 'Hurts Worst Possible', description: 'Unbearable agony requiring emergency relief.', color: '#B91C1C' },
];

export const INCLUSIVE_SERVICE_CARDS: ServiceCard[] = [
  // ── EMERGENCY & SAFETY ──────────────────────────────────────────────────
  {
    id: 'sos_medical',
    category: 'emergency',
    title: 'Medical Emergency',
    emoji: '🚑',
    summary: 'Immediate ambulance / medical distress',
    fullMessage: 'EMERGENCY: I am experiencing a critical medical emergency. Please call an ambulance (108 / 911 / 112) immediately!',
    regionalKey: 'EMERGENCY_SOS',
    urgency: 'critical',
    accentColor: '#EF4444',
  },
  {
    id: 'sos_police',
    category: 'emergency',
    title: 'Police & Safety',
    emoji: '👮',
    summary: 'Threat or unsafe situation',
    fullMessage: 'SAFETY ALERT: I feel threatened and unsafe. Please call the police immediately and stay near me!',
    regionalKey: 'POLICE_HELP',
    urgency: 'critical',
    accentColor: '#DC2626',
  },
  {
    id: 'sos_lost',
    category: 'emergency',
    title: 'Lost / Need Assistance',
    emoji: '🆘',
    summary: 'Unable to communicate or find way',
    fullMessage: 'I am speech and hearing impaired and lost. Please look at my phone screen to help me contact my family / guardian.',
    regionalKey: 'CANNOT_SPEAK',
    urgency: 'high',
    accentColor: '#F59E0B',
  },

  // ── HEALTHCARE & CLINIC ─────────────────────────────────────────────────
  {
    id: 'health_symptoms',
    category: 'health',
    title: 'Severe Pain / Distress',
    emoji: '🩺',
    summary: 'Show pain scale to doctor/nurse',
    fullMessage: 'I am experiencing severe physical pain. Please refer to my selected pain rating and symptom chart on this screen.',
    regionalKey: 'PAIN_SCALE',
    urgency: 'high',
    accentColor: '#E11D48',
  },
  {
    id: 'health_interpreter',
    category: 'health',
    title: 'Sign Language Interpreter',
    emoji: '🤟',
    summary: 'Request certified interpreter',
    fullMessage: 'Under accessibility guidelines, I request a certified Indian/American Sign Language interpreter or digital relay interpreter for this medical consultation.',
    regionalKey: 'CANNOT_SPEAK',
    urgency: 'normal',
    accentColor: '#8B5CF6',
  },
  {
    id: 'health_allergies',
    category: 'health',
    title: 'Medication & Allergies',
    emoji: '💊',
    summary: 'Notify staff of medical conditions',
    fullMessage: 'Important medical advisory: Please inspect my digital emergency medical card for active allergies and ongoing medications before administering treatment.',
    regionalKey: 'CANNOT_SPEAK',
    urgency: 'high',
    accentColor: '#06B6D4',
  },

  // ── PUBLIC TRANSPORT & TRANSIT ──────────────────────────────────────────
  {
    id: 'transit_route',
    category: 'transit',
    title: 'Route & Destination Check',
    emoji: '🚌',
    summary: 'Verify bus / metro / train stops',
    fullMessage: 'Excuse me, does this transport stop at Central Station? Please nod or point when my stop arrives.',
    regionalKey: 'TRANSIT_ROUTE',
    urgency: 'normal',
    accentColor: '#3B82F6',
  },
  {
    id: 'transit_ramp',
    category: 'transit',
    title: 'Accessibility Ramp / Lift',
    emoji: '♿',
    summary: 'Wheelchair / boarding ramp request',
    fullMessage: 'Accessibility assistance needed: Please deploy the wheelchair boarding ramp or guide me to the nearest accessible elevator lift.',
    regionalKey: 'HELP',
    urgency: 'high',
    accentColor: '#2563EB',
  },
  {
    id: 'transit_ticket',
    category: 'transit',
    title: 'Purchase Transit Ticket',
    emoji: '🎫',
    summary: 'Buy ticket to destination',
    fullMessage: 'I would like to purchase one one-way transit ticket to my destination. I can pay by card, UPI, or cash.',
    regionalKey: 'PLEASE',
    urgency: 'normal',
    accentColor: '#0D9488',
  },

  // ── BANKING & ESSENTIAL SERVICES ────────────────────────────────────────
  {
    id: 'bank_withdraw',
    category: 'banking',
    title: 'Cash Withdrawal',
    emoji: '🏦',
    summary: 'Teller cash withdrawal request',
    fullMessage: 'I would like to withdraw cash from my bank account. Here is my passbook, account ID, and withdrawal slip.',
    regionalKey: 'BANK_WITHDRAW',
    urgency: 'normal',
    accentColor: '#10B981',
  },
  {
    id: 'bank_balance',
    category: 'banking',
    title: 'Account Balance & Statement',
    emoji: '📄',
    summary: 'Check balance and print statement',
    fullMessage: 'Please print my updated account passbook and tell me my current available account balance in writing.',
    regionalKey: 'PLEASE',
    urgency: 'normal',
    accentColor: '#059669',
  },
  {
    id: 'bank_fraud',
    category: 'banking',
    title: 'Dispute / Card Block',
    emoji: '🛡️',
    summary: 'Block lost/stolen card immediately',
    fullMessage: 'Urgent security request: Please immediately block my debit/credit card and verify recent unauthorized transactions.',
    regionalKey: 'HELP',
    urgency: 'high',
    accentColor: '#B45309',
  },
];

export interface AACTile {
  id: string;
  label: string;
  emoji: string;
  phrase: string;
  category: 'needs' | 'social' | 'feeling' | 'action';
  bgColor: string;
}

export const AAC_CORE_TILES: AACTile[] = [
  { id: 'water', label: 'Water', emoji: '💧', phrase: 'Can I please have some drinking water?', category: 'needs', bgColor: '#0284C7' },
  { id: 'food', label: 'Eat / Food', emoji: '🍱', phrase: 'I am hungry, I would like something to eat.', category: 'needs', bgColor: '#D97706' },
  { id: 'toilet', label: 'Restroom', emoji: '🚻', phrase: 'Could you please direct me to the nearest restroom?', category: 'needs', bgColor: '#7C3AED' },
  { id: 'help', label: 'Help Me', emoji: '🆘', phrase: 'I need assistance right now, please help me.', category: 'needs', bgColor: '#DC2626' },
  { id: 'yes', label: 'Yes', emoji: '✅', phrase: 'Yes, that is correct.', category: 'social', bgColor: '#16A34A' },
  { id: 'no', label: 'No', emoji: '❌', phrase: 'No, that is not what I want.', category: 'social', bgColor: '#EA580C' },
  { id: 'thank_you', label: 'Thank You', emoji: '🙏', phrase: 'Thank you very much for your help.', category: 'social', bgColor: '#059669' },
  { id: 'wait', label: 'Please Wait', emoji: '⏳', phrase: 'Please wait a moment, I need more time.', category: 'action', bgColor: '#4F46E5' },
  { id: 'happy', label: 'Feeling Good', emoji: '😄', phrase: 'I am feeling happy and comfortable.', category: 'feeling', bgColor: '#10B981' },
  { id: 'pain', label: 'In Pain', emoji: '😣', phrase: 'I am in pain, please help me.', category: 'feeling', bgColor: '#E11D48' },
  { id: 'tired', label: 'Tired / Rest', emoji: '😴', phrase: 'I am very tired and need to rest.', category: 'feeling', bgColor: '#64748B' },
  { id: 'medicine', label: 'Medicine', emoji: '💊', phrase: 'It is time for my medication.', category: 'needs', bgColor: '#0891B2' },
];
