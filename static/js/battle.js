import { BATTLE_CONFIG } from './config.js';
import { gameState, getHero, getBoss, setHero, setBoss } from './state.js';
import { render } from './canvas.js';

/**
    Estado global da batalha: turno, defesa, log e resultado.
*/
export const battleState = {
    inBattle: false,
    currentTurn: null,
    isDefending: false,
    battleLog: [],
    gameOver: false,
    winner: null
};

/**
    Inicia nova batalha determinando aleatoriamente quem ataca primeiro.
*/
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

/**
    Executa ataque do herói: calcula dano (attack + skill.power - boss.defense),
    aplica ao boss, verifica vitória e passa turno para o boss.
*/
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

/**
    Ativa defesa do herói aumentando defense em 50% no próximo ataque recebido.
*/
export function heroDefend() {
    if (!canHeroAct()) return;

    battleState.isDefending = true;
    addBattleLog('Hero is defending! Defense increased!');


    battleState.currentTurn = 'BOSS';
    render();

    setTimeout(() => bossAttack(), BATTLE_CONFIG.TURN_DELAY);
}

/**
    Executa ataque do boss com habilidade aleatória, considerando bônus
    de defesa se herói estiver defendendo, e passa turno para o herói.
*/
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

/**
    Verifica se herói pode agir: batalha ativa, turno dele e jogo não acabou.
*/
function canHeroAct() {
    return battleState.inBattle &&
        battleState.currentTurn === 'HERO' &&
        !battleState.gameOver;
}

/**
    Finaliza batalha declarando vencedor e exibindo tela de resultado.
*/
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

/**
    Reinicia batalha com mesmos personagens restaurando HP ao máximo.
*/
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

/**
    Inicia novo jogo removendo herói e boss para forçar recriação via IA.
*/
export function newGame() {
    gameState.hero = null;
    gameState.boss = null;
    resetBattle();
    render();
}

/**
    Adiciona mensagem ao log mantendo apenas as 10 entradas mais recentes.
*/
function addBattleLog(message) {
    battleState.battleLog.push({
        message,
        timestamp: Date.now()
    });

    if (battleState.battleLog.length > 10) {
        battleState.battleLog.shift();
    }
}

/**
    Retorna array com histórico de eventos da batalha.
*/
export function getBattleLog() {
    return battleState.battleLog;
}

/**
    Verifica se batalha está ativa.
*/
export function isBattleActive() {
    return battleState.inBattle;
}

/**
    Verifica se jogo terminou.
*/
export function isGameOver() {
    return battleState.gameOver;
}

/**
    Retorna de quem é o turno atual.
*/
export function getCurrentTurn() {
    return battleState.currentTurn;
}

/**
    Retorna vencedor da batalha.
*/
export function getWinner() {
    return battleState.winner;
}