// KidSocial App - Main JavaScript
class KidSocialApp {
    constructor() {
        this.posts = [];
        this.currentUser = {
            name: 'KidUser',
            avatar: '👤'
        };
        this.ageGroup = '6-8';
        this.geminiApiKey = null; // Will be set by user
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPosts();
        this.setAgeGroup('6-8'); // Default age group
        this.addSamplePosts();
        this.loadProfileImage(); // Load saved profile image
    }

    setupEventListeners() {
        // Age group selector
        document.getElementById('ageGroup').addEventListener('change', (e) => {
            this.setAgeGroup(e.target.value);
        });

        // Create post button
        document.getElementById('createPostBtn').addEventListener('click', () => {
            this.createPost();
        });

        // Enter key in post textarea
        document.getElementById('postText').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.createPost();
            }
        });

        // Story generation
        document.getElementById('generateStoryBtn').addEventListener('click', () => {
            this.generateStory();
        });

        // Enter key in story prompt
        document.getElementById('storyPrompt').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.generateStory();
            }
        });

        // Close emoji picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.emoji-picker')) {
                this.closeEmojiPicker();
            }
        });
    }

    setAgeGroup(ageGroup) {
        this.ageGroup = ageGroup;
        document.body.setAttribute('data-age', ageGroup);
        
        // Update the age display in the banner
        document.getElementById('currentAge').textContent = ageGroup;
        
        // Color schemes are now handled by CSS variables
        // The colors will automatically update based on the data-age attribute
    }

    createPost() {
        const postText = document.getElementById('postText').value.trim();
        if (!postText) {
            this.showNotification('Please write something to share!', 'warning');
            return;
        }

        const post = {
            id: Date.now(),
            content: postText,
            user: this.currentUser,
            timestamp: new Date(),
            reactions: {
                '👍': 0,
                '❤️': 0,
                '😊': 0,
                '🎉': 0,
                '🌟': 0
            },
            userReactions: {}
        };

        this.posts.unshift(post);
        this.savePosts();
        this.renderPosts();
        document.getElementById('postText').value = '';
        
        this.showNotification('Post shared successfully! 🎉', 'success');
    }

    addReaction(postId, reaction) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const userId = 'user_' + Date.now(); // Simple user ID
        
        if (post.userReactions[userId] === reaction) {
            // Remove reaction
            post.reactions[reaction]--;
            delete post.userReactions[userId];
        } else {
            // Add or change reaction
            if (post.userReactions[userId]) {
                post.reactions[post.userReactions[userId]]--;
            }
            post.reactions[reaction]++;
            post.userReactions[userId] = reaction;
        }

        this.savePosts();
        this.renderPosts();
    }

    renderPosts() {
        const postsFeed = document.getElementById('postsFeed');
        postsFeed.innerHTML = '';

        this.posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsFeed.appendChild(postElement);
        });
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.setAttribute('data-post-id', post.id);

        const timeAgo = this.getTimeAgo(post.timestamp);
        const totalReactions = Object.values(post.reactions).reduce((sum, count) => sum + count, 0);

        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    ${post.user.avatar}
                </div>
                <div class="post-user-info">
                    <div class="post-username">${post.user.name}</div>
                    <div class="post-time">${timeAgo}</div>
                </div>
            </div>
            <div class="post-content">${this.escapeHtml(post.content)}</div>
            <div class="post-actions-bar">
                <div class="post-reactions">
                    <button class="reaction-btn" onclick="app.addReaction(${post.id}, '👍')" title="Like">
                        👍 <span class="reaction-count">${post.reactions['👍']}</span>
                    </button>
                    <button class="reaction-btn" onclick="app.addReaction(${post.id}, '❤️')" title="Love">
                        ❤️ <span class="reaction-count">${post.reactions['❤️']}</span>
                    </button>
                    <button class="reaction-btn" onclick="app.addReaction(${post.id}, '😊')" title="Happy">
                        😊 <span class="reaction-count">${post.reactions['😊']}</span>
                    </button>
                    <button class="reaction-btn" onclick="app.addReaction(${post.id}, '🎉')" title="Celebrate">
                        🎉 <span class="reaction-count">${post.reactions['🎉']}</span>
                    </button>
                    <button class="reaction-btn" onclick="app.addReaction(${post.id}, '🌟')" title="Star">
                        🌟 <span class="reaction-count">${post.reactions['🌟']}</span>
                    </button>
                </div>
                <div class="post-stats">
                    <span class="total-reactions">${totalReactions} reactions</span>
                </div>
            </div>
        `;

        return postDiv;
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async generateStory() {
        const prompt = document.getElementById('storyPrompt').value.trim();
        if (!prompt) {
            this.showNotification('Please enter a story prompt!', 'warning');
            return;
        }

        const generateBtn = document.getElementById('generateStoryBtn');
        const originalText = generateBtn.innerHTML;
        
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

        try {
            // For demo purposes, we'll use a mock response
            // In production, you would integrate with Gemini API here
            const story = await this.generateStoryWithGemini(prompt);
            
            const storyResult = document.getElementById('storyResult');
            storyResult.innerHTML = `
                <h4>✨ Your AI Story ✨</h4>
                <p>${story}</p>
                <button class="story-share-btn" onclick="app.shareStory('${story.replace(/'/g, "\\'")}')">
                    <i class="fas fa-share"></i> Share as Post
                </button>
            `;
            storyResult.style.display = 'block';
            
            this.showNotification('Story generated successfully! ✨', 'success');
        } catch (error) {
            this.showNotification('Failed to generate story. Please try again.', 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalText;
        }
    }

    async generateStoryWithGemini(prompt) {
        // Mock Gemini API response for demo
        // In production, replace this with actual Gemini API call
        const stories = [
            `Once upon a time, there was a magical ${prompt} who lived in a rainbow castle. Every day, the ${prompt} would go on amazing adventures with their best friends - a talking cloud and a dancing flower. They would explore the enchanted forest, solve puzzles, and spread joy wherever they went. The ${prompt} taught everyone that friendship and kindness make the world a better place! 🌈✨`,
            
            `In a land far, far away, there lived a brave little ${prompt} who dreamed of becoming a hero. One day, the ${prompt} discovered a mysterious map that led to a treasure chest filled with magical toys. Along the journey, the ${prompt} met helpful animals who became their loyal companions. Together, they learned that courage comes from helping others and believing in yourself! 🗺️💎`,
            
            `Deep in the heart of the forest, there was a friendly ${prompt} who loved to paint pictures. The ${prompt} would create beautiful artwork that came to life! One day, the ${prompt} painted a special picture that helped all the forest animals solve their problems. The ${prompt} showed everyone that creativity and imagination can make dreams come true! 🎨🖼️`
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return stories[Math.floor(Math.random() * stories.length)];
    }

    shareStory(story) {
        document.getElementById('postText').value = story;
        this.showNotification('Story copied to post! You can now share it.', 'success');
    }

    addSamplePosts() {
        const samplePosts = [
            {
                content: "Just learned to ride my bike today! 🚴‍♂️ It was so much fun! Mom and dad were cheering for me! 🌟",
                user: { name: 'Alex', avatar: '👦' },
                reactions: { '👍': 5, '❤️': 3, '😊': 2, '🎉': 4, '🌟': 1 },
                userReactions: {}
            },
            {
                content: "My cat Fluffy is the best friend ever! 🐱 She always knows when I'm sad and comes to cuddle with me. Love you Fluffy! ❤️",
                user: { name: 'Emma', avatar: '👧' },
                reactions: { '👍': 3, '❤️': 7, '😊': 4, '🎉': 1, '🌟': 2 },
                userReactions: {}
            },
            {
                content: "Today I made the biggest sandcastle at the beach! 🏖️ It had towers, bridges, and even a moat! Can't wait to go back! 🏰",
                user: { name: 'Jake', avatar: '👦' },
                reactions: { '👍': 6, '❤️': 2, '😊': 3, '🎉': 5, '🌟': 4 },
                userReactions: {}
            },
            {
                content: "Just finished reading my favorite book for the 10th time! 📚 Books are like magic portals to amazing worlds! ✨",
                user: { name: 'Sophie', avatar: '👧' },
                reactions: { '👍': 4, '❤️': 6, '😊': 3, '🎉': 2, '🌟': 5 },
                userReactions: {}
            }
        ];

        samplePosts.forEach(post => {
            post.id = Date.now() + Math.random();
            post.timestamp = new Date(Date.now() - Math.random() * 86400000); // Random time in last 24 hours
            this.posts.push(post);
        });

        this.savePosts();
        this.renderPosts();
    }

    savePosts() {
        localStorage.setItem('kidSocial_posts', JSON.stringify(this.posts));
    }

    loadPosts() {
        const savedPosts = localStorage.getItem('kidSocial_posts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : type === 'warning' ? '#ff6b6b' : type === 'error' ? '#ff4757' : '#4ecdc4'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    toggleEmojiPicker() {
        const picker = document.getElementById('emojiPicker');
        picker.style.display = picker.style.display === 'grid' ? 'none' : 'grid';
    }

    closeEmojiPicker() {
        document.getElementById('emojiPicker').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Photo upload functionality
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profileImage = document.getElementById('profileImage');
                const photoIcon = document.getElementById('photoIcon');
                
                profileImage.src = e.target.result;
                profileImage.style.display = 'block';
                photoIcon.style.display = 'none';
                
                // Save to localStorage
                localStorage.setItem('kidSocial_profileImage', e.target.result);
                
                this.showNotification('Profile photo updated! 📸', 'success');
            };
            reader.readAsDataURL(file);
        }
    }

    // Reset functionality
    clearAllPosts() {
        if (confirm('Are you sure you want to delete all posts? This cannot be undone.')) {
            this.posts = [];
            this.savePosts();
            this.renderPosts();
            this.showNotification('All posts cleared! 🗑️', 'success');
        }
    }

    clearAllStories() {
        if (confirm('Are you sure you want to clear all story results?')) {
            document.getElementById('storyResult').style.display = 'none';
            document.getElementById('storyPrompt').value = '';
            this.showNotification('Story results cleared! ✨', 'success');
        }
    }

    resetProfile() {
        if (confirm('Are you sure you want to reset your profile photo?')) {
            const profileImage = document.getElementById('profileImage');
            const photoIcon = document.getElementById('photoIcon');
            
            profileImage.style.display = 'none';
            photoIcon.style.display = 'block';
            
            localStorage.removeItem('kidSocial_profileImage');
            this.showNotification('Profile photo reset! 👤', 'success');
        }
    }

    resetEverything() {
        if (confirm('⚠️ WARNING: This will reset everything - posts, stories, and profile photo. This cannot be undone!')) {
            // Clear posts
            this.posts = [];
            this.savePosts();
            this.renderPosts();
            
            // Clear stories
            document.getElementById('storyResult').style.display = 'none';
            document.getElementById('storyPrompt').value = '';
            
            // Reset profile
            const profileImage = document.getElementById('profileImage');
            const photoIcon = document.getElementById('photoIcon');
            profileImage.style.display = 'none';
            photoIcon.style.display = 'block';
            
            // Clear localStorage
            localStorage.removeItem('kidSocial_profileImage');
            
            this.showNotification('Everything has been reset! 🔄', 'success');
        }
    }

    // Load profile image on startup
    loadProfileImage() {
        const savedImage = localStorage.getItem('kidSocial_profileImage');
        if (savedImage) {
            const profileImage = document.getElementById('profileImage');
            const photoIcon = document.getElementById('photoIcon');
            
            profileImage.src = savedImage;
            profileImage.style.display = 'block';
            photoIcon.style.display = 'none';
        }
    }
}

// Global functions for HTML onclick handlers
function toggleEmojiPicker() {
    app.toggleEmojiPicker();
}

function addEmoji(emoji) {
    const textarea = document.getElementById('postText');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, start) + emoji + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    textarea.focus();
    
    app.closeEmojiPicker();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize the app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new KidSocialApp();
});

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(notificationStyles); 