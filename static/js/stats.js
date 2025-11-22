import { elements, getHero, getBoss } from './state.js';

export function updateStats() {
    updateHeroStats();
    updateBossStats();
}

function updateHeroStats() {
    if (!elements.heroStats) return;

    const hero = getHero();

    if (!hero) {
        elements.heroStats.innerHTML = '<p style="text-align: center; color: #6b7280;">No hero created yet</p>';
        return;
    }

    const statsHTML = generateStatsHTML(hero, 'hero');
    elements.heroStats.innerHTML = statsHTML;
}

function updateBossStats() {
    if (!elements.bossStats) return;

    const boss = getBoss();

    if (!boss) {
        elements.bossStats.innerHTML = '<p style="text-align: center; color: #6b7280;">No boss created yet</p>';
        return;
    }

    const statsHTML = generateStatsHTML(boss, 'boss');
    elements.bossStats.innerHTML = statsHTML;
}

function generateStatsHTML(character, type) {
    const isHero = type === 'hero';
    const icon = isHero ? '🦸' : '👹';
    const label = isHero ? 'HERO' : 'BOSS';
    const cardClass = isHero ? 'hero-card' : 'boss-card';
    const skillClass = isHero ? 'hero-skill' : 'boss-skill';

    return `
        <div class="stat-card ${cardClass}">
            <div class="stat-card-header">
                <h3>${icon} ${label}</h3>
                <span class="stat-element element-${character.element.toLowerCase()}">${character.element}</span>
            </div>
            <div class="stat-card-body">
                ${generateStatRow('❤️', 'HP', character.hp)}
                ${generateStatRow('⚔️', 'Attack', character.attack)}
                ${generateStatRow('🛡️', 'Defense', character.defense)}
            </div>
            ${generateSkillsHTML(character.skills, skillClass)}
        </div>
    `;
}

function generateStatRow(icon, label, value) {
    return `
        <div class="stat-row">
            <span class="stat-label">${icon} ${label}:</span>
            <span class="stat-value">${value || 0}</span>
        </div>
    `;
}

function generateSkillsHTML(skills, skillClass) {
    if (!skills || skills.length === 0) return '';

    const skillTags = skills.map(skill =>
        `<div class="skill-tag ${skillClass}">${skill.name || skill}</div>`
    ).join('');

    return `
        <div class="stat-card-skills">
            <div class="skills-title">⚡ Skills:</div>
            ${skillTags}
        </div>
    `;
}