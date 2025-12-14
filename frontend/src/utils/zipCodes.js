// California ZIP codes with cities (popular areas)
export const californiaZipCodes = [
  { zip: '90001', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90002', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90210', city: 'Beverly Hills', county: 'Los Angeles' },
  { zip: '90211', city: 'Beverly Hills', county: 'Los Angeles' },
  { zip: '91101', city: 'Pasadena', county: 'Los Angeles' },
  { zip: '91801', city: 'Alhambra', county: 'Los Angeles' },
  { zip: '92101', city: 'San Diego', county: 'San Diego' },
  { zip: '92102', city: 'San Diego', county: 'San Diego' },
  { zip: '92103', city: 'San Diego', county: 'San Diego' },
  { zip: '92697', city: 'Irvine', county: 'Orange' },
  { zip: '92618', city: 'Irvine', county: 'Orange' },
  { zip: '92626', city: 'Costa Mesa', county: 'Orange' },
  { zip: '92701', city: 'Santa Ana', county: 'Orange' },
  { zip: '93101', city: 'Santa Barbara', county: 'Santa Barbara' },
  { zip: '94101', city: 'San Francisco', county: 'San Francisco' },
  { zip: '94102', city: 'San Francisco', county: 'San Francisco' },
  { zip: '94103', city: 'San Francisco', county: 'San Francisco' },
  { zip: '94301', city: 'Palo Alto', county: 'Santa Clara' },
  { zip: '94401', city: 'San Mateo', county: 'San Mateo' },
  { zip: '94501', city: 'Alameda', county: 'Alameda' },
  { zip: '95101', city: 'San Jose', county: 'Santa Clara' },
  { zip: '95110', city: 'San Jose', county: 'Santa Clara' },
  { zip: '95401', city: 'Santa Rosa', county: 'Sonoma' },
  { zip: '90011', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90012', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90013', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90014', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90015', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90016', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90017', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90018', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90019', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90020', city: 'Los Angeles', county: 'Los Angeles' },
  { zip: '90291', city: 'Venice', county: 'Los Angeles' },
  { zip: '90292', city: 'Marina del Rey', county: 'Los Angeles' },
  { zip: '90401', city: 'Santa Monica', county: 'Los Angeles' },
  { zip: '90402', city: 'Santa Monica', county: 'Los Angeles' },
  { zip: '90403', city: 'Santa Monica', county: 'Los Angeles' },
  { zip: '90501', city: 'Torrance', county: 'Los Angeles' },
  { zip: '90601', city: 'Whittier', county: 'Los Angeles' },
  { zip: '90701', city: 'Artesia', county: 'Los Angeles' },
  { zip: '90801', city: 'Long Beach', county: 'Los Angeles' },
  { zip: '90802', city: 'Long Beach', county: 'Los Angeles' },
  { zip: '91001', city: 'Altadena', county: 'Los Angeles' },
  { zip: '91201', city: 'Glendale', county: 'Los Angeles' },
  { zip: '91301', city: 'Agoura Hills', county: 'Los Angeles' },
  { zip: '91401', city: 'Van Nuys', county: 'Los Angeles' },
  { zip: '91501', city: 'Burbank', county: 'Los Angeles' },
  { zip: '91601', city: 'North Hollywood', county: 'Los Angeles' },
  { zip: '91701', city: 'Rancho Cucamonga', county: 'San Bernardino' },
];

export const searchZipCodes = (query) => {
  if (!query || query.length < 2) return [];
  
  const q = query.toLowerCase();
  
  return californiaZipCodes.filter(item => 
    item.zip.startsWith(q) || 
    item.city.toLowerCase().includes(q) ||
    item.county.toLowerCase().includes(q)
  ).slice(0, 8);
};
