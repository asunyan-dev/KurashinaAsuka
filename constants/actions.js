const ACTIONS = {
  bite: {
    title: "bites",
    button: "Bite back",
  },
  bonk: {
    title: "bonks",
    button: "Bonk back",
  },
  cry: {
    title: "cries at",
    button: "Cry back",
  },
  cuddle: {
    title: "cuddles",
    button: "Cuddle back",
  },
  handhold: {
    title: "holds the hand of",
    button: "Hold it back",
  },
  hug: {
    title: "hugs",
    button: "Hug back",
  },
  kiss: {
    title: "kisses",
    button: "Kiss back",
  },
  laugh: {
    title: "laughs at",
    button: "Laugh back",
  },
  pat: {
    title: "pats",
    button: "Pat back",
  },
  poke: {
    title: "pokes",
    button: "Poke back",
  },
  pout: {
    title: "pouts at",
    button: "Pout back",
  },
  punch: {
    title: "punches",
    button: "Punch back",
  },
  slap: {
    title: "slaps",
    button: "Slap back",
  },
  smile: {
    title: "smiles at",
    button: "Smile back",
  },
  tickle: {
    title: "tickles",
    button: "Tickle back",
  },
  wave: {
    title: "waves at",
    button: "Wave back",
  },
  wink: {
    title: "winks at",
    button: "Wink back",
  },
};

const ACTION_CHOICES = Object.keys(ACTIONS).map((a) => ({
  name: a,
  value: a,
}));

module.exports = { ACTIONS, ACTION_CHOICES };
