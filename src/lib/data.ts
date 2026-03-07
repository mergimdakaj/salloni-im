export const SERVICES = [
  { id: '1', name: 'Prerje & Fenirim', category: 'Flokë', price: 25, duration: 60, color: 'bg-pink-500' },
  { id: '2', name: 'Shatir / Balayage', category: 'Flokë', price: 120, duration: 180, color: 'bg-purple-500' },
  { id: '3', name: 'Ngjyrosje', category: 'Flokë', price: 50, duration: 90, color: 'bg-indigo-500' },
  { id: '4', name: 'Mbjellja e Qerpikëve', category: 'Sytë', price: 40, duration: 120, color: 'bg-blue-500' },
  { id: '5', name: 'Vetulla Microblading', category: 'Sytë', price: 150, duration: 150, color: 'bg-teal-500' },
  { id: '6', name: 'Tattoo Artistike (E vogël)', category: 'Tattoo', price: 80, duration: 60, color: 'bg-black' },
  { id: '7', name: 'Manikyr Xhel', category: 'Thonjtë', price: 20, duration: 60, color: 'bg-red-500' },
];

export const STAFF = [
  { 
    id: '1', 
    name: 'Elira Gashi', 
    role: 'Stiliste e Lartë', 
    avatar: '/images/staff/staff-1.jpg?v=2',
    fallbackAvatar: 'https://i.pravatar.cc/150?u=elira',
    bio: 'Elira ka mbi 10 vite eksperiencë në industrinë e bukurisë. Ajo është e specializuar në prerje moderne dhe transformime të mëdha.',
    experience: 12,
    diplomas: ['Akademia e Bukurisë Paris', 'Master Class Vidal Sassoon', 'Certifikatë për Kolorimetri të Avancuar'],
    isSenior: true,
    serviceIds: ['1', '2', '3', '7'] // Hair & Nails
  },
  { 
    id: '2', 
    name: 'Besa Krasniqi', 
    role: 'Specialiste e Ngjyrave', 
    avatar: '/images/staff/staff-2.jpg',
    fallbackAvatar: 'https://i.pravatar.cc/150?u=besa',
    bio: 'Besa është eksperte e ngjyrave dhe teknikave Balayage. Ajo sjell trendet më të fundit botërore në sallonin tonë.',
    experience: 8,
    diplomas: ['L\'Oréal Professional Colorist', 'Diploma për Balayage & Ombre'],
    isSenior: true,
    serviceIds: ['2', '3'] // Only Color
  },
  { 
    id: '3', 
    name: 'Drita Hoxha', 
    role: 'Artiste e Qerpikëve & Vetullave', 
    avatar: '/images/staff/staff-3.jpg',
    fallbackAvatar: 'https://i.pravatar.cc/150?u=drita',
    bio: 'Me një dorë të lehtë dhe precize, Drita krijon shikime magjepsëse përmes zgjatjes së qerpikëve dhe microblading.',
    experience: 5,
    diplomas: ['Phibrows Microblading Artist', 'Lash Extension Expert Level 2'],
    isSenior: false,
    serviceIds: ['4', '5'] // Lashes & Brows
  },
  { 
    id: '4', 
    name: 'Artan Berisha', 
    role: 'Artist Tattoo', 
    avatar: '/images/staff/staff-4.jpg?v=2',
    fallbackAvatar: 'https://i.pravatar.cc/150?u=artan',
    bio: 'Artani është artist i diplomuar në arte pamore dhe sjell kreativitetin e tij në çdo tatuazh unik.',
    experience: 6,
    diplomas: ['Fakulteti i Arteve - Grafikë', 'Health & Safety Tattoo Certification'],
    isSenior: false,
    serviceIds: ['6'] // Only Tattoo
  },
];

export const APPOINTMENTS = [
  { id: '1', client: 'Vlora M.', serviceId: '2', staffId: '2', date: new Date().toISOString(), status: 'booked' },
  { id: '2', client: 'Teuta S.', serviceId: '1', staffId: '1', date: new Date(Date.now() + 3600000).toISOString(), status: 'booked' },
  { id: '3', client: 'Gentiana K.', serviceId: '5', staffId: '3', date: new Date(Date.now() - 3600000).toISOString(), status: 'completed' },
];
