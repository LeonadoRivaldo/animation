//Setup website here
let hero = document.querySelector("#hero");
let villain = document.querySelector("#villain");
let power = document.querySelector("#power");
let powerHitImg = document.querySelector("#boom");
let villainHp = document.querySelector("#villain-container .hp-bar");
let villainContainer = document.querySelector("#villain-container");
let win = document.querySelector("#win");
let dmg = document.querySelector("#dmg-done");
let heroBar = document.querySelector("#hero-atcks");
let heroStatus = document.querySelector("#hero-status");
let heroStatusDisplay = document.querySelector("#hero-status-display");
let heroXpBar = document.querySelector("#xp-bar");
let atckSpeed = 2000;
heroStatusDisplay.toggle = function () {
    !this.classList.contains('show') ? !this.classList.add('show') : !this.classList.remove('show');
}

const xpTable = {
    '1': 5,
    '2': 10,
    '3': 30,
    '4': 90
}
const labels = {
    str: 'STR',
    dex: 'DEX',
    con: 'CON',
    xp: 'XP',
    lvl: 'Level',
    actions: 'Powers'
}
const heroObject = {
    name: 'Redhead Wich',
    str: 2,
    dex: 4,
    con: 1,
    xp: 0,
    lvl: 1,
    actions: [
        { id: 'lightning_strike', name: 'lightning', pwr: 1, img: 'lightning.svg', lvl: 1 },
        { id: 'fireball_strike', name: 'fireball', pwr: 3, img: 'fireball.png', lvl: 2 }
    ]
}

function child(querySelector) {
    const children = Array.from(this.children);
    return children.find(c => c.classList.contains(querySelector));
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}
let villainCurrentHp = 100;
let hitTheVillain = (atk) => {
    let boonStart = {
        opacity: 100
    };
    let boonEnd = {
        opacity: 0
    };
    let options = { "duration": (atckSpeed / heroObject.dex) };
    let attackDmg = Math.round(getRandomArbitrary(10, 30) * generateRandomInteger(atk));
    dmgDone(attackDmg, true);
    powerHitImg.animate([boonStart, boonEnd], options).onfinish = () => {
        dmg.classList.remove('show');
        dmgDone(0);
        heroBarToggle(true);
        villainCurrentHp = (villainCurrentHp - attackDmg) < 0 ? 0 : villainCurrentHp - attackDmg;
        setVillainHp(villainCurrentHp);
        if (villainCurrentHp === 0) {
            heroBarToggle();
            calcHeroXp(villainCurrentHp);
            setTimeout(() => villainDead());
        }
    };
}
let calcHeroXp = (villainCurrentHp) => {
    if (villainCurrentHp === 0) {
        heroObject.xp++;
    }
    barSize = Math.floor((heroObject.xp / xpTable[heroObject.lvl]) * 100);
    heroXpBar.style.width = `${barSize}%`;
    heroXpBar.innerHTML = `${heroObject.xp} XP`;
    if (heroObject.xp >= xpTable[heroObject.lvl]) {
        heroObject.xp = 0;
        heroObject.lvl++
    }
}
let villainDead = () => {
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

let heroBarToggle = (attackDone = false) => {
    if (attackDone) {
        heroBar.style.pointerEvents = null;
        heroBar.style.opacity = 1;
    } else {
        heroBar.style.pointerEvents = 'none';
        heroBar.style.opacity = 0.5;
    }
}

let attack = (action) => {
    heroBarToggle();
    let start = { "left": "340px" };
    let end = { "left": `calc( 90vw - ${(villain.clientWidth / 2)}px )` }
    let options = { "duration": (atckSpeed / heroObject.dex), easing: 'cubic-bezier(0.37, 0, 0.63, 1)' };
    power.setAttribute('src', action.img);
    power.classList.add("show");
    setTimeout(() => {
        power.animate([start, end], options).onfinish = function () {
            power.classList.remove("show");
            hitTheVillain(action.pwr);
        };
    }, 510);
}

let reset = () => {
    setTimeout(() => {
        StartGame();
    }, 1000);
}

let setVillainHp = (hp) => {
    villainCurrentHp = hp;
    villainHp.style.width = `${hp > 0 ? hp : 0}%`;
    villainHp.innerHTML = `${hp > 0 ? hp : 0}%`;
}

let dmgDone = (value, show = false) => {
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

        if (labels[k]) {
            displayString += `<b>${labels[k]}</b> : ${status} <br/>`
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
    renderStatus(heroObject, child.apply(heroStatusDisplay, ['hero-status']));

    const displayHeader = child.apply(heroStatusDisplay, ['hero-status-display-header']);
    setHeroDisplayName(heroObject.name, child.apply(displayHeader, ['hero-name']));
    (child.apply(displayHeader, ['btn-close'])).addEventListener('click', toogleDisplay, false);
}

const manageHeroAtacks = () => {
    const actions = heroObject.actions;
    const makeAtack = attack;
    actions.map(action => {
        const atacksContainer = child.apply(heroBar.children.item(0), ['btns']);
        const exists = !!(child.apply(atacksContainer, [action.id]));
        if (exists || heroObject.lvl < action.lvl) {
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
}

const StartGame = () => {
    manageHeroInfo();
    manageHeroAtacks();
    heroBarToggle(true);
    setVillainHp(1);
    calcHeroXp();
    win.classList.remove('show');
    villainContainer.classList.remove('hide');
}

window.addEventListener('load', StartGame, false);