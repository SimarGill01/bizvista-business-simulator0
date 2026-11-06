// Central type/shape definitions as plain objects (JS project, no TS types).
// These document the shape of persisted state for every module.

export const INDUSTRIES = [
  { id: 'technology', label: 'Technology', icon: 'Cpu', baseDemand: 980, competition: 1.05, costProfile: 0.45, blurb: 'Software, gadgets & SaaS products' },
  { id: 'fashion', label: 'Fashion', icon: 'Shirt', baseDemand: 820, competition: 1.15, costProfile: 0.5, blurb: 'Apparel, accessories & lifestyle' },
  { id: 'food', label: 'Food & Beverage', icon: 'UtensilsCrossed', baseDemand: 1120, competition: 1.0, costProfile: 0.55, blurb: 'Restaurants, cafés & packaged food' },
  { id: 'retail', label: 'Retail', icon: 'ShoppingBag', baseDemand: 900, competition: 1.1, costProfile: 0.6, blurb: 'General merchandise & stores' },
  { id: 'education', label: 'Education', icon: 'GraduationCap', baseDemand: 700, competition: 0.95, costProfile: 0.35, blurb: 'Courses, coaching & e-learning' },
  { id: 'healthcare', label: 'Healthcare', icon: 'HeartPulse', baseDemand: 760, competition: 1.0, costProfile: 0.4, blurb: 'Clinics, wellness & medical products' },
];

export const CAPITAL_OPTIONS = [
  { id: 'c1', label: '₹1,00,000', value: 100000, desc: 'Lean startup' },
  { id: 'c2', label: '₹5,00,000', value: 500000, desc: 'Growth-ready' },
  { id: 'c3', label: '₹10,00,000', value: 1000000, desc: 'Well-funded' },
];

export const MARKETING_CHANNELS = [
  { id: 'social', label: 'Social Media Marketing', icon: 'Share2', reachPerRupee: 0.18, conversionRate: 0.022, color: '#B8F34A', blurb: 'Instagram, Facebook, LinkedIn & X' },
  { id: 'influencer', label: 'Influencer Marketing', icon: 'Star', reachPerRupee: 0.12, conversionRate: 0.038, color: '#7C83FF', blurb: 'Creators & brand ambassadors' },
  { id: 'search', label: 'Search Advertising', icon: 'Search', reachPerRupee: 0.09, conversionRate: 0.05, color: '#60A5FA', blurb: 'Google & Bing paid search' },
  { id: 'traditional', label: 'Traditional Advertising', icon: 'Newspaper', reachPerRupee: 0.07, conversionRate: 0.012, color: '#FBBF24', blurb: 'Print, radio & outdoor' },
];

export const BUSINESS_EVENT_TYPES = [
  { id: 'competitor_price_cut', label: 'Competitor price reduction', icon: 'Swords' },
  { id: 'demand_surge', label: 'Increased market demand', icon: 'TrendingUp' },
  { id: 'cost_increase', label: 'Higher operating costs', icon: 'AlertTriangle' },
  { id: 'marketing_success', label: 'Successful marketing campaign', icon: 'Rocket' },
  { id: 'supply_disruption', label: 'Supply chain disruption', icon: 'Truck' },
  { id: 'economic_boom', label: 'Economic boom', icon: 'Sparkles' },
];
