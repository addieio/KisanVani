export interface QuickStat {
  id: string;
  title: string;
  value: string;
  subtext: string;
  change?: string;
  isPositive?: boolean;
  iconName: string;
}

export interface CropListing {
  id: string;
  title: string;
  variety: string;
  farmerName: string;
  farmerPhone: string; // E.164 format e.g. +919876543210
  cluster: string;
  locationKm: number;
  grade: 'Grade A' | 'Grade A+' | 'Export Grade';
  farmingType: 'Organic' | 'Hydroponic' | 'Natural';
  imageUrl: string;
  healthScore: number;
  healthMetrics: {
    pesticide: string;
    npkLevel: string;
    moisture: string;
    harvestedHoursAgo: number;
  };
  currentBid: number;
  buyNowPrice: number;
  lotSizeKg: number;
  availableLots: number;
  bidCount: number;
  timeLeft: string;
  isOfflineVoicePost?: boolean;
  rawSpeech?: string;
}

export type EscrowStatus = 'ACCEPTED' | 'IN_TRANSIT' | 'HANDOVER_PENDING' | 'PAID';

export interface OrderItem {
  id: string;
  cropName: string;
  quantityKg: number;
  farmerName: string;
  farmerLocation: string;
  totalValue: number;
  escrowStatus: EscrowStatus;
  escrowStatusLabel: string;
  passcode?: string;
  orderedAt: string;
  eta?: string;
  vehicleNo?: string;
  temperatureC?: number;
}

export interface LogisticsRing {
  ringId: number;
  title: string;
  subtitle: string;
  distanceRange: string;
  ratePerKg: number;
  leadTimeHours: string;
  co2SavingsPercent: number;
  isRecommended?: boolean;
  description: string;
}

export const QUICK_STATS: QuickStat[] = [
  {
    id: 'spent',
    title: 'Total Spent This Month',
    value: '₹1,24,500',
    change: '+12%',
    isPositive: true,
    subtext: 'vs. ₹1,11,160 last month',
    iconName: 'IndianRupee',
  },
  {
    id: 'orders',
    title: 'Active Orders',
    value: '4',
    subtext: '2 In Transit • 1 Pending Handover',
    change: 'On Schedule',
    isPositive: true,
    iconName: 'PackageCheck',
  },
  {
    id: 'saved',
    title: 'Saved vs Mandi Price',
    value: '₹18,200',
    change: '15% savings',
    isPositive: true,
    subtext: 'Direct farm gate disintermediation',
    iconName: 'TrendingDown',
  },
  {
    id: 'health',
    title: 'Avg. Sensor Health Score',
    value: '96%',
    change: 'Grade A',
    isPositive: true,
    subtext: 'IoT sensor field telemetry verified',
    iconName: 'Activity',
  },
];

export const CROP_LISTINGS: CropListing[] = [
  {
    id: 'crop-1',
    title: 'Hybrid Red Bell Peppers',
    variety: 'Indam Shimla Mirch',
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+919876543210', // Phone number +919876543210
    cluster: 'Sonipat Cluster, Haryana',
    locationKm: 15,
    grade: 'Grade A',
    farmingType: 'Organic',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    healthScore: 98,
    healthMetrics: {
      pesticide: 'Zero pesticide residue (<0.01 ppm)',
      npkLevel: 'Optimal NPK (4:2:1)',
      moisture: '78% crispness index',
      harvestedHoursAgo: 4,
    },
    currentBid: 55,
    buyNowPrice: 62,
    lotSizeKg: 300,
    availableLots: 3,
    bidCount: 14,
    timeLeft: '1h 42m',
  },
  {
    id: 'crop-2',
    title: 'Polyhouse Cherry Tomatoes',
    variety: 'San Marzano Sweet',
    farmerName: 'Suresh Verma',
    farmerPhone: '+919876543210', // Phone number +919876543210
    cluster: 'Karnal Belt, Haryana',
    locationKm: 28,
    grade: 'Grade A+',
    farmingType: 'Hydroponic',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    healthScore: 95,
    healthMetrics: {
      pesticide: 'Biocontrol certified (No synthetic)',
      npkLevel: 'Balanced nitrogen feed',
      moisture: '84% brix juice index',
      harvestedHoursAgo: 2,
    },
    currentBid: 38,
    buyNowPrice: 44,
    lotSizeKg: 500,
    availableLots: 5,
    bidCount: 9,
    timeLeft: '3h 15m',
  },
  {
    id: 'crop-3',
    title: 'Mountain Crown Broccoli',
    variety: 'Calabrese Dark Green',
    farmerName: 'Anita Devi',
    farmerPhone: '+919876543210', // Phone number +919876543210
    cluster: 'Najafgarh Green Zone, Delhi NCR',
    locationKm: 9,
    grade: 'Grade A',
    farmingType: 'Organic',
    imageUrl: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=800&q=80',
    healthScore: 97,
    healthMetrics: {
      pesticide: 'Zero chemical spray (Neem oil only)',
      npkLevel: 'Organic compost enriched',
      moisture: '91% compact florets',
      harvestedHoursAgo: 3,
    },
    currentBid: 68,
    buyNowPrice: 76,
    lotSizeKg: 200,
    availableLots: 2,
    bidCount: 21,
    timeLeft: '48m',
  },
];

