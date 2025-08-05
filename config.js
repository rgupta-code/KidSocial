// KidSocial Configuration
const KidSocialConfig = {
    // Gemini API Configuration
    gemini: {
        apiKey: null, // Set your Gemini API key here
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        maxTokens: 500,
        temperature: 0.8
    },

    // App Settings
    app: {
        name: 'KidSocial',
        version: '1.0.0',
        maxPostLength: 200,
        maxStoryPromptLength: 100,
        autoSaveInterval: 30000, // 30 seconds
        notificationDuration: 3000 // 3 seconds
    },

    // Age Groups Configuration
    ageGroups: {
        '3-5': {
            name: 'Little Explorers',
            colors: {
                primary: '#ff6b9d',
                secondary: '#ff9a9e',
                accent: '#4ecdc4',
                border: '#ffb3d1',
                sectionBg: '#fff5f7'
            },
            storyStyle: 'simple and magical',
            maxStoryLength: 150
        },
        '6-8': {
            name: 'Creative Kids',
            colors: {
                primary: '#8b5cf6',
                secondary: '#667eea',
                accent: '#4ecdc4',
                border: '#c4b5fd',
                sectionBg: '#f8f7ff'
            },
            storyStyle: 'adventurous and educational',
            maxStoryLength: 200
        },
        '9-12': {
            name: 'Young Innovators',
            colors: {
                primary: '#3b82f6',
                secondary: '#1d4ed8',
                accent: '#4ecdc4',
                border: '#93c5fd',
                sectionBg: '#f0f9ff'
            },
            storyStyle: 'complex and inspiring',
            maxStoryLength: 300
        }
    },

    // Emoji Reactions
    reactions: {
        '👍': { name: 'Like', color: '#4ecdc4' },
        '❤️': { name: 'Love', color: '#ff6b6b' },
        '😊': { name: 'Happy', color: '#ffd93d' },
        '🎉': { name: 'Celebrate', color: '#6c5ce7' },
        '🌟': { name: 'Star', color: '#fdcb6e' }
    },

    // Story Prompts by Age
    storyPrompts: {
        '3-5': [
            'Tell me about a magical animal',
            'What would you do with a rainbow?',
            'Describe your favorite toy',
            'What's your favorite color and why?'
        ],
        '6-8': [
            'Tell me about an adventure you'd like to have',
            'What would you do if you could fly?',
            'Describe your best friend',
            'What's your favorite place to visit?'
        ],
        '9-12': [
            'Tell me about a problem you solved',
            'What would you invent if you could?',
            'Describe your dream job',
            'What's your biggest achievement?'
        ]
    },

    // Sample Posts by Age
    samplePosts: {
        '3-5': [
            "I drew a picture of a rainbow today! 🌈",
            "My teddy bear is my best friend! 🧸",
            "I learned to count to 10 today! 1,2,3... 🔢",
            "I love playing with my blocks! 🧱"
        ],
        '6-8': [
            "Just learned to ride my bike! 🚴‍♂️",
            "My cat is the best friend ever! 🐱",
            "I made the biggest sandcastle today! 🏖️",
            "I finished reading my favorite book! 📚"
        ],
        '9-12': [
            "Just won first place in the science fair! 🏆",
            "Learned to code my first game today! 💻",
            "Helped my little sister with her homework! 👧",
            "Started learning to play guitar! 🎸"
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KidSocialConfig;
} 