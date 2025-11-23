import { elements, getHero, getBoss } from './state.js';
import {
    startBattle,
    heroAttack,
    heroDefend,
    resetBattle,
    newGame,
    isBattleActive,
    isGameOver,
    getCurrentTurn,
    getWinner,
    getBattleLog
} from './battle.js';

export function updateStats() {
    updateHeroStats();
    updateBossStats();
    updateBattleControls();
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

    const skillTags = skills.map((skill, index) => {
        return `<div class="skill-tag ${skillClass}">
            ${skill.name || skill} ${skill.power ? `(${skill.power})` : ''}
        </div>`;
    }).join('');

    return `
        <div class="stat-card-skills">
            <div class="skills-title">Skills:</div>
            ${skillTags}
        </div>
    `;
}

function updateBattleControls() {
    const battleControls = document.getElementById('battle-controls');
    if (!battleControls) return;

    const hero = getHero();
    const boss = getBoss();

    if (!hero || !boss) {
        battleControls.innerHTML = '';
        return;
    }

    const inBattle = isBattleActive();
    const gameOver = isGameOver();
    const currentTurn = getCurrentTurn();
    const winner = getWinner();

    let controlsHTML = '';

    if (!inBattle && !gameOver) {
        controlsHTML = `
            <button class="btn btn-battle" id="start-battle-btn">
                Start Battle
            </button>
        `;
    } else if (inBattle && !gameOver) {
        const isHeroTurn = currentTurn === 'HERO';
        const turnText = isHeroTurn ? 'Your Turn' : "Boss's Turn";
        const disabled = !isHeroTurn ? 'disabled' : '';

        controlsHTML = `
            <div class="battle-turn-indicator">
                <span class="turn-text ${isHeroTurn ? 'hero-turn' : 'boss-turn'}">
                    ${turnText}
                </span>
            </div>
            <div class="battle-actions">
                <button class="btn btn-attack" id="attack-btn" ${disabled}>
                    Attack
                </button>
                <button class="btn btn-defend" id="defend-btn" ${disabled}>
                    Defend
                </button>
            </div>
            <div class="battle-log-container">
                <h4>Battle Log:</h4>
                <div class="battle-log-content">
                    ${generateBattleLogHTML()}
                </div>
            </div>
        `;
    } else if (gameOver) {
        const winnerText = winner === 'HERO' ? 'YOU WIN!' : 'YOU LOSE!';
        const winnerClass = winner === 'HERO' ? 'win' : 'lose';

        controlsHTML = `
            <div class="game-over-screen ${winnerClass}">
                <h2 class="game-over-text">${winnerText}</h2>
                <div class="game-over-actions">
                    <button class="btn btn-restart" id="restart-btn">
                        Restart Battle
                    </button>
                    <button class="btn btn-new-game" id="new-game-btn">
                        New Game
                    </button>
                </div>
            </div>
            <div class="battle-log-container">
                <h4>Battle Log:</h4>
                <div class="battle-log-content">
                    ${generateBattleLogHTML()}
                </div>
            </div>
        `;
    }

    battleControls.innerHTML = controlsHTML;
    attachBattleListeners();
}

function generateBattleLogHTML() {
    const logs = getBattleLog();
    if (logs.length === 0) return '<p class="log-empty">No events yet...</p>';

    return logs.map(log => `
        <div class="log-entry">${log.message}</div>
    `).join('');
}

function attachBattleListeners() {
    const startBtn = document.getElementById('start-battle-btn');
    const attackBtn = document.getElementById('attack-btn');
    const defendBtn = document.getElementById('defend-btn');
    const restartBtn = document.getElementById('restart-btn');
    const newGameBtn = document.getElementById('new-game-btn');

    if (startBtn) {
        startBtn.addEventListener('click', startBattle);
    }

    if (attackBtn) {
        attackBtn.addEventListener('click', openSkillSelector);
    }

    if (defendBtn) {
        defendBtn.addEventListener('click', heroDefend);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            resetBattle();
            startBattle();
        });
    }

    if (newGameBtn) {
        newGameBtn.addEventListener('click', newGame);
    }
}

function openSkillSelector() {
    const hero = getHero();
    if (!hero || !hero.skills || hero.skills.length === 0) return;

    const modal = document.createElement('div');
    modal.className = 'skill-modal';
    modal.innerHTML = `
        <div class="skill-modal-content">
            <div class="skill-modal-header">
                <h3>Choose Your Attack</h3>
                <button class="skill-modal-close" id="close-modal">✕</button>
            </div>
            <div class="skill-modal-body">
                ${hero.skills.map((skill, index) => `
                    <button class="skill-modal-button" data-skill-index="${index}">
                        <span class="skill-modal-name">${skill.name || skill}</span>
                        <span class="skill-modal-power">${skill.power || 0} damage</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    const closeBtn = modal.querySelector('#close-modal');
    closeBtn.addEventListener('click', () => closeModal(modal));

    const skillButtons = modal.querySelectorAll('.skill-modal-button');
    skillButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const skillIndex = parseInt(btn.dataset.skillIndex);
            closeModal(modal);
            heroAttack(skillIndex);
        });
    });
}

function closeModal(modal) {
    modal.classList.add('closing');
    setTimeout(() => {
        modal.remove();
    }, 300);
}