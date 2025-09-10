interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

interface RouteData {
  geometry: [number, number][];
  steps: RouteStep[];
  totalDistance: number;
  totalDuration: number;
}

export type { RouteStep, RouteData };

// Alternative approach using OSRM (Open Source Routing Machine) - No API key needed
export const getRouteFromWindhoek = async (
  destination: [number, number] = [-19.195082, 18.311077]
): Promise<RouteData | null> => {
  try {
    const windhoek: [number, number] = [17.0658, -22.5609]; // OSRM uses [lng, lat]
    const farmAris: [number, number] = [18.311077, -19.195082];
    
    // Try OSRM public server first
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${windhoek[0]},${windhoek[1]};${farmAris[0]},${farmAris[1]}?steps=true&geometries=geojson&overview=full`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.routes || !data.routes[0]) {
      throw new Error('No route found');
    }

    const route = data.routes[0];
    
    return {
      geometry: route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
      steps: route.legs[0]?.steps?.map((step: any) => ({
        instruction: step.maneuver?.instruction || 'Continue',
        distance: step.distance || 0,
        duration: step.duration || 0
      })) || [],
      totalDistance: route.distance / 1000, // Convert to km
      totalDuration: route.duration
    };
  } catch (error) {
    console.error('Error fetching route from OSRM, falling back to estimated route:', error);
    
    // Fallback: Create an estimated route with waypoints
    return createEstimatedRoute();
  }
};

// Fallback function to create an estimated route following major roads
const createEstimatedRoute = (): RouteData => {
  const windhoek: [number, number] = [-22.5609, 17.0658];
  const farmAris: [number, number] = [-19.195082, 18.311077];
  
  // Create waypoints following major highways (B1 and B8)
  const waypoints: [number, number][] = [
    windhoek,
    [-21.8, 17.1], // Northeast towards Okahandja
    [-21.0, 17.3], // Towards Otjiwarongo
    [-20.2, 17.8], // Via B8 towards Otavi
    [-19.6, 18.1], // Approaching Grootfontein
    farmAris
  ];
  
  // Estimate distance and time
  const estimatedDistance = 350; // km (approximate)
  const estimatedDuration = 4.5 * 3600; // 4.5 hours in seconds
  
  return {
    geometry: waypoints,
    steps: [
      { instruction: 'Head northeast on B1 towards Okahandja', distance: 70000, duration: 3600 },
      { instruction: 'Continue on B1 towards Otjiwarongo', distance: 80000, duration: 3900 },
      { instruction: 'Turn right onto B8 towards Otavi', distance: 120000, duration: 4800 },
      { instruction: 'Continue on B8 towards Grootfontein', distance: 60000, duration: 2700 },
      { instruction: 'Arrive at Farm Aris', distance: 20000, duration: 900 }
    ],
    totalDistance: estimatedDistance,
    totalDuration: estimatedDuration
  };
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};