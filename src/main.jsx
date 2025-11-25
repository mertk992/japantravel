const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;
const { motion, AnimatePresence } = window.Motion;

// --- Real Data with Costs & Tips ---
const initialTripData = [
    {
        id: 1,
        date: "2025-12-08",
        day: "Day 1",
        location: "Shinjuku, Tokyo",
        lat: 35.6938, lng: 139.7034,
        activities: [
            { id: 101, time: "14:00", title: "Arrive at Haneda", cost: 0, type: "transport", notes: "Booked (A744147) PU at Haneda", tip: "Get a Welcome Suica card at the airport for easy travel." },
            { id: 102, time: "16:00", title: "Check-in Airbnb", cost: 0, type: "accommodation", notes: "https://www.airbnb.com/rooms/1248982729172349445", tip: "Remember to take off your shoes at the genkan (entrance)." },
            { id: 103, time: "18:00", title: "Shinjuku Gyoen National Garden", cost: 500, type: "sightseeing", notes: "Park visit", tip: "Beautiful winter illuminations often happen here." }
        ]
    },
    {
        id: 2,
        date: "2025-12-09",
        day: "Day 2",
        location: "Shinjuku, Tokyo",
        lat: 35.6938, lng: 139.7034,
        activities: [
            { id: 201, time: "10:00", title: "Rikugien Gardens", cost: 300, type: "sightseeing", notes: "Park visit", tip: "Famous for its weeping cherry trees, beautiful even in winter." }
        ]
    },
    {
        id: 3,
        date: "2025-12-10",
        day: "Day 3",
        location: "Shinjuku, Tokyo",
        lat: 35.6938, lng: 139.7034,
        activities: [
            { id: 301, time: "10:00", title: "Arisugawa-no-miya", cost: 0, type: "sightseeing", notes: "Park visit" },
            { id: 302, time: "14:00", title: "Travel to Hakone", cost: 2460, type: "transport", notes: "Odakyu Romancecar from Shinjuku station", tip: "Sit on the right side for a chance to see Mt. Fuji!" }
        ]
    },
    {
        id: 4,
        date: "2025-12-11",
        day: "Day 4",
        location: "Hakone",
        lat: 35.2324, lng: 139.1069,
        activities: [
            { id: 401, time: "10:00", title: "Ghibli Museum", cost: 1000, type: "sightseeing", notes: "Requires advance booking", tip: "No photos allowed inside! Enjoy the moment." }
        ]
    },
    {
        id: 5,
        date: "2025-12-12",
        day: "Day 5",
        location: "Hakone",
        lat: 35.2324, lng: 139.1069,
        activities: [
            { id: 501, time: "09:00", title: "Engaku-ji Temple", cost: 500, type: "sightseeing", notes: "Kamakura visit" },
            { id: 502, time: "13:00", title: "Travel to Kyoto", cost: 14170, type: "transport", notes: "Shinkansen to Kyoto", tip: "Buy an 'Ekiben' (station bento) to eat on the train." }
        ]
    },
    {
        id: 6,
        date: "2025-12-13",
        day: "Day 6",
        location: "Kyoto",
        lat: 35.0116, lng: 135.7681,
        activities: [
            { id: 601, time: "10:00", title: "Wander Old Towns", cost: 0, type: "sightseeing", notes: "Yanaka or Kagurazaka style" },
            { id: 602, time: "14:00", title: "Hike to Kurama-dera", cost: 300, type: "sightseeing", notes: "Mountain hike", tip: "This is a spiritual power spot. Feel the energy!" }
        ]
    },
    {
        id: 7,
        date: "2025-12-14",
        day: "Day 7",
        location: "Kyoto",
        lat: 35.0116, lng: 135.7681,
        activities: [
            { id: 701, time: "10:00", title: "Hakone Onsen", cost: 2000, type: "sightseeing", notes: "Day trip?" }
        ]
    },
    {
        id: 8,
        date: "2025-12-15",
        day: "Day 8",
        location: "Kyoto",
        lat: 35.0116, lng: 135.7681,
        activities: [
            { id: 801, time: "10:00", title: "Takaragawa Onsen", cost: 1500, type: "sightseeing", notes: "Day trip?" }
        ]
    },
    {
        id: 9,
        date: "2025-12-16",
        day: "Day 9",
        location: "Takayama",
        lat: 36.1408, lng: 137.2513,
        activities: [
            { id: 901, time: "09:00", title: "Travel to Takayama", cost: 10500, type: "transport", notes: "Train via Nagoya (Wide View Hida)", tip: "The train ride through the mountains is stunning." }
        ]
    },
    {
        id: 10,
        date: "2025-12-17",
        day: "Day 10",
        location: "Takayama",
        lat: 36.1408, lng: 137.2513,
        activities: [
            { id: 1001, time: "10:00", title: "Explore Takayama", cost: 0, type: "sightseeing", notes: "Old town, morning markets", tip: "Try the Hida Beef sushi!" }
        ]
    },
    {
        id: 11,
        date: "2025-12-18",
        day: "Day 11",
        location: "Nagano",
        lat: 36.6486, lng: 138.1942,
        activities: [
            { id: 1101, time: "09:00", title: "Travel to Nagano", cost: 7500, type: "transport", notes: "Train/Bus" },
            { id: 1102, time: "13:00", title: "Snow Monkey Park", cost: 800, type: "sightseeing", notes: "Jigokudani Yaen Koen", tip: "It will be cold and snowy! Wear boots with grip." },
            { id: 1103, time: "16:00", title: "Check-in Yudanaka Seifuso", cost: 20000, type: "accommodation", notes: "Stay 1 night at shibu onsen" },
            { id: 1104, time: "19:00", title: "Shunkoin Temple", cost: 3000, type: "sightseeing", notes: "Meditation session" }
        ]
    },
    {
        id: 12,
        date: "2025-12-19",
        day: "Day 12",
        location: "Takaragawa Onsen",
        lat: 36.8372, lng: 139.0436,
        activities: [
            { id: 1201, time: "09:00", title: "Travel to Takaragawa", cost: 6000, type: "transport", notes: "Train + Bus" },
            { id: 1202, time: "14:00", title: "Urasenke Tea Ceremony", cost: 6000, type: "sightseeing", notes: "Tea master experience (Akasaka)", tip: "Rotate the bowl twice clockwise before drinking." }
        ]
    },
    {
        id: 13,
        date: "2025-12-20",
        day: "Day 13",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1301, time: "10:00", title: "Travel to Tokyo", cost: 8000, type: "transport", notes: "Return to city" }
        ]
    },
    {
        id: 14,
        date: "2025-12-21",
        day: "Day 14",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1401, time: "10:00", title: "Ikebana (Flower Arrangement)", cost: 4000, type: "sightseeing", notes: "Meditation on impermanence" }
        ]
    },
    {
        id: 15,
        date: "2025-12-22",
        day: "Day 15",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1501, time: "10:00", title: "Shodo (Calligraphy)", cost: 3000, type: "sightseeing", notes: "Breath and brush become one" }
        ]
    },
    {
        id: 16,
        date: "2025-12-23",
        day: "Day 16",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1601, time: "10:00", title: "Kintsugi (Golden Repair)", cost: 8000, type: "sightseeing", notes: "Philosophy of embracing imperfection", tip: "Kintsugi teaches us that broken things can become more beautiful." }
        ]
    },
    {
        id: 17,
        date: "2025-12-24",
        day: "Day 17",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1701, time: "10:00", title: "Akasawa", cost: 0, type: "sightseeing", notes: "" }
        ]
    },
    {
        id: 18,
        date: "2025-12-25",
        day: "Day 18",
        location: "Tokyo",
        lat: 35.6762, lng: 139.6503,
        activities: [
            { id: 1801, time: "10:00", title: "Onsen Hopping", cost: 2000, type: "sightseeing", notes: "Iiyama-Yutaki, Togari, Madarao-Kogen" }
        ]
    }
];

