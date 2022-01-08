import { cross, circle } from "../constants.js";
import { DOMManager } from "./DOMManager.js";

export const Game = (function () {
  let player1, player2;
  let _gameBoard = [];
  let _overlay = document.querySelector("#winner-overlay");
  let _renameButton1 = document.querySelector("#rename-1");
  let _renameButton2 = document.querySelector("#rename-2");
  let _overlayPlayer1 = document.querySelector("#player1-overlay");
  let _overlayPlayer2 = document.querySelector("#player2-overlay");
  let _grid = document.querySelector("#grid");
  let _nameBoard = document.querySelector(".name-board");
  let _playerShower1 = _nameBoard.querySelector("#player1");
  let _playerShower2 = _nameBoard.querySelector("#player2");
  let _sign1 = _playerShower1.querySelector(".sign");
  let _sign2 = _playerShower2.querySelector(".sign");

  function init(players) {
    [player1, player2] = players;
    _gameBoard = [];
    _grid.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-id", i);
      _gameBoard.push("");
      _grid.appendChild(cell);
    }
    let input = _overlayPlayer1.querySelector("input");
    input.value = player1.name;
    input = _overlayPlayer2.querySelector("input");
    input.value = player2.name;
    DOMManager.rename(player2, _overlayPlayer2);
    DOMManager.rename(player1, _overlayPlayer1);
    events();
    render();
    _overlay.classList.remove("blue");
    _overlay.classList.remove("red");
    _overlay.classList.add("hidden");
  }

  function showPlayers() {
    let _username1 = _playerShower1.querySelector(".username");
    let _username2 = _playerShower2.querySelector(".username");
    _sign1.textContent = player1.sign;
    _sign2.textContent = player2.sign;
    _username1.textContent = player1.name;
    _username2.textContent = player2.name;
  }

  function playerToPlay() {
    return player1.isMyTurn ? player1 : player2;
  }

  function showTurn() {
    let symbolShower = document.querySelector("#symbol");
    let usernameShower = document.querySelector("#player");

    symbolShower.textContent = playerToPlay().sign;
    usernameShower.textContent = playerToPlay().name;

    if (playerToPlay() == player1) {
      symbolShower.classList.remove("blue");
      symbolShower.classList.add("red");
    } else {
      symbolShower.classList.remove("red");
      symbolShower.classList.add("blue");
    }
  }

  function toggleTurn() {
    player1.isMyTurn = !player1.isMyTurn;
    player2.isMyTurn = !player2.isMyTurn;
    showTurn();
  }

  function isWinner() {
    let isLine = (a, b, c) =>
      _gameBoard[a] == _gameBoard[b] &&
      _gameBoard[a] == _gameBoard[c] &&
      _gameBoard[a];
    let whoPlayedHere = (position) => {
      if (_gameBoard[position] == player1.sign) return player1;
      if (_gameBoard[position] == player2.sign) return player2;
    };
    let winner = false;

    if (
      isLine(4, 0, 8) ||
      isLine(4, 1, 7) ||
      isLine(4, 2, 6) ||
      isLine(4, 3, 5)
    )
      winner = whoPlayedHere(4);
    if (isLine(0, 1, 2) || isLine(0, 3, 6)) winner = whoPlayedHere(0);
    if (isLine(8, 5, 2) || isLine(8, 7, 6)) winner = whoPlayedHere(8);
    return winner;
  }

  function isTie() {
    let cells = Array.from(_grid.querySelectorAll(".cell"));
    return cells.every((cell) => cell.textContent);
  }

  function render() {
    for (let i = 0; i < 9; i++) {
      let cell = _grid.querySelector(`[data-id = "${i}"]`);
      cell.innerText = _gameBoard[i];
      if (_gameBoard[i] == circle) {
        cell.classList.add("blue");
      } else if (_gameBoard[i] == cross) {
        cell.classList.add("red");
      }
    }
    showPlayers();
    showTurn();
  }

  function events() {
    let cells = Array.from(_grid.querySelectorAll(".cell"));
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        let id = cell.getAttribute("data-id");
        playerToPlay().play(id);
      });
      cell.addEventListener("mouseover", function () {
        const pos = cell.getAttribute("data-id");
        if (Game.isFree(pos)) {
          DOMManager.previewPlay(this, Game.playerToPlay().sign);
        }
      });
      cell.addEventListener("mouseout", function () {
        const pos = cell.getAttribute("data-id");
        DOMManager.removePreview(this, Game.isFree(pos));
      });
    });

    _overlay.addEventListener("click", () => Game.init([player1, player2]));

    _playerShower1.addEventListener("mouseover", function () {
      DOMManager.addIcon(this);
    }); //this =_playerShower
    _playerShower2.addEventListener("mouseover", function () {
      DOMManager.addIcon(this);
    });

    _playerShower1.addEventListener("mouseout", function () {
      DOMManager.removeIcon(this);
    });
    _playerShower2.addEventListener("mouseout", function () {
      DOMManager.removeIcon(this);
    });

    _playerShower1.addEventListener("click", () =>
      DOMManager.open(_overlayPlayer1)
    );
    _playerShower2.addEventListener("click", () =>
      DOMManager.open(_overlayPlayer2)
    );

    _renameButton1.addEventListener("click", function () {
      DOMManager.rename(player1, this.parentElement);
      render();
    });
    _renameButton2.addEventListener("click", function () {
      DOMManager.rename(player2, this.parentElement);
      render();
    });

    document.addEventListener("keydown", (e) => DOMManager.whenEnter(e));
  }

  function isFree(position) {
    return !_gameBoard[position];
  }

  function write(position, sign) {
    _gameBoard[position] = sign;
  }

  return {
    init,
    render,
    isFree,
    write,
    events,
    showTurn,
    toggleTurn,
    showPlayers,
    playerToPlay,
    isWinner,
    isTie,
  };
})();