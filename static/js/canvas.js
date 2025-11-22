import { ELEMENT_COLORS, ELEMENT_IMAGES, HERO_CONFIG, BOSS_CONFIG } from './config.js';
import { elements, loadedImages, getContext, getHero, getBoss } from './state.js';
import { updateStats } from './stats.js';

export function preloadImages() {
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

export function render() {
    drawCanvas();
    updateStats();
}

function drawCanvas() {
    const ctx = getContext();
    if (!ctx) return;

    clearCanvas();

    const hero = getHero();
    const boss = getBoss();

    if (hero) {
        drawCharacter(hero, HERO_CONFIG, 'HERO');
    }

    if (boss) {
        drawCharacter(boss, BOSS_CONFIG, 'BOSS');
    }

    if (hero && boss) {
        drawVSText();
    }
}

function clearCanvas() {
    const ctx = getContext();
    if (!ctx || !elements.canvas) return;
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
}

function drawCharacter(character, config, label) {
    const ctx = getContext();
    if (!ctx) return;

    const pos = { x: config.X_POSITION, y: config.Y_POSITION };

    drawBackground(ctx, pos, config, character.element);

    drawBorder(ctx, pos, config, label);

    drawImage(ctx, pos, config, character.element, label);

    drawLabel(ctx, pos, config, label);

    drawHP(ctx, pos, config, character.hp);

    drawElement(ctx, pos, config, character.element);
}

function drawBackground(ctx, pos, config, element) {
    ctx.fillStyle = ELEMENT_COLORS[element] || '#666';
    ctx.globalAlpha = 0.3;
    ctx.fillRect(
        pos.x - config.SIZE / 2,
        pos.y - config.SIZE / 2,
        config.SIZE,
        config.SIZE
    );
    ctx.globalAlpha = 1.0;
}

function drawBorder(ctx, pos, config, label) {
    ctx.strokeStyle = label === 'HERO' ? '#fbbf24' : '#ef4444';
    ctx.lineWidth = 4;
    ctx.strokeRect(
        pos.x - config.SIZE / 2,
        pos.y - config.SIZE / 2,
        config.SIZE,
        config.SIZE
    );
}

function drawImage(ctx, pos, config, element, label) {
    const imageKey = label === 'BOSS' ? 'BOSS' : element;
    const img = loadedImages[imageKey];

    if (img && img.complete) {
        ctx.drawImage(
            img,
            pos.x - config.SIZE / 2,
            pos.y - config.SIZE / 2,
            config.SIZE,
            config.SIZE
        );
    }
}

function drawLabel(ctx, pos, config, label) {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';

    const labelY = pos.y - config.SIZE / 2 - 15;
    ctx.strokeText(label, pos.x, labelY);
    ctx.fillText(label, pos.x, labelY);
}

function drawHP(ctx, pos, config, hp) {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';

    const hpY = pos.y + config.SIZE / 2 + 25;
    ctx.strokeText(`HP: ${hp}`, pos.x, hpY);
    ctx.fillText(`HP: ${hp}`, pos.x, hpY);
}

function drawElement(ctx, pos, config, element) {
    ctx.font = '14px Arial';
    ctx.fillStyle = ELEMENT_COLORS[element];
    ctx.textAlign = 'center';

    const elementY = pos.y + config.SIZE / 2 + 45;
    ctx.fillText(element, pos.x, elementY);
}

function drawVSText() {
    const ctx = getContext();
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