import { Viewer as MapillaryViewer } from 'mapillary-js';

const MAPILLARY_ACCESS_TOKEN = 'MLY|9905440086150299|52cb75564adeb853e1460ebc95f0b532';

export const getRandomLocation = (): { lat: number; lng: number } => {
  const lat = Math.random() * 140 - 70; 
  const lng = Math.random() * 360 - 180;
  return { lat, lng };
};

export const getNearestMapillaryImage = async (
  location: { lat: number; lng: number }
): Promise<{ key: string; lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://graph.mapillary.com/images?access_token=${MAPILLARY_ACCESS_TOKEN}&fields=id,geometry&limit=1&radius=2000&` +
      `bbox=${location.lng - 0.02},${location.lat - 0.02},${location.lng + 0.02},${location.lat + 0.02}`
    );
    
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const image = data.data[0];
      return {
        key: image.id,
        lat: image.geometry.coordinates[1],
        lng: image.geometry.coordinates[0]
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching Mapillary image:', error);
    return null;
  }
};

export const getLocationInfo = async (
  location: { lat: number; lng: number }
): Promise<{ name: string; description: string }> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
    );
    const data = await response.json();
    
    return {
      name: data.display_name.split(',')[0],
      description: data.display_name
    };
  } catch (error) {
    console.error('Error fetching location info:', error);
    return {
      name: 'Unknown Location',
      description: `Location at ${location.lat.toFixed(4)}°, ${location.lng.toFixed(4)}°`
    };
  }
};

export const initializeMapillaryViewer = (
  container: HTMLElement,
  imageId: string
): MapillaryViewer => {
  const viewer = new MapillaryViewer({
    accessToken: MAPILLARY_ACCESS_TOKEN,
    container,
    imageId
  });
  
  return viewer;
};