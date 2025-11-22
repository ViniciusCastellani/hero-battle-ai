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
    gameState.hero = hero;
}

export function setBoss(boss) {
    gameState.boss = boss;
}

export function getHero() {
    return gameState.hero;
}

export function getBoss() {
    return gameState.boss;
}