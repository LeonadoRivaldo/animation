//Setup website here
let hero = document.querySelector("#hero");
let villain = document.querySelector("#villain");
let power = document.querySelector("#power");
let visualEffect = document.querySelector("#visual-effect");
let villainHp = document.querySelector("#villain-container .hp-bar");
let villainHpContainer = document.querySelector("#villain-container .hp-bar-container");
let villainContainer = document.querySelector("#villain-container");
let heroContainer = document.querySelector("#hero-container");
let win = document.querySelector("#win");
let dmg = document.querySelector("#dmg-done");
let heroBar = document.querySelector("#hero-atcks");
let heroStatus = document.querySelector("#hero-status");
let heroStatusDisplay = document.querySelector("#hero-status-display");
let heroXpBar = document.querySelector("#xp-bar");
let autoAtack = document.querySelector("#auto-atack");

let footer = document.querySelector("#footer");
let infoToggler = document.querySelector('#footer .infos-toggler');
let footerInfo = document.querySelector("#footer #info");

let atckSpeed = 2000;
let lastAtckMade;
let enemyTotalHp;
let enemyCurrentHp;
let currentEnemy;


function getAbsoluteHeight(el) {
    // Get the DOM Node if you pass in a string
    el = !el ? this : ((typeof el === 'string') ? document.querySelector(el) : el);

    const styles = window.getComputedStyle(el);
    const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
    return Math.ceil(el.offsetHeight + margin);
}

villainHpContainer.getAbsoluteHeight = getAbsoluteHeight;
dmg.getAbsoluteHeight = getAbsoluteHeight;
footer.status = 'closed';
footer.changeStatus = function () {
    if (this.status === 'closed') {
        this.status = 'open';
        return;
    }

    this.status = 'closed';
}
footer.toggle = function () {
    const initialHeight = '30px';
    const finalHeight = '100px';
    const footerAnimationStart = {
        height: initialHeight
    };
    const footerAnimationEnd = {
        height: finalHeight
    };
    const options = { 'duration': 500 };
    const footerAnimationKF = [footerAnimationStart, footerAnimationEnd];

    if (this.status === 'open') {
        footerAnimationKF.reverse();
    }

    this.animate(footerAnimationKF, options).onfinish = () => {
        this.changeStatus();
        this.style.height = this.status === 'closed' ? initialHeight : finalHeight;
        infoToggler.toggle();
        footerInfo.toggle();
    };
}

function child(querySelector) {
    const children = Array.from(this.children);
    return children.find(c => c.classList.contains(querySelector));
}

function toogleClass(classToToggle) {
    !this.classList.contains(classToToggle) ? !this.classList.add(classToToggle) : !this.classList.remove(classToToggle)
}
function toogleContainer() {
    toogleClass.call(this, 'show');
}
function setImgAssetSRC(image) {
    this.setAttribute('src', image)
}

heroStatusDisplay.toggle = toogleContainer;
footerInfo.toggle = function () {
    toogleContainer.call(this);
};
infoToggler.toggle = function () {
    toogleClass.call(this, 'bi-chevron-up');
}
heroBar.blockAtacks = function (attackDone) {
    const atacksContainer = child.call(this.children.item(0), 'btns');
    if (attackDone) {
        atacksContainer.style.pointerEvents = null;
        atacksContainer.style.opacity = 1;
    } else {
        atacksContainer.style.pointerEvents = 'none';
        atacksContainer.style.opacity = 0.5;
    }
}
autoAtack.addEventListener('change', (event) => autoAtackAction(lastAtckMade || HERO.actions[0]));
infoToggler.addEventListener('click', () => footer.toggle());

villain.setDisplayImg = setImgAssetSRC;
power.setDisplayImg = setImgAssetSRC;
visualEffect.setDisplayImg = setImgAssetSRC;

