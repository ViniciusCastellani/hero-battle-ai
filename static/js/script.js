const API_URL = 'http://127.0.0.1:5000';

const ELEMENT_COLORS = {
    FIRE: '#ff6b35',
    WATER: '#4ecdc4',
    AIR: '#95e1d3'
};

const ELEMENT_IMAGES = {
    FIRE: '/static/images/Zuko.png',
    WATER: '/static/images/Katara.png',
    AIR: '/static/images/Aang.png',
    BOSS: '/static/images/boss.png'
};

const HERO_CONFIG = {
    SIZE: 120,
    X_POSITION: 150,
    Y_POSITION: 250
};

const BOSS_CONFIG = {
    SIZE: 150,
    X_POSITION: 550,
    Y_POSITION: 250
};

const gameState = {
    hero: null,
    boss: null
};

const loadedImages = {};

const elements = {
    heroInput: null,
    createHeroBtn: null,
    canvas: null,
    loading: null,
    heroStats: null,
    bossStats: null
};

let ctx = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    try {
        elements.heroInput = document.getElementById('hero-input');
        elements.createHeroBtn = document.getElementById('create-hero-btn');
        elements.canvas = document.getElementById('game-canvas');
        elements.loading = document.getElementById('loading');
        elements.heroStats = document.getElementById('hero-stats');
        elements.bossStats = document.getElementById('boss-stats');

        if (!elements.canvas) {
            console.error('Canvas element not found');
            return;
        }

        ctx = elements.canvas.getContext('2d');

        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }

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
                if (e.key === 'Enter') createHero();
            });
        }
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function preloadImages() {
    Object.entries(ELEMENT_IMAGES).forEach(([element, src]) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedImages[element] = img;
            render();
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
    });
}

async function createHero() {
    if (!elements.heroInput) return;

    const input = elements.heroInput.value.trim();

    if (!input) {
        alert('Please describe your hero!');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_URL}/create-hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hero_input: input })
        });

        const data = await response.json();

        if (response.ok) {
            gameState.hero = data.hero;
            gameState.boss = data.boss;

            elements.heroInput.value = '';

            console.log('Hero created:', data.hero);
            console.log('Boss created:', data.boss);

            render();
        } else {
            alert('Error while creating hero: ' + (data.erro || data.error));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error while trying to connect to the server.');
    } finally {
        showLoading(false);
    }
}

function render() {
    drawCanvas();
    updateStats();
}

function drawCanvas() {
    if (!ctx) return;

    clearCanvas();

    if (gameState.hero) {
        drawCharacter(gameState.hero, HERO_CONFIG, 'HERO');
    }

    if (gameState.boss) {
        drawCharacter(gameState.boss, BOSS_CONFIG, 'BOSS');
    }

    if (gameState.hero && gameState.boss) {
        drawVSText();
    }
}

function clearCanvas() {
    if (!ctx || !elements.canvas) return;
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function drawCharacter(character, config, label) {
    if (!ctx) return;

    const pos = { x: config.X_POSITION, y: config.Y_POSITION };

    ctx.fillStyle = ELEMENT_COLORS[character.element] || '#666';
    ctx.globalAlpha = 0.3;

    ctx.fillRect(
        pos.x - config.SIZE / 2,
        pos.y - config.SIZE / 2,
        config.SIZE,
        config.SIZE
    );
    ctx.globalAlpha = 1.0;

    ctx.strokeStyle = label === 'HERO' ? '#fbbf24' : '#ef4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(
        pos.x - config.SIZE / 2,
        pos.y - config.SIZE / 2,
        config.SIZE,
        config.SIZE
    );

    const imageKey = label === 'BOSS' ? 'BOSS' : character.element;
    const img = loadedImages[imageKey];

    if (img && img.complete) {
        ctx.drawImage(
            img,
            pos.x - config.SIZE / 2,
            pos.y - config.SIZE / 2,
            config.SIZE,
            config.SIZE
        );
    } else {
        ctx.fillStyle = ELEMENT_COLORS[character.element];
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, config.SIZE / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';

    const labelY = pos.y - config.SIZE / 2 - 15;
    ctx.strokeText(label, pos.x, labelY);
    ctx.fillText(label, pos.x, labelY);

    ctx.font = 'bold 18px Arial';
    const hpY = pos.y + config.SIZE / 2 + 25;
    ctx.strokeText(`HP: ${character.hp}`, pos.x, hpY);
    ctx.fillText(`HP: ${character.hp}`, pos.x, hpY);

    ctx.font = '14px Arial';
    ctx.fillStyle = ELEMENT_COLORS[character.element];
    const elementY = pos.y + config.SIZE / 2 + 45;
    ctx.fillText(character.element, pos.x, elementY);
}

function drawVSText() {
    if (!ctx) return;

    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';

    const x = elements.canvas.width / 2;
    const y = elements.canvas.height / 2;

    ctx.strokeText('VS', x, y);
    ctx.fillText('VS', x, y);
}

function updateStats() {
    updateHeroStats();
    updateBossStats();
}

function updateHeroStats() {
    if (!elements.heroStats) return;

    if (!gameState.hero) {
        elements.heroStats.innerHTML = '<p style="text-align: center; color: #6b7280;">No hero created yet</p>';
        return;
    }

    const hero = gameState.hero;
    const statsHTML = `
        <div class="stat-card hero-card">
            <div class="stat-card-header">
                <h3>🦸 HERO</h3>
                <span class="stat-element element-${hero.element.toLowerCase()}">${hero.element}</span>
            </div>
            <div class="stat-card-body">
                <div class="stat-row">
                    <span class="stat-label">❤️ HP:</span>
                    <span class="stat-value">${hero.hp || 0}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">⚔️ Attack:</span>
                    <span class="stat-value">${hero.attack || 0}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">🛡️ Defense:</span>
                    <span class="stat-value">${hero.defense || 0}</span>
                </div>
            </div>
            ${hero.skills && hero.skills.length > 0 ? `
                <div class="stat-card-skills">
                    <div class="skills-title">⚡ Skills:</div>
                    ${hero.skills.map(skill => `
                        <div class="skill-tag hero-skill">${skill.name || skill}</div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    elements.heroStats.innerHTML = statsHTML;
}

function updateBossStats() {
    if (!elements.bossStats) return;

    if (!gameState.boss) {
        elements.bossStats.innerHTML = '<p style="text-align: center; color: #6b7280;">No boss created yet</p>';
        return;
    }

    const boss = gameState.boss;
    const statsHTML = `
        <div class="stat-card boss-card">
            <div class="stat-card-header">
                <h3>👹 BOSS</h3>
                <span class="stat-element element-${boss.element.toLowerCase()}">${boss.element}</span>
            </div>
            <div class="stat-card-body">
                <div class="stat-row">
                    <span class="stat-label">❤️ HP:</span>
                    <span class="stat-value">${boss.hp || 0}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">⚔️ Attack:</span>
                    <span class="stat-value">${boss.attack || 0}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">🛡️ Defense:</span>
                    <span class="stat-value">${boss.defense || 0}</span>
                </div>
            </div>
            ${boss.skills && boss.skills.length > 0 ? `
                <div class="stat-card-skills">
                    <div class="skills-title">⚡ Skills:</div>
                    ${boss.skills.map(skill => `
                        <div class="skill-tag boss-skill">${skill.name || skill}</div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    elements.bossStats.innerHTML = statsHTML;
}

function showLoading(show) {
    if (elements.loading) {
        elements.loading.style.display = show ? 'flex' : 'none';
    }
}