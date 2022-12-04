//Setup website here
let hero = document.querySelector("#hero");
let villain = document.querySelector("#villain");
let lightning = document.querySelector("#lightning");
let boom = document.querySelector("#boom");
let villainHp = document.querySelector("#villain-container .hp-bar");
let villainContainer = document.querySelector("#villain-container");
let win = document.querySelector("#win");
let dmg = document.querySelector("#dmg-done");
let heroBar = document.querySelector("#hero-atcks");

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function generateRandomInteger(max) {
    return Math.floor(Math.random() * max) + 1;
}
let villainCurrentHp = 100;
let hitTheVillain = () => {
    let boonStart = {
        opacity: 100
    };
    let boonEnd = {
        opacity: 0
    };
    let options = { "duration": 1500 };
    let attackDmg = Math.round(getRandomArbitrary(10, 30) * generateRandomInteger(2));
    dmgDone(attackDmg, true);
    boom.animate([boonStart, boonEnd], options).onfinish = () => {
        dmg.classList.remove('show');
        dmgDone(0);
        heroBarToggle(true);
    };
    lightning.classList.remove("show");
    villainCurrentHp = (villainCurrentHp - attackDmg) < 0 ? 0 : villainCurrentHp - attackDmg;
    setVillainHp(villainCurrentHp);
    if (villainCurrentHp === 0) {
        heroBarToggle();
        setTimeout(() => villainDead(), 1500);
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
        }, 5000);
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

let attack = () => {
    heroBarToggle();
    let start = { "left": "340px" };
    let end = { "left": `calc( 90vw - ${(villain.clientWidth / 2)}px )` }
    let options = { "duration": 2000, easing: 'cubic-bezier(0.37, 0, 0.63, 1)' };
    lightning.classList.add("show");
    setTimeout(() => {
        lightning.animate([start, end], options).onfinish = hitTheVillain;
    }, 510);
}

let reset = () => {
    setTimeout(() => {
        heroBarToggle(true);
        setVillainHp(100);
        win.classList.remove('show');
        villainContainer.classList.remove('hide');
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