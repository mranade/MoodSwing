/* Represents if each button is currently pressed */
var energetic = false;
var excited = false;
var angry = false;
var joyful = false;
var sad = false;
var calm = false;
var valenceAVG = 0;
var danceAVG = 0;
var energyAVG = 0;
var onButtons = 0;

/*Emotional attribute Constants*/
const ENERGETIC_VALENCE = 0.85;
const ENERGETIC_DANCABILITY = 0.9;
const ENERGETIC_ENERGY = 1.0;

const EXCITED_VALENCE = 0.85;
const EXCITED_DANCEABILITY = 0.6;
const EXCITED_ENERGY = 0.7;

const ANGRY_VALENCE = 0.1;
const ANGRY_DANCEABILITY = 0.3;
const ANGRY_ENERGY = 0.8;

const JOYFUL_VALENCE = 0.9;
const JOYFUL_DANCEABILITY = 0.5;
const JOYFUL_ENERGY = 0.5;

const CALM_VALENCE = 0.6;
const CALM_DANCEABILITY = 0.1;
const CALM_ENERGY = 0.1;

const SAD_VALENCE = 0.1;
const SAD_DANCEABILITY = 0.1;
const SAD_ENERGY = 0.3;

/* Change the CSS code a button runs based on its current class */
function changeButton(id) {
    var unclicked = "unclicked";
    var clicked = "clicked";
    if (document.getElementById(id).classList.contains(unclicked)) {
        document.getElementById(id).classList.add(clicked);
        document.getElementById(id).classList.remove(unclicked);
    }
    else if (document.getElementById(id).classList.contains(clicked)) {
        document.getElementById(id).classList.add(unclicked);
        document.getElementById(id).classList.remove(clicked);
    }
}

/* CHANGE boolean value to show if button has been pressed */
function setBoolean(id) {
    switch (id) {
        case "energetic":
            if (!energetic) {
                energetic = true;
                onButtons += 1;
                valenceAVG += ENERGETIC_VALENCE;
                danceAVG += ENERGETIC_DANCABILITY;
                energyAVG += ENERGETIC_ENERGY;
            }
            else if (energetic) {
                energetic = false;
                onButtons -= 1;
                valenceAVG -= ENERGETIC_VALENCE;
                danceAVG -= ENERGETIC_DANCABILITY;
                energyAVG -= ENERGETIC_ENERGY;
            }
            break;
        case "excited":
            if (!excited) {
                excited = true;
                onButtons += 1;
                valenceAVG += EXCITED_VALENCE;
                danceAVG += EXCITED_DANCEABILITY;
                energyAVG += EXCITED_ENERGY;
            }
            else if (excited) {
                excited = false;
                onButtons -= 1;
                energetic = false;
                onButtons -= 1;
                valenceAVG -= EXCITED_VALENCE;
                danceAVG -= EXCITED_DANCEABILITY;
                energyAVG -= EXCITED_ENERGY;
            }
            break;
        case "angry":
            if (!angry) {
                angry = true;
                onButtons += 1;
                valenceAVG += ANGRY_VALENCE;
                danceAVG += ANGRY_DANCEABILITY;
                energyAVG += ANGRY_ENERGY;
            }
            else if (angry) {
                angry = false;
                onButtons -= 1;
                energetic = false;
                onButtons -= 1;
                valenceAVG -= ANGRY_VALENCE;
                danceAVG -= ANGRY_DANCEABILITY;
                energyAVG -= ANGRY_ENERGY;
            }
            break;
        case "joyful":
            if (!joyful) {
                joyful = true;
                onButtons += 1;
                valenceAVG += JOYFUL_VALENCE;
                danceAVG += JOYFUL_DANCEABILITY;
                energyAVG += JOYFUL_ENERGY;
            }
            else if (joyful) {
                joyful = false;
                onButtons -= 1;
                energetic = false;
                onButtons -= 1;
                valenceAVG -= JOYFUL_VALENCE;
                danceAVG -= JOYFUL_DANCEABILITY;
                energyAVG -= JOYFUL_ENERGY;
            }
            break;
        case "sad":
            if (!sad) {
                sad = true;
                onButtons += 1;
                valenceAVG += SAD_VALENCE;
                danceAVG += SAD_DANCEABILITY;
                energyAVG += SAD_ENERGY;
            }
            else if (sad) {
                sad = false;
                onButtons -= 1;
                energetic = false;
                onButtons -= 1;
                valenceAVG -= SAD_VALENCE;
                danceAVG -= SAD_DANCEABILITY;
                energyAVG -= SAD_ENERGY;
            }
            break;
        case "calm":
            if (!calm) {
                calm = true;
                onButtons += 1;
                valenceAVG += CALM_VALENCE;
                danceAVG += CALM_DANCEABILITY;
                energyAVG += CALM_ENERGY;
            }
            else if (calm) {
                calm = false;
                onButtons -= 1;
                energetic = false;
                onButtons -= 1;
                valenceAVG -= CALM_VALENCE;
                danceAVG -= CALM_DANCEABILITY;
                energyAVG -= CALM_ENERGY;
            }
            break;
    }

}

function averageEmoteValues() {
  if (onButtons != 0) {
    valenceAVG = valenceAVG/onButtons;
    danceAVG = danceAVG/onButtons;
    energyAVG = energyAVG/onButtons;
    console.log("VAVG: %s, DAVG: %s, EAVG: %s", valenceAVG.toFixed(2), danceAVG.toFixed(2), energyAVG.toFixed(2));
    const avgValues = [valenceAVG.toFixed(2), danceAVG.toFixed(2), energyAVG.toFixed(2)];
    return avgValues;
  } else {
    console.log("VAVG: 0.00, DAVG: 0.00, EAVG: 0.00");
  }

}

function resetValues() {
  onButtons = 0;
  valenceAVG = 0;
  danceAVG = 0;
  energyAVG = 0;

  if (calm) {
      calm = false;
  }
  if (sad) {
      sad = false;
  }
  if (joyful) {
      joyful = false;
  }
  if (angry) {
      angry = false;
    }
  if (excited) {
      excited = false;
     }
  if (energetic) {
      energetic = false;
    }
}

/* RETREIVE if button has been pressed */
function getBoolean(id) {
    switch (id) {
        case "energetic": {
            console.log(energetic);
            return energetic;
        }
        case "excited": {
            console.log(excited);
            return excited;
        }
        case "angry": {
            console.log(angry);
            return angry;
        }
        case "joyful": {
            console.log(joyful);
            return joyful;
        }
        case "sad": {
            console.log(sad);
            return sad;
        }
        case "calm": {
            console.log(calm);
            return calm;
        }
    }
}
