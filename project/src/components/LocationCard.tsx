import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Heart, Share2, Info } from 'lucide-react';
import { Location } from '../types';
import { initializeMapillaryViewer } from '../utils/maps';
import { Viewer as MapillaryViewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

interface LocationCardProps {
  location: Location;
  isActive: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isActive }) => {
  const [liked, setLiked] = useState(false);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<MapillaryViewer | null>(null);

  const formatCoordinates = (coords: { lat: number; lng: number }) => {
    const lat = Math.abs(coords.lat).toFixed(4) + '° ' + (coords.lat >= 0 ? 'N' : 'S');
    const lng = Math.abs(coords.lng).toFixed(4) + '° ' + (coords.lng >= 0 ? 'E' : 'W');
    return `${lat}, ${lng}`;
  };

  useEffect(() => {
    if (isActive && viewerContainerRef.current && location.imageKey) {
      viewerRef.current = initializeMapillaryViewer(viewerContainerRef.current, location.imageKey);
      
      return () => {
        viewerRef.current?.remove();
      };
    }
  }, [isActive, location.imageKey]);

  const handleShare = async () => {
    try {
      const shareData = {
        title: location.name,
        text: `Check out this amazing location: ${location.name}`,
        url: `https://www.openstreetmap.org/#map=15/${location.coordinates.lat}/${location.coordinates.lng}`,
      };
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="h-screen w-full relative">
      <div ref={viewerContainerRef} className="h-full w-full" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      <div className="absolute bottom-0 left-0 p-6 text-white z-10 w-full">
        <div className="flex justify-between items-end">
          <div className="max-w-[80%]">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="inline-block" size={24} />
              {location.name}
            </h2>
            <p className="text-sm text-gray-200 mb-4">{formatCoordinates(location.coordinates)}</p>
            <p className="text-base">{location.description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Heart
                size={24}
                className={liked ? 'fill-red-500 stroke-red-500' : ''}
              />
            </button>
            <button 
              onClick={handleShare}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Share2 size={24} />
            </button>
            <a
              href={`https://www.openstreetmap.org/#map=15/${location.coordinates.lat}/${location.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Info size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;