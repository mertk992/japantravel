const { useState, useEffect, useRef, useMemo } = React;
const { createRoot } = ReactDOM;
const { motion, useScroll, useTransform, AnimatePresence } = window.Motion;

// --- Data ---
const itineraryData = [
    { id: 1, date: 'Dec 8', day: 'Mon', location: 'Tokyo', lat: 35.6895, lng: 139.6917, stay: 'Airbnb', activity: 'Shinjuku Gyoen' },
    { id: 2, date: 'Dec 9', day: 'Tue', location: 'Tokyo', lat: 35.6895, lng: 139.6917, stay: 'Airbnb', activity: 'Rikugien Gardens' },
    { id: 3, date: 'Dec 10', day: 'Wed', location: 'Tokyo', lat: 35.6895, lng: 139.6917, stay: 'Airbnb', activity: 'Arisugawa-no-miya' },
    { id: 4, date: 'Dec 11', day: 'Thu', location: 'Hakone', lat: 35.2324, lng: 139.1069, stay: 'Airbnb', activity: 'Ghibli Museum' },
    { id: 5, date: 'Dec 12', day: 'Fri', location: 'Hakone', lat: 35.2324, lng: 139.1069, stay: 'Airbnb', activity: 'Engaku-ji Temple' },
    { id: 6, date: 'Dec 13', day: 'Sat', location: 'Kyoto', lat: 35.0116, lng: 135.7681, stay: 'Airbnb', activity: 'Old Town / Hike' },
    { id: 7, date: 'Dec 14', day: 'Sun', location: 'Kyoto', lat: 35.0116, lng: 135.7681, stay: 'Airbnb', activity: 'Hakone Onsen' },
    { id: 8, date: 'Dec 15', day: 'Mon', location: 'Kyoto', lat: 35.0116, lng: 135.7681, stay: 'Airbnb', activity: 'Takaragawa Onsen' },
    { id: 9, date: 'Dec 16', day: 'Tue', location: 'Takayama', lat: 36.1408, lng: 137.2513, stay: 'Ryokan', activity: 'Explore Old Town' },
    { id: 10, date: 'Dec 17', day: 'Wed', location: 'Nagano', lat: 36.6485, lng: 138.1942, stay: 'Ryokan', activity: 'Travel Day' },
    { id: 11, date: 'Dec 18', day: 'Thu', location: 'Nagano', lat: 36.6485, lng: 138.1942, stay: 'Airbnb', activity: 'Shunkoin Temple' },
    { id: 12, date: 'Dec 19', day: 'Fri', location: 'Takaragawa', lat: 36.8450, lng: 139.0490, stay: 'Onsen', activity: 'Tea Master' },
    { id: 13, date: 'Dec 20', day: 'Sat', location: 'Ikaho', lat: 36.4989, lng: 138.9169, stay: 'Onsen', activity: 'Relaxation' },
    { id: 14, date: 'Dec 21', day: 'Sun', location: 'Ikaho', lat: 36.4989, lng: 138.9169, stay: 'Onsen', activity: 'Ikebana' },
    { id: 15, date: 'Dec 22', day: 'Mon', location: 'Ikaho', lat: 36.4989, lng: 138.9169, stay: 'Onsen', activity: 'Shodo' },
    { id: 16, date: 'Dec 23', day: 'Tue', location: 'Tokyo', lat: 35.6895, lng: 139.6917, stay: 'Hotel', activity: 'Kintsugi' },
    { id: 17, date: 'Dec 24', day: 'Wed', location: 'Disney Sea', lat: 35.6267, lng: 139.8851, stay: 'Hotel', activity: 'Disney Sea' },
    { id: 18, date: 'Dec 25', day: 'Thu', location: 'Tokyo', lat: 35.6895, lng: 139.6917, stay: 'Hotel', activity: 'Onsen Hopping' },
    { id: 19, date: 'Dec 26', day: 'Fri', location: 'Departure', lat: 35.5494, lng: 139.7798, stay: '-', activity: 'Fly Home' },
];

