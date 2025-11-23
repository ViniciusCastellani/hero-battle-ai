import { BATTLE_CONFIG } from './config.js';
import { gameState, getHero, getBoss, setHero, setBoss } from './state.js';
import { render } from './canvas.js';

export const battleState = {
    inBattle: false,
    currentTurn: null,
    isDefending: false,
    battleLog: [],
    gameOver: false,
    winner: null
};

export function startBattle() {
    battleState.inBattle = true;
    battleState.gameOver = false;
    battleState.winner = null;
    battleState.battleLog = [];
    battleState.isDefending = false;


    const randomNumber = Math.floor(Math.random() * 100);
    battleState.currentTurn = randomNumber % 2 === 0 ? 'HERO' : 'BOSS';

    addBattleLog(`Battle started! ${battleState.currentTurn} goes first!`);

    if (battleState.currentTurn === 'BOSS') {
        setTimeout(() => bossAttack(), BATTLE_CONFIG.TURN_DELAY);
    }

    render();
}


export function heroAttack(skillIndex) {
    if (!canHeroAct()) return;

    const hero = getHero();
    const boss = getBoss();
    const skill = hero.skills[skillIndex];

    if (!skill) {
        addBattleLog('Invalid skill selected!');
        return;
    }


    const baseDamage = hero.attack + (skill.power || 0);
    const finalDamage = Math.max(1, baseDamage - boss.defense);


    boss.hp -= finalDamage;
    boss.hp = Math.max(0, boss.hp);

    setBoss(boss);

    addBattleLog(`Hero used ${skill.name}! Dealt ${finalDamage} damage.`);


    if (boss.hp <= 0) {
        endBattle('HERO');
        return;
    }

    battleState.isDefending = false;
    battleState.currentTurn = 'BOSS';
    render();

    setTimeout(() => bossAttack(), BATTLE_CONFIG.TURN_DELAY);
}

export function heroDefend() {
    if (!canHeroAct()) return;

    battleState.isDefending = true;
    addBattleLog('Hero is defending! Defense increased!');


    battleState.currentTurn = 'BOSS';
    render();

    setTimeout(() => bossAttack(), BATTLE_CONFIG.TURN_DELAY);
}


function bossAttack() {
    if (battleState.gameOver) return;

    const hero = getHero();
    const boss = getBoss();

    const randomSkillIndex = Math.floor(Math.random() * boss.skills.length);
    const skill = boss.skills[randomSkillIndex];


    const baseDamage = boss.attack + (skill.power || 0);
    const heroDefense = battleState.isDefending
        ? hero.defense * BATTLE_CONFIG.DEFEND_BONUS
        : hero.defense;
    const finalDamage = Math.max(1, baseDamage - heroDefense);

    hero.hp -= finalDamage;
    hero.hp = Math.max(0, hero.hp);

    setHero(hero);

    const defenseText = battleState.isDefending ? ' (defended)' : '';
    addBattleLog(`Boss used ${skill.name}! Dealt ${finalDamage} damage${defenseText}.`);

    battleState.isDefending = false;

    if (hero.hp <= 0) {
        endBattle('BOSS');
        return;
    }

    battleState.currentTurn = 'HERO';
    render();
}

function canHeroAct() {
    return battleState.inBattle &&
        battleState.currentTurn === 'HERO' &&
        !battleState.gameOver;
}

function endBattle(winner) {
    battleState.gameOver = true;
    battleState.winner = winner;
    battleState.inBattle = false;

    if (winner === 'HERO') {
        addBattleLog('VICTORY! You defeated the boss!');
    } else {
        addBattleLog('DEFEAT! The boss has defeated you!');
    }

    render();
}

export function resetBattle() {
    battleState.inBattle = false;
    battleState.currentTurn = null;
    battleState.isDefending = false;
    battleState.battleLog = [];
    battleState.gameOver = false;
    battleState.winner = null;
    const hero = getHero();
    const boss = getBoss();

    if (hero) {
        hero.hp = hero.maxHp || hero.hp;
        setHero(hero);
    }

    if (boss) {
        boss.hp = boss.maxHp || boss.hp;
        setBoss(boss);
    }

    render();
}

export function newGame() {
    gameState.hero = null;
    gameState.boss = null;
    resetBattle();
    render();
}

function addBattleLog(message) {
    battleState.battleLog.push({
        message,
        timestamp: Date.now()
    });

    if (battleState.battleLog.length > 10) {
        battleState.battleLog.shift();
    }
}

export function getBattleLog() {
    return battleState.battleLog;
}

export function isBattleActive() {
    return battleState.inBattle;
}

export function isGameOver() {
    return battleState.gameOver;
}

export function getCurrentTurn() {
    return battleState.currentTurn;
}

export function getWinner() {
    return battleState.winner;
}