// --- Components ---

const MapComponent = ({ tripData, selectedDayId }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([36.2048, 138.2529], 7);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(mapRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for each unique location
        const uniqueLocations = [...new Set(tripData.map(d => JSON.stringify({ lat: d.lat, lng: d.lng, name: d.location })))].map(JSON.parse);

        uniqueLocations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng]).addTo(mapRef.current)
                .bindPopup(loc.name);
            markersRef.current.push(marker);
        });

        // Draw path
        const latlngs = tripData.map(d => [d.lat, d.lng]);
        const polyline = L.polyline(latlngs, { color: '#BC002D', weight: 3, opacity: 0.7, dashArray: '10, 10' }).addTo(mapRef.current);
        markersRef.current.push(polyline);

        // Fly to selected day
        const selectedDay = tripData.find(d => d.id === selectedDayId);
        if (selectedDay) {
            mapRef.current.flyTo([selectedDay.lat, selectedDay.lng], 10, { duration: 1.5 });
        }

    }, [tripData, selectedDayId]);

    return <div id="map" className="h-64 w-full rounded-xl shadow-inner border border-slate-200 z-0"></div>;
};

const SnowEffect = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-60 animate-fall"
                    style={{
                        width: Math.random() * 5 + 2 + 'px',
                        height: Math.random() * 5 + 2 + 'px',
                        left: Math.random() * 100 + 'vw',
                        animationDuration: Math.random() * 5 + 5 + 's',
                        animationDelay: Math.random() * 5 + 's'
                    }}
                />
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
                    10% { opacity: 0.8; }
                    100% { transform: translateY(110vh) translateX(20px); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

const App = () => {
    const [tripData, setTripData] = useState(() => {
        const saved = localStorage.getItem('japanTripData_v2');
        return saved ? JSON.parse(saved) : initialTripData;
    });

    const [selectedDayId, setSelectedDayId] = useState(1);
    const [showUSD, setShowUSD] = useState(false);
    const [activeTip, setActiveTip] = useState(null);

    useEffect(() => {
        localStorage.setItem('japanTripData_v2', JSON.stringify(tripData));
    }, [tripData]);

    const calculateTotalCost = () => {
        return tripData.reduce((total, day) => {
            return total + day.activities.reduce((dayTotal, act) => dayTotal + (Number(act.cost) || 0), 0);
        }, 0);
    };

    // --- Editing Functions ---
    const updateActivity = (dayId, activityId, field, value) => {
        setTripData(prev => prev.map(day => {
            if (day.id !== dayId) return day;
            return {
                ...day,
                activities: day.activities.map(act => {
                    if (act.id !== activityId) return act;
                    return { ...act, [field]: value };
                }).sort((a, b) => a.time.localeCompare(b.time)) // Auto-sort by time
            };
        }));
    };

    const addActivity = (dayId) => {
        setTripData(prev => prev.map(day => {
            if (day.id !== dayId) return day;
            const newActivity = {
                id: Date.now(),
                time: "12:00",
                title: "New Activity",
                cost: 0,
                type: "sightseeing",
                notes: "",
                tip: ""
            };
            return { ...day, activities: [...day.activities, newActivity].sort((a, b) => a.time.localeCompare(b.time)) };
        }));
    };

    const deleteActivity = (dayId, activityId) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;
        setTripData(prev => prev.map(day => {
            if (day.id !== dayId) return day;
            return {
                ...day,
                activities: day.activities.filter(act => act.id !== activityId)
            };
        }));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'transport': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'food': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'accommodation': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'shopping': return 'bg-pink-50 text-pink-700 border-pink-100';
            default: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        }
    };

    const formatCurrency = (yen) => {
        if (showUSD) {
            return '$' + (yen / 150).toFixed(2);
        }
        return '¥' + yen.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-japan-snow font-sans text-slate-800 relative">
            <SnowEffect />

            {/* Hero Header */}
            <header className="bg-japan-indigo text-white shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/seigaiha.png')]"></div>
                <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold font-japanese mb-2 flex items-center gap-3">
                                <span className="text-japan-red">🇯🇵</span> Japan Trip 2025
                            </h1>
                            <p className="text-blue-200 font-light text-lg">Winter Journey • December 8 - 25</p>
                        </div>
                        <div className="text-right bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                            <div className="text-sm text-blue-200 mb-1">Total Estimated Budget</div>
                            <div className="text-3xl font-bold font-mono">{formatCurrency(calculateTotalCost())}</div>
                            <button
                                onClick={() => setShowUSD(!showUSD)}
                                className="text-xs text-blue-300 hover:text-white underline mt-1"
                            >
                                Switch to {showUSD ? 'JPY (¥)' : 'USD ($)'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Itinerary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold font-japanese text-japan-indigo">Itinerary</h2>
                        <div className="text-sm text-slate-500">
                            {tripData.length} Days
                        </div>
                    </div>

                    <AnimatePresence>
                        {tripData.map((day, index) => (
                            <motion.div
                                key={day.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${selectedDayId === day.id ? 'ring-2 ring-japan-indigo shadow-md' : 'hover:shadow-md'}`}
                                onClick={() => setSelectedDayId(day.id)}
                            >
                                {/* Day Header */}
                                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-japan-indigo text-white text-xs font-bold px-2 py-1 rounded">
                                            {day.day}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{day.location}</h3>
                                            <p className="text-xs text-slate-500">{day.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addActivity(day.id); }}
                                            className="text-xs bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                        >
                                            <i data-lucide="plus" className="w-3 h-3"></i> Add
                                        </button>
                                        <i data-lucide="chevron-right" className={`w-5 h-5 text-slate-400 transition-transform ${selectedDayId === day.id ? 'rotate-90' : ''}`}></i>
                                    </div>
                                </div>

                                {/* Activities (Expanded View) */}
                                {selectedDayId === day.id && (
                                    <div className="divide-y divide-slate-50">
                                        {day.activities.map(activity => (
                                            <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                                <div className="flex gap-4 items-start">
                                                    {/* Time Input */}
                                                    <div className="w-20 pt-1">
                                                        <input
                                                            type="time"
                                                            value={activity.time}
                                                            onChange={(e) => updateActivity(day.id, activity.id, 'time', e.target.value)}
                                                            className="text-sm font-mono text-slate-500 bg-transparent border border-transparent hover:border-slate-200 focus:border-japan-indigo focus:ring-0 rounded px-1 py-0.5 w-full transition-colors"
                                                        />
                                                    </div>

                                                    {/* Content Inputs */}
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <input
                                                                type="text"
                                                                value={activity.title}
                                                                onChange={(e) => updateActivity(day.id, activity.id, 'title', e.target.value)}
                                                                className="font-bold text-slate-700 text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-japan-indigo focus:outline-none w-full"
                                                                placeholder="Activity Name"
                                                            />
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1 font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                                                    <span>¥</span>
                                                                    <input
                                                                        type="number"
                                                                        value={activity.cost}
                                                                        onChange={(e) => updateActivity(day.id, activity.id, 'cost', parseInt(e.target.value) || 0)}
                                                                        className="bg-transparent border-none focus:ring-0 p-0 w-16 text-right"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteActivity(day.id, activity.id)}
                                                                    className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Delete Activity"
                                                                >
                                                                    <i data-lucide="trash-2" className="w-4 h-4"></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 items-center">
                                                            <select
                                                                value={activity.type}
                                                                onChange={(e) => updateActivity(day.id, activity.id, 'type', e.target.value)}
                                                                className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(activity.type)} appearance-none cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-japan-indigo`}
                                                            >
                                                                <option value="sightseeing">Sightseeing</option>
                                                                <option value="food">Food</option>
                                                                <option value="transport">Transport</option>
                                                                <option value="shopping">Shopping</option>
                                                                <option value="accommodation">Hotel</option>
                                                            </select>

                                                            {activity.tip && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setActiveTip(activity.tip); }}
                                                                    className="text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-yellow-200 transition-colors"
                                                                >
                                                                    <i data-lucide="lightbulb" className="w-3 h-3"></i> Tip
                                                                </button>
                                                            )}
                                                        </div>

                                                        <input
                                                            type="text"
                                                            value={activity.notes}
                                                            onChange={(e) => updateActivity(day.id, activity.id, 'notes', e.target.value)}
                                                            className="text-sm text-slate-500 italic bg-transparent border-b border-transparent hover:border-slate-200 focus:border-japan-indigo focus:outline-none w-full placeholder:text-slate-300"
                                                            placeholder="Add notes..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {day.activities.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 text-sm italic">
                                                No activities yet. Click "Add" to start planning.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Column: Map & Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-8">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
                            <h3 className="font-bold font-japanese text-japan-indigo mb-3 flex items-center gap-2">
                                <i data-lucide="map" className="w-5 h-5"></i> Route Map
                            </h3>
                            <MapComponent tripData={tripData} selectedDayId={selectedDayId} />
                            <p className="text-xs text-slate-400 mt-2 text-center">
                                Following your journey from Tokyo to Nagano
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-japan-indigo to-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold font-japanese text-lg mb-2">Winter Travel Tips ❄️</h3>
                                <ul className="text-sm space-y-3 text-blue-100">
                                    <li className="flex gap-2">
                                        <i data-lucide="thermometer-snowflake" className="w-5 h-5 shrink-0"></i>
                                        <span>Pack layers! Indoor heating is strong, but outside is freezing.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <i data-lucide="train" className="w-5 h-5 shrink-0"></i>
                                        <span>Book Shinkansen seats early for New Year's travel.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <i data-lucide="coins" className="w-5 h-5 shrink-0"></i>
                                        <span>Carry cash. Many small shops and temples don't take cards.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            {/* Tip Modal */}
            <AnimatePresence>
                {activeTip && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setActiveTip(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveTip(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <i data-lucide="x" className="w-5 h-5"></i>
                            </button>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
                                <i data-lucide="lightbulb" className="w-6 h-6"></i>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-2">Cultural Tip</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {activeTip}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Initialize Lucide icons
setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
}, 500);
