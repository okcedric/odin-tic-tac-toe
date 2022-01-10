import { cross, circle } from "../constants.js";
import { DOMManager } from "./DOMManager.js";
import { Game } from "./Game.js";

export const Player = (sign, nameInput="", isFirst=false) => {
  let name = nameInput || sign;

  const play = (position) => {
    let _overlay = document.querySelector("#winner-overlay");
    if (Game.isFree(position)) {
      Game.write(position, sign);
      let cell = document.querySelector(`[data-id = "${position}"]`);
      DOMManager.removePreview(cell);
      Game.toggleTurn();
    }

    Game.render();
    let winner = Game.isWinner();
    if (winner) {
      document.querySelector("#winner").textContent = winner.name + " wins!";
      DOMManager.open(_overlay);
      if (winner.sign == cross) {
        _overlay.classList.add("red");
      } else {
        _overlay.classList.add("blue");
      }
    } else if (Game.isTie()) {
      document.querySelector("#winner").textContent = "It's a tie!";
      DOMManager.open(_overlay);
    }
  };

  function setName(nameInput) {
    this.name = nameInput;
  }

  let isMyTurn = isFirst;

  return {
    play,
    setName,
    sign,
    name,
    isMyTurn,
  };
};