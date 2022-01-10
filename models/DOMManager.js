import { cross, circle } from "../constants.js";

export const DOMManager = (function () {
  let _overlayPlayer1 = document.querySelector("#player1-overlay");
  let _overlayPlayer2 = document.querySelector("#player2-overlay");
  let _overlay = document.querySelector("#winner-overlay");
  let _renameButton1 = document.querySelector("#rename-1");
  let _renameButton2 = document.querySelector("#rename-2");

  function close(overlay) {
    overlay.classList.add("hidden");
  }

  function hasIcon(object) {
    let icon = object.querySelector("i.fa-edit");
    return icon;
  }

  function addIcon(playerShower) {
    if (!hasIcon(playerShower)) {
      let icon = '<i class="fas fa-edit"></i>';
      playerShower.innerHTML += " " + icon;
    }
  }

  function removeIcon(playerShower) {
    let icon = hasIcon(playerShower);
    if (icon) {
      icon.remove();
    }
  }

  function open(overlay) {
    overlay.classList.remove("hidden");
    let input = overlay.querySelector("input");
    if (input) {
      input.select();
    }
  }

  function rename(player, overlay) {
    const name = overlay.querySelector("input").value;
    name ? player.setName(name) : console.error("a girl has no name");
    close(overlay);
  }

  function _isOpen(overlay) {
    return !overlay.classList.contains("hidden");
  }

  function _clickIt(target) {
    let click = new CustomEvent("click");
    target.dispatchEvent(click);
  }

  function previewPlay(cell, sign) {
    cell.innerHTML = sign;
    if (sign == cross) cell.classList.add("red", "dim");
    if (sign == circle) cell.classList.add("blue", "dim");
  }

  function removePreview(cell, cellIsFree) {
    if (cellIsFree) {
      cell.innerHTML = "";
      cell.classList.remove("red");
      cell.classList.remove("blue");
    }
    cell.classList.remove("dim");
  }

  function whenEnter(e) {
    if (e.keyCode == "13") {
      if (_isOpen(_overlayPlayer1)) {
        _clickIt(_renameButton1);
      }
      if (_isOpen(_overlayPlayer2)) {
        _clickIt(_renameButton2);
      }

      if (_isOpen(_overlay)) {
        Gameboard.init();
        close(_overlay);
      }
    }
  }

  return {
    addIcon,
    removeIcon,
    close,
    open,
    rename,
    whenEnter,
    previewPlay,
    removePreview,
  };
})();