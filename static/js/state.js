export const gameState = {
    hero: null,
    boss: null
};

export const loadedImages = {};

export const elements = {
    heroInput: null,
    createHeroBtn: null,
    canvas: null,
    loading: null,
    heroStats: null,
    bossStats: null
};

export let ctx = null;

export function setContext(context) {
    ctx = context;
}

export function getContext() {
    return ctx;
}

export function setHero(hero) {
    if (hero && !hero.maxHp) {
        hero.maxHp = hero.hp;
    }
    gameState.hero = hero;
}

export function setBoss(boss) {
    if (boss && !boss.maxHp) {
        boss.maxHp = boss.hp;
    }
    gameState.boss = boss;
}

export function getHero() {
    return gameState.hero;
}

export function getBoss() {
    return gameState.boss;
}