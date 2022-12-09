const VISSUAL_EFFECTS = {
    miss: 'shield-effect.png',
    hit: 'meele-hit.png'
}
const XP_TABLE = {
    '1': 5,
    '2': 10,
    '3': 30,
    '4': 90
}
const HERO_STATS_LABELS = {
    str: 'STR',
    dex: 'DEX',
    con: 'CON',
    xp: 'XP',
    lvl: 'Level',
    actions: 'Powers'
}
const HERO = {
    name: 'Redhead Wich',
    str: 2,
    dex: 4,
    con: 1,
    sab: 3,
    int: 4,
    char: 2,
    xp: 0,
    lvl: 1,
    hitDice: 'd4',
    actions: [
        { id: 'lightning_strike', name: 'lightning', dice: '2d6', img: 'lightning.svg', lvl: 1 },
        { id: 'fireball_strike', name: 'fireball', dice: '3d8', img: 'fireball.png', lvl: 2 },
        { id: 'windStrike_strike', name: 'windStrike', dice: '5d10', img: 'wind.png', lvl: 3 }
    ]
}
const ENIMIES = [
    {
        name: 'villain',
        str: 5,
        dex: 2,
        con: 1,
        lvl: 1,
        ca: 10,
        hitDice: 'd6',
        avatar: 'enimies/villain.svg',
        actions: []
    },
    {
        name: 'troll',
        str: 5,
        dex: 2,
        con: 2,
        lvl: 2,
        ca: 15,
        hitDice: 'd10',
        avatar: 'enimies/troll.png',
        actions: []
    },
    {
        name: 'demon',
        str: 5,
        dex: 2,
        con: 5,
        lvl: 3,
        ca: 20,
        hitDice: 'd12',
        avatar: 'enimies/demon.png',
        actions: []
    }
]