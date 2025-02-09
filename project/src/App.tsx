import React, { useEffect } from 'react';
import { ChevronUp, ChevronDown, MapPin, Heart, Share2, Info } from 'lucide-react';
import LocationCard from './components/LocationCard';
import { useLocations } from './hooks/useLocations';

function App() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { locations, loading, loadMoreLocations } = useLocations(5);

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'down' && currentIndex < locations.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (currentIndex >= locations.length - 2) {
        loadMoreLocations(2);
      }
    }
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden relative">
      {loading && currentIndex === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <>
          <div 
            className="h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {locations.map((location, index) => (
              <LocationCard key={location.id} location={location} isActive={index === currentIndex} />
            ))}
          </div>

          <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
            <button
              onClick={() => handleScroll('up')}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors disabled:opacity-50"
              disabled={currentIndex === 0}
            >
              <ChevronUp size={24} />
            </button>
            <button
              onClick={() => handleScroll('down')}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;