export const ACTIVE_ORDERS: OrderItem[] = [
  {
    id: '#ORD-8821',
    cropName: 'Plum Tomatoes (Grade A)',
    quantityKg: 400,
    farmerName: 'Ramesh K.',
    farmerLocation: 'Sonipat Cluster',
    totalValue: 11200,
    escrowStatus: 'HANDOVER_PENDING',
    escrowStatusLabel: 'Handover Pending',
    passcode: 'KV-9942',
    orderedAt: 'Today, 06:30 AM',
    eta: 'Arriving in 15 mins (At Loading Dock 2)',
    vehicleNo: 'HR-10-BX-4421',
    temperatureC: 14,
  },
  {
    id: '#ORD-8819',
    cropName: 'Hybrid Red Bell Peppers',
    quantityKg: 650,
    farmerName: 'Suresh Verma',
    farmerLocation: 'Karnal Belt',
    totalValue: 35750,
    escrowStatus: 'IN_TRANSIT',
    escrowStatusLabel: 'In Transit',
    orderedAt: 'Today, 05:15 AM',
    eta: 'Today, 03:30 PM (Kundli Border Passed)',
    vehicleNo: 'HR-45-C-8910',
    temperatureC: 11,
  },
  {
    id: '#ORD-8815',
    cropName: 'Mountain Crown Broccoli',
    quantityKg: 250,
    farmerName: 'Anita Devi',
    farmerLocation: 'Najafgarh Zone',
    totalValue: 17000,
    escrowStatus: 'IN_TRANSIT',
    escrowStatusLabel: 'In Transit',
    orderedAt: 'Today, 07:00 AM',
    eta: 'Today, 01:15 PM (Dwarka Expressway)',
    vehicleNo: 'DL-1L-AA-3819',
    temperatureC: 9,
  },
  {
    id: '#ORD-8802',
    cropName: 'Kufri Jyoti Baby Potatoes',
    quantityKg: 1200,
    farmerName: 'Vikram Singh',
    farmerLocation: 'Meerut Outer Farms',
    totalValue: 21600,
    escrowStatus: 'PAID',
    escrowStatusLabel: 'Completed & Paid',
    orderedAt: 'Yesterday, 04:00 PM',
    passcode: 'KV-6180',
    vehicleNo: 'UP-14-BT-9102',
  },
  {
    id: '#ORD-8798',
    cropName: 'Fresh Coriander & Mint Herbs',
    quantityKg: 180,
    farmerName: 'Satish Yadav',
    farmerLocation: 'Palwal Green Belt',
    totalValue: 8900,
    escrowStatus: 'ACCEPTED',
    escrowStatusLabel: 'Accepted by Farmer',
    orderedAt: 'Today, 08:15 AM',
    eta: 'Harvesting now, dispatch by 2:00 PM',
  },
];

export const LOGISTICS_RINGS: LogisticsRing[] = [
  {
    ringId: 1,
    title: 'Ring 1: Direct Express Delivery',
    subtitle: 'Point-to-point refrigerated EV dispatch',
    distanceRange: '< 80 km',
    ratePerKg: 4.0,
    leadTimeHours: '2-4 hours',
    co2SavingsPercent: 42,
    description: 'Fastest farm gate to cold storage turnaround. Dedicated electric mini-truck route.',
  },
  {
    ringId: 2,
    title: 'Ring 2: Pooled Village Cluster',
    subtitle: 'Smart multi-farm route consolidation',
    distanceRange: '80 - 300 km',
    ratePerKg: 2.5,
    leadTimeHours: '6-8 hours',
    co2SavingsPercent: 68,
    isRecommended: true,
    description: 'Optimal economics. Produce is aggregated at solar cold hubs across Sonipat & Karnal before batch delivery.',
  },
  {
    ringId: 3,
    title: 'Ring 3: Return-Leg Backhaul',
    subtitle: 'Empty reefer return truck discount',
    distanceRange: 'Return-leg',
    ratePerKg: 1.8,
    leadTimeHours: '12-16 hours',
    co2SavingsPercent: 85,
    description: 'Lowest carbon footprint. Utilizes verified return-leg cold chain trucks returning to Delhi NCR wholesale hubs.',
  },
];