const initialPhotos = [
    'DSC00728.JPG', 'DSC00733.JPG', 'DSC00748.JPG', 'DSC00778.JPG',
    'DSC00788.JPG', 'DSC00803.JPG', 'DSC00814.JPG', 'DSC00861.JPG',
    'DSC00890.JPG', 'DSC00900.JPG', 'DSC00919.JPG', 'DSC00937.JPG',
    'DSC01006.JPG', 'DSC01013.JPG', 'DSC01020.JPG', 'PXL_20251209_123228792.jpg',
    'DSC01026.JPG', 'DSC01036.JPG', 'DSC01038.JPG', 'DSC01052.JPG',
    'DSC01062.JPG', 'DSC01076.JPG', 'DSC01091.JPG', 'PXL_20251212_010159920.jpg',
    'DSC01113.JPG', 'DSC01168.JPG', 'DSC01181.JPG', 'DSC01215.JPG',
    'DSC01244.JPG', 'DSC01246.JPG', 'DSC01252.JPG', 'PXL_20251212_014930925.jpg',
    'DSC01263.JPG', 'DSC01269.JPG', 'DSC01273.JPG', 'DSC01286.JPG',
    'DSC01371.JPG', 'DSC01378.JPG', 'DSC01447.JPG'
];

// --- Components ---

// --- Helpers ---
const toRad = (deg) => deg * Math.PI / 180;
const toDeg = (rad) => rad * 180 / Math.PI;

const getBearing = (startLat, startLng, destLat, destLng) => {
    const startLatRad = toRad(startLat);
    const startLngRad = toRad(startLng);
    const destLatRad = toRad(destLat);
    const destLngRad = toRad(destLng);

    const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad);
    const x = Math.cos(startLatRad) * Math.sin(destLatRad) -
        Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad);
    let brng = Math.atan2(y, x);
    brng = toDeg(brng);
    return (brng + 360) % 360;
};

const GrainOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-40 mix-blend-multiply">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
    </div>
);

const PhotoCard = ({ src, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-[85vh] md:h-[90vh] mb-24 md:mb-48 flex items-center justify-center bg-stone-50/50"
        >
            <img
                src={src.startsWith('http') ? src : `./photos/${src}`}
                alt="Japan Memory"
                className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-[2s] hover:scale-[1.02]"
                loading="lazy"
            />
            <div className="absolute top-4 right-4 text-stone-300 text-[10px] font-mono tracking-widest mix-blend-difference">
                NO. {index + 1}
            </div>
        </motion.div>
    );
};

