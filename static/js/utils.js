import { elements } from './state.js';

export function showLoading(show) {
    if (elements.loading) {
        elements.loading.style.display = show ? 'flex' : 'none';
    }
}

export function initializeDOMElements() {
    elements.heroInput = document.getElementById('hero-input');
    elements.createHeroBtn = document.getElementById('create-hero-btn');
    elements.canvas = document.getElementById('game-canvas');
    elements.loading = document.getElementById('loading');
    elements.heroStats = document.getElementById('hero-stats');
    elements.bossStats = document.getElementById('boss-stats');
}

export function validateElements() {
    if (!elements.canvas) {
        console.error('Canvas element not found');
        return false;
    }
    return true;
}