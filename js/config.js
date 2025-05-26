export const CONFIG = {
    STORAGE_KEYS: {
        WORKOUTS: 'urbfit_workouts',
        STATS: 'urbfit_stats'
    },
    
    ANIMATION: {
        DURATION: {
            FAST: 300,
            MEDIUM: 600,
            SLOW: 1000
        },
        EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
        STAGGER_DELAY: 150
    },
    
    INTERSECTION_OBSERVER: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    },
    
    LEADERBOARD_DATA: [
        { name: 'Coach Vini', time: '35:42', avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
        { name: 'Mike Johnson', time: '42:30', avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
        { name: 'Sarah Chen', time: '45:15', avatar: 'https://via.placeholder.com/100x100/1a1a1a/ff6b35?text=SC' },
        { name: 'David Smith', time: '48:22', avatar: 'https://via.placeholder.com/100x100/1a1a1a/ff6b35?text=DS' },
        { name: 'Emma Wilson', time: '52:10', avatar: 'https://via.placeholder.com/100x100/1a1a1a/ff6b35?text=EW' }
    ]
};