// Memoized LogCard with Carousel
const LogCard = React.memo(({ item, onActivate, userNotes, folderPhotosList }) => {
    const [photoIndex, setPhotoIndex] = useState(0);

    const hasPhotos = folderPhotosList && folderPhotosList.length > 0;
    const currentPhoto = hasPhotos ? folderPhotosList[photoIndex] : null;

    const nextPhoto = (e) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + 1) % folderPhotosList.length);
    };

    const prevPhoto = (e) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev - 1 + folderPhotosList.length) % folderPhotosList.length);
    };

    return (
        <motion.div
            onViewportEnter={() => onActivate(item)}
            viewport={{ margin: "-50% 0px -50% 0px" }} // Tight center trigger
            className="min-h-[50vh] flex flex-col justify-center py-12 border-l border-stone-200 pl-8 md:pl-16 relative"
        >
            <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-stone-300 rounded-full ring-4 ring-white transition-colors duration-500`}></div>

            <div className="mb-6">
                <span className="font-sans text-xs tracking-widest uppercase text-stone-400 block mb-2">{item.date}</span>
                <h2 className="font-serif text-3xl font-bold text-stone-900 mb-2">{item.location}</h2>
            </div>

            {/* Photo Carousel */}
            {hasPhotos && (
                <div className="mb-8 relative w-full aspect-[4/3] bg-stone-100 rounded-sm overflow-hidden group">
                    <img
                        src={currentPhoto}
                        key={currentPhoto} // Trigger fade/re-render
                        className="w-full h-full object-cover transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Navigation - Only show if > 1 photo */}
                    {folderPhotosList.length > 1 && (
                        <>
                            <button
                                onClick={prevPhoto}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-sm backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            </button>

                            <button
                                onClick={nextPhoto}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-800 p-2 rounded-full shadow-sm backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                            </button>

                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono text-white tracking-widest">
                                {photoIndex + 1} / {folderPhotosList.length}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="relative">
                <p className="font-serif text-lg text-stone-700 leading-loose whitespace-pre-wrap">
                    {userNotes[item.id] || ''}
                </p>
            </div>
        </motion.div>
    );
});

const ScrollyMapJournal = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const previousActiveRef = useRef(null);
    const trainMarkerRef = useRef(null);
    const animationRef = useRef(null);

    // Notes State
    const [journalNotes, setJournalNotes] = useState(() => {
        const saved = localStorage.getItem('japanTripNotesV2');
        return saved ? JSON.parse(saved) : {};
    });

    // Folder Photos State (Automated)
    const [folderPhotos, setFolderPhotos] = useState({});

    // LOAD EXTERNAL DATA
    useEffect(() => {
        // Load Text
        fetch('./journal/data.json')
            .then(res => res.json())
            .then(data => {
                const loadedNotes = {};
                Object.keys(data).forEach(key => {
                    if (data[key].text) loadedNotes[key] = data[key].text;
                });
                setJournalNotes(prev => ({ ...prev, ...loadedNotes }));
            })
            .catch(err => console.log('No external journal data found', err));

        // Load Automated Folder Photos
        fetch('./journal/photo_map.json')
            .then(res => res.json())
            .then(data => setFolderPhotos(data))
            .catch(err => console.log('No photo map found', err));
    }, []);

    const routeBounds = useMemo(() => {
        const points = itineraryData.map(d => [d.lat, d.lng]);
        return L.latLngBounds(points);
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            const map = L.map(mapRef.current, {
                center: [35.6895, 139.6917],
                zoom: 5, // Initial zoom
                zoomControl: false,
                scrollWheelZoom: false,
                attributionControl: false,
                dragging: true
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            // Draw line
            const points = itineraryData.map(d => [d.lat, d.lng]);
            L.polyline(points, { color: '#b45309', weight: 2, opacity: 0.3, dashArray: '5, 10' }).addTo(map);

            // Shinkansen Icon
            const trainIcon = L.divIcon({
                className: 'train-icon-container',
                html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); transition: transform 0.1s linear;">🚅</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            // Initialize Train Marker at first point
            const firstPoint = itineraryData[0];
            const trainMarker = L.marker([firstPoint.lat, firstPoint.lng], {
                icon: trainIcon,
                zIndexOffset: 1000
            }).addTo(map);
            trainMarkerRef.current = trainMarker;

            // Add markers
            const uniqueLocations = Array.from(new Set(itineraryData.map(i => i.location)))
                .map(loc => itineraryData.find(i => i.location === loc));

            uniqueLocations.forEach((loc) => {
                const marker = L.circleMarker([loc.lat, loc.lng], {
                    radius: 5,
                    fillColor: '#b45309',
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1
                }).addTo(map);

                // Store marker reference keyeed by location string
                markersRef.current[loc.location] = marker;
            });

            // FIT BOUNDS ON LOAD
            map.fitBounds(routeBounds, { padding: [50, 50] });

            // Fix for potential resizing issues
            setTimeout(() => { map.invalidateSize(); }, 200);

            mapInstanceRef.current = map;
        }
    }, [routeBounds]);

    const handleActivate = (item) => {
        if (!mapInstanceRef.current || !trainMarkerRef.current) return;
        if (previousActiveRef.current === item.id) return;

        const prevId = previousActiveRef.current;
        previousActiveRef.current = item.id;

        // Find previous item to start animation from. If no previous item (first load), default to current (no movement).
        // note: prevId is just an ID, we need the object.
        const prevItem = itineraryData.find(i => i.id === prevId) || item;

        if (mapInstanceRef.current) {
            // Highlight Marker
            Object.values(markersRef.current).forEach(m => {
                m.setStyle({ radius: 5, color: '#fff', weight: 1 });
            });
            const activeMarker = markersRef.current[item.location];
            if (activeMarker) {
                activeMarker.setStyle({ radius: 8, color: '#fff', weight: 3 });
                activeMarker.bringToFront();
            }

            // FLY TO (Camera) - Slower 4s duration
            mapInstanceRef.current.stop();
            mapInstanceRef.current.flyTo([item.lat, item.lng], 12, {
                duration: 4,
                easeLinearity: 0.25
            });

            // ANIMATE TRAIN
            if (animationRef.current) cancelAnimationFrame(animationRef.current);

            const startLat = prevItem.lat;
            const startLng = prevItem.lng;
            const endLat = item.lat;
            const endLng = item.lng;

            // Calculate Bearing
            const bearing = getBearing(startLat, startLng, endLat, endLng);

            // Accessing the DOM element of the marker to rotate the emoji container
            const iconEl = trainMarkerRef.current.getElement();
            const innerDiv = iconEl ? iconEl.querySelector('div') : null;

            // If staying in same place, don't animate geometry
            if (startLat === endLat && startLng === endLng) {
                return;
            }

            if (innerDiv) {
                // Emoji 🚅 usually points Left. If bearing is North (0), it needs to rotate 90 deg?
                // Visual trial: 0 deg (North) -> Emoji needs to point UP. 
                // If Emoji points LEFT by default. Rotate 90 deg -> Points DOWN? 
                // CORRECT LOGIC: 
                // Default: Left (270). Target: North (0/360). Need +90.
                // Default: Left (270). Target: East (90). Need +180.
                // Formula: bearing + 90.
                innerDiv.style.transform = `rotate(${bearing + 90}deg)`;
            }

            const startTime = performance.now();
            const duration = 4000; // 4 seconds (matches flyTo)

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease function (easeInOutQuad / more pronounced)
                const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const currentLat = startLat + (endLat - startLat) * ease;
                const currentLng = startLng + (endLng - startLng) * ease;

                trainMarkerRef.current.setLatLng([currentLat, currentLng]);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        }
    };

    const handleResetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.fitBounds(routeBounds, { padding: [50, 50] });
        }
    }

    const handleNoteChange = (id, text) => {
        const newNotes = { ...journalNotes, [id]: text };
        setJournalNotes(newNotes);
        localStorage.setItem('japanTripNotesV2', JSON.stringify(newNotes));
    };

    return (
        <section className="relative">
            <div className="flex flex-col md:flex-row">

                {/* Sticky Map - Left */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-[calc(100vh-80px)] sticky top-[80px] z-0 bg-stone-100 border-r border-stone-200">
                    <div ref={mapRef} className="w-full h-full opacity-90"></div>
                    <div className="absolute bottom-8 left-8 pointer-events-none mix-blend-multiply z-20">
                        <p className="font-sans text-xs tracking-widest uppercase opacity-40">Interactive Route</p>
                    </div>
                    <button
                        onClick={handleResetView}
                        className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-stone-200 hover:border-amber-700 shadow-sm transition-colors rounded-sm"
                    >
                        View Full Route
                    </button>
                </div>

                {/* Scrolling Log - Right */}
                <div className="w-full md:w-1/2 bg-white relative z-10">
                    <div className="max-w-xl mx-auto px-6 md:px-12 py-24">
                        <div className="mb-24">
                            <h2 className="text-5xl font-serif font-black mb-6">The Journey</h2>
                            <p className="text-stone-500 font-sans text-sm leading-relaxed">
                                A day-by-day log of the trip.
                            </p>
                        </div>

                        {itineraryData.map(item => (
                            <LogCard
                                key={item.id}
                                item={item}
                                onActivate={handleActivate}
                                userNotes={journalNotes}
                                folderPhotosList={folderPhotos[item.id]}
                            />
                        ))}

                        <div className="h-[20vh]"></div> {/* Spacer */}
                    </div>
                </div>
            </div>
        </section>
    );
};

const PhotoGallery = ({ photos }) => {
    return (
        <div className="min-h-screen py-32 md:py-48 px-4 md:px-0 bg-white">
            <div className="text-center mb-24">
                <p className="font-sans text-xs tracking-[0.3em] uppercase text-stone-400 mb-4">The Collection</p>
                <h2 className="text-4xl md:text-5xl font-serif font-medium text-stone-900">Captured Moments</h2>
            </div>
            <div className="max-w-4xl mx-auto mb-24">
                {photos.map((photo, index) => (
                    <PhotoCard
                        key={index}
                        src={photo}
                        index={index}
                    />
                ))}
            </div>

            {/* External Link Footer */}
            <div className="text-center py-12 border-t border-stone-100 max-w-xl mx-auto">
                <a
                    href="https://photos.app.goo.gl/ZTtsSChezEMbxvP48"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-full transition-all hover:shadow-lg"
                >
                    <i data-lucide="image" className="w-5 h-5 text-stone-400 group-hover:text-amber-700 transition-colors"></i>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-stone-600 group-hover:text-stone-900">View Full Album on Google Photos</span>
                    <i data-lucide="external-link" className="w-4 h-4 text-stone-400"></i>
                </a>
            </div>
        </div>
    );
};


const Hero = () => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <header className="h-[60vh] relative overflow-hidden bg-stone-100 flex items-center justify-center">
            <div className="text-center z-10 p-12">
                <motion.div style={{ opacity }}>
                    <p className="font-sans text-xs tracking-[0.5em] uppercase text-stone-900 mb-6 font-bold">Visual Journal</p>
                    <h1 className="text-8xl md:text-[12rem] font-serif font-black text-stone-900 leading-none tracking-tighter">
                        Japan
                    </h1>
                    <p className="font-serif italic text-stone-900 mt-6 text-xl">2025</p>
                </motion.div>
            </div>

            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img
                    src="./photos/DSC00748.JPG"
                    className="w-full h-full object-cover object-center filter grayscale contrast-125"
                />
            </div>
        </header>
    );
};

// Toggle Bar Component
const ViewToggle = ({ activeView, onViewChange }) => {
    return (
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 flex justify-center shadow-sm">
            <div className="flex">
                <button
                    onClick={() => onViewChange('journal')}
                    className={`
                        px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors
                        ${activeView === 'journal' ? 'text-amber-800 border-b-2 border-amber-800' : 'text-stone-400 hover:text-stone-900'}
                    `}
                >
                    Journal
                </button>
                <div className="w-[1px] bg-stone-200 my-4"></div>
                <button
                    onClick={() => onViewChange('gallery')}
                    className={`
                        px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors
                        ${activeView === 'gallery' ? 'text-amber-800 border-b-2 border-amber-800' : 'text-stone-400 hover:text-stone-900'}
                    `}
                >
                    Gallery
                </button>
            </div>
        </div>
    );
};

const App = () => {
    const [photos] = useState(initialPhotos);
    const [activeView, setActiveView] = useState('journal'); // 'journal' or 'gallery'

    return (
        <div className="bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-300 selection:text-stone-900 min-h-screen flex flex-col">
            <GrainOverlay />

            <Hero />

            <ViewToggle activeView={activeView} onViewChange={setActiveView} />

            <AnimatePresence mode="wait">
                {activeView === 'journal' ? (
                    <motion.div
                        key="journal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <ScrollyMapJournal />
                    </motion.div>
                ) : (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <PhotoGallery photos={photos} />
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="py-24 bg-stone-900 text-stone-400 text-center relative z-10 mt-auto">
                <p className="text-xs font-mono opacity-40">2025 Japan Trip</p>
            </footer>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
}, 500);
