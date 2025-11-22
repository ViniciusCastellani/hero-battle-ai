import { elements, setContext } from './state.js';
import { createHero } from './api.js';
import { preloadImages, render } from './canvas.js';
import { initializeDOMElements, validateElements } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    try {
        initializeDOMElements();

        if (!validateElements()) {
            return;
        }

        const ctx = elements.canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }
        setContext(ctx);

        preloadImages();

        setupEventListeners();

        render();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

function setupEventListeners() {
    try {
        if (elements.createHeroBtn) {
            elements.createHeroBtn.addEventListener('click', createHero);
        }

        if (elements.heroInput) {
            elements.heroInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    createHero();
                }
            });
        }
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}