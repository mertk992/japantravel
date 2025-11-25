export const initialTripData = [
    {
        id: 1,
        date: "2025-04-01",
        day: "Day 1",
        location: "Tokyo",
        activities: [
            { id: 101, time: "14:00", title: "Arrive at Narita Airport", cost: 0, type: "transport", notes: "Pick up JR Pass & Pocket WiFi" },
            { id: 102, time: "16:00", title: "Check-in Hotel (Shinjuku)", cost: 15000, type: "accommodation", notes: "Hotel Gracery Shinjuku" },
            { id: 103, time: "19:00", title: "Dinner at Omoide Yokocho", cost: 3000, type: "food", notes: "Yakitori alley, cash only" }
        ]
    },
    {
        id: 2,
        date: "2025-04-02",
        day: "Day 2",
        location: "Tokyo",
        activities: [
            { id: 201, time: "09:00", title: "Meiji Shrine", cost: 0, type: "sightseeing", notes: "Walk through Yoyogi Park" },
            { id: 202, time: "11:00", title: "Harajuku Shopping", cost: 5000, type: "shopping", notes: "Takeshita Street" },
            { id: 203, time: "13:00", title: "Lunch: Gyukatsu Motomura", cost: 2000, type: "food", notes: "Expect a line" },
            { id: 204, time: "15:00", title: "Shibuya Crossing", cost: 0, type: "sightseeing", notes: "Starbucks view" }
        ]
    },
    {
        id: 3,
        date: "2025-04-03",
        day: "Day 3",
        location: "Kyoto",
        activities: [
            { id: 301, time: "08:00", title: "Shinkansen to Kyoto", cost: 14000, type: "transport", notes: "Reserved seat, view of Mt Fuji on right side" },
            { id: 302, time: "11:00", title: "Kinkaku-ji (Golden Pavilion)", cost: 500, type: "sightseeing", notes: "" },
            { id: 303, time: "18:00", title: "Pontocho Alley Dinner", cost: 6000, type: "food", notes: "Riverside dining" }
        ]
    }
];
