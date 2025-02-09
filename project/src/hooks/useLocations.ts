import { useState, useEffect } from 'react';
import { Location } from '../types';
import { getRandomLocation, getNearestMapillaryImage, getLocationInfo } from '../utils/maps';

export const useLocations = (initialCount: number = 5) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocation = async (): Promise<Location | null> => {
    try {
      const coordinates = getRandomLocation();
      const mapillaryImage = await getNearestMapillaryImage(coordinates);
      
      if (!mapillaryImage) return null;
      
      const locationInfo = await getLocationInfo(mapillaryImage);
      
      return {
        id: Date.now(),
        coordinates: { lat: mapillaryImage.lat, lng: mapillaryImage.lng },
        imageKey: mapillaryImage.key,
        name: locationInfo.name,
        description: locationInfo.description
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return null;
    }
  };

  const loadMoreLocations = async (count: number = 1) => {
    setLoading(true);
    const newLocations: Location[] = [];
    
    while (newLocations.length < count) {
      const location = await fetchLocation();
      if (location) {
        newLocations.push(location);
      }
    }
    
    setLocations(prev => [...prev, ...newLocations]);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreLocations(initialCount);
  }, [initialCount]);

  return { locations, loading, loadMoreLocations };
};