const findEnemyByLvl = (lvl) => ENIMIES.find(e => e.lvl === lvl);
const calcTotalDiceRoll = (diceString) => makeDiceRoll(diceString).reduce((prev, next) => prev += next)
const calcHp = (char) => {
    const diceString = `${char.lvl}${char.hitDice}`;
    let totalHp = calcTotalDiceRoll(diceString);
    totalHp += (char.con * char.lvl);
    return totalHp;
}
const calcDmg = (atackDmgDice) => {
    return calcTotalDiceRoll(atackDmgDice);
}
const calcHeroAtackRoll = (hero) => {
    return Dices.d20() + hero.int;
}
const hitTheVillain = (action) => {
    let attackDmg = calcDmg(action.dice);
    dmgDone(attackDmg, true);
    visualEffectAnimation(VISSUAL_EFFECTS.hit, () => {
        dmgDone(0);
        heroBarToggle(true);
        enemyCurrentHp = (enemyCurrentHp - attackDmg) < 0 ? 0 : enemyCurrentHp - attackDmg;
        setVillainHp(enemyCurrentHp);
        if (enemyCurrentHp === 0) {
            heroBarToggle();
            calcHeroXp(enemyCurrentHp);
            setTimeout(() => villainDead());
        } else {
            autoAtackAction(action);
        }
    });
}
const visualEffectAnimation = (effect, callback) => {
    if (!effect || !callback) {
        return;
    }

    // SET EFFECT TO BE DISPLAYED
    visualEffect.setDisplayImg(effect);

    let vissualEffectAnimationStart = {
        opacity: 100
    };
    let vissualEffectAnimationEnd = {
        opacity: 0
    };
    let vissualEffectAnimationOptions = { "duration": (atckSpeed / HERO.dex), "delay": 100 };

    const animationsFrames = [vissualEffectAnimationStart, vissualEffectAnimationEnd];

    // Animation
    visualEffect.animate(animationsFrames, vissualEffectAnimationOptions).onfinish = callback;

}
const calcHeroXp = (villainCurrentHp) => {
    if (villainCurrentHp === 0) {
        HERO.xp++;
    }
    barSize = Math.floor((HERO.xp / XP_TABLE[HERO.lvl]) * 100);
    heroXpBar.style.width = `${barSize}%`;
    heroXpBar.innerHTML = `${HERO.xp} XP`;
    if (HERO.xp >= XP_TABLE[HERO.lvl]) {
        HERO.xp = 0;
        HERO.lvl++
    }
}
const villainDead = () => {
    let effectOpacity100 = {
        opacity: 100
    };
    let effectOpacity0 = {
        opacity: 100
    };
    let villainStart = Object.assign(effectOpacity100, { transform: 'rotate(0deg)' });
    let villainEnd = Object.assign(effectOpacity0, { transform: 'rotate(1000deg)' });
    let options = { "duration": 1500 };

    villain.animate([villainStart, villainEnd], options).onfinish = () => {
        villainContainer.classList.add('hide');
        win.classList.add('show');
        setTimeout(() => {
            reset();
        }, 3000);
    };
}
const heroBarToggle = (attackDone = false) => {
    heroBar.blockAtacks(attackDone);
}
const attack = (action) => {
    lastAtckMade = action;
    heroBarToggle();
    let start = { "left": "340px" };
    let end = { "left": `calc( 90vw - ${(villain.clientWidth / 2)}px )` }
    let options = { "duration": (atckSpeed / HERO.dex), easing: 'cubic-bezier(0.37, 0, 0.63, 1)' };
    power.setDisplayImg(action.img)
    power.classList.add("show");
    setTimeout(() => {
        power.animate([start, end], options).onfinish = function () {
            power.classList.remove("show");
            if (calcHeroAtackRoll(HERO) >= currentEnemy.ca) {
                hitTheVillain(action);
            } else {
                dmgDone('miss', true);
                visualEffectAnimation(VISSUAL_EFFECTS.miss, () => {
                    heroBarToggle(true);
                    dmgDone(0);
                })
            }
        };
    }, 510);
}
const autoAtackAction = (action) => {
    const { checked } = autoAtack;
    if (checked) {
        attack(action)
    }
}
const reset = () => {
    setTimeout(() => {
        StartGame();
    }, 1000);
}
const setVillainHp = (hp) => {
    enemyCurrentHp = hp;
    const barSize = Math.floor((enemyCurrentHp / enemyTotalHp) * 100);

    // end
    villainHp.style.width = `${barSize > 0 ? barSize : 0}%`;
    villainHp.innerHTML = `${enemyCurrentHp > 0 ? enemyCurrentHp : 0} HP`;
}
const dmgDone = (value, show = false) => {
    if (show) {
        dmg.classList.add('show');
    } else {
        dmg.classList.remove('show');
    }
    dmg.innerHTML = value;
}
const renderStatus = (hero, container) => {
    let displayString = '';
    Object.keys(hero).forEach(k => {
        let status = hero[k];
        if (k === 'actions') {
            status = '';
            hero[k].map(action => {
                status += `<img src="${action.img}" style="height:30px;width:30px;margin-right:5px"/>`;
            })
        }

        if (HERO_STATS_LABELS[k]) {
            displayString += `<b>${HERO_STATS_LABELS[k]}</b> : ${status} <br/>`
        }
    })
    container.innerHTML = displayString;
}
const setHeroDisplayName = (heroName, container) => {
    container.innerHTML = heroName;
}
const toogleDisplay = () => {
    heroStatusDisplay.toggle();
}
const manageHeroInfo = () => {
    heroStatus.addEventListener('click', toogleDisplay, false);
    renderStatus(HERO, child.call(heroStatusDisplay, 'hero-status'));

    const displayHeader = child.call(heroStatusDisplay, 'hero-status-display-header');
    setHeroDisplayName(HERO.name, child.call(displayHeader, 'hero-name'));
    (child.call(displayHeader, 'btn-close')).addEventListener('click', toogleDisplay, false);
}
const manageHeroAtacks = () => {
    const atacksContainer = child.call(heroBar.children.item(0), 'btns');
    const actions = HERO.actions;
    const makeAtack = attack;
    actions.map(action => {
        const exists = !!(child.call(atacksContainer, action.id));
        if (exists || HERO.lvl < action.lvl) {
            return;
        }

        let atkElement = document.createElement("a");
        atkElement.href = 'javascrit:void;'
        atkElement.innerHTML = `<img src="${action.img}" />`;
        atkElement.classList.add(`btn`);
        atkElement.classList.add(`btn-action`);
        atkElement.classList.add(`${action.id}`);
        atkElement.action = action
        atkElement.addEventListener('click', function (e) {
            makeAtack(this.action)
        }, false);

        atacksContainer.appendChild(atkElement);
    })
    hero.style.height = `calc(100% - ${heroBar.clientHeight + 5}px )`;
}
const manageEnimies = () => {
    currentEnemy = findEnemyByLvl(HERO.lvl);
    enemyTotalHp = calcHp(currentEnemy);
    setVillainHp(enemyTotalHp);
    villain.setDisplayImg(currentEnemy.avatar);
    const extraSize = villainHpContainer.getAbsoluteHeight() + dmg.getAbsoluteHeight();
    villain.style.height = `calc(100% - ${extraSize + 5}px )`;
}
const StartGame = () => {
    manageEnimies();
    manageHeroInfo();
    manageHeroAtacks();
    autoAtackAction(lastAtckMade);
    heroBarToggle(true);
    calcHeroXp();
    win.classList.remove('show');
    villainContainer.classList.remove('hide');
}

window.addEventListener('load', StartGame, false);