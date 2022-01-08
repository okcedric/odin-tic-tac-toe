const Gameboard = (function () {
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

  function init(player = player1) {
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
    Manipulate.rename(player2, _overlayPlayer2);
    Manipulate.rename(player1, _overlayPlayer1);
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
    cells.map((cell) => {
      cell.addEventListener("click", () => {
        let id = cell.getAttribute("data-id");
        playerToPlay().play(id);
      });
      cell.addEventListener("mouseover", function () {
        Manipulate.previewPlay(this);
      });
      cell.addEventListener("mouseout", function () {
        Manipulate.removePreview(this);
      });
    });

    _overlay.addEventListener("click", Gameboard.init);
    
    _playerShower1.addEventListener("mouseover", function () {
      Manipulate.addIcon(this);
    }); //this =_playerShower
    _playerShower2.addEventListener("mouseover", function () {
      Manipulate.addIcon(this);
    });

    _playerShower1.addEventListener("mouseout", function () {
      Manipulate.removeIcon(this);
    });
    _playerShower2.addEventListener("mouseout", function () {
      Manipulate.removeIcon(this);
    });

    _playerShower1.addEventListener("click", () =>
      Manipulate.open(_overlayPlayer1)
    );
    _playerShower2.addEventListener("click", () =>
      Manipulate.open(_overlayPlayer2)
    );

    _renameButton1.addEventListener("click", function () {
      Manipulate.rename(player1, this.parentElement);
    });
    _renameButton2.addEventListener("click", function () {
      Manipulate.rename(player2, this.parentElement);
    });

    document.addEventListener("keydown", (e) => Manipulate.whenEnter(e));
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

const Manipulate = (function () {
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
    let name = overlay.querySelector("input").value;
    name ? player.setName(name) : error("a girl has no name");
    close(overlay);
    Gameboard.render();
  }

  function _isOpen(overlay) {
    return !overlay.classList.contains("hidden");
  }

  function _clickIt(target) {
    let click = new CustomEvent("click");
    target.dispatchEvent(click);
  }

  function previewPlay(cell) {
    let pos = cell.getAttribute("data-id");
    let player = Gameboard.playerToPlay();
    if (Gameboard.isFree(pos)) {
      cell.innerHTML = player.sign;
      if (player.sign == cross) cell.classList.add("red", "dim");
      if (player.sign == circle) cell.classList.add("blue", "dim");
    }
  }

  function removePreview(cell) {
    let pos = cell.getAttribute("data-id");
    if (Gameboard.isFree(pos)) {
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

const Player = (sign, name) => {
  const play = (position) => {
    let _overlay = document.querySelector("#winner-overlay");
    if (Gameboard.isFree(position)) {
      Gameboard.write(position, sign);
      let cell = document.querySelector(`[data-id = "${position}"]`);
      console.log(cell);
      Manipulate.removePreview(cell);
      console.log(cell);
      Gameboard.toggleTurn();
    }

    Gameboard.render();
    let winner = Gameboard.isWinner();
    if (winner) {
      document.querySelector("#winner").textContent = winner.name + " wins!";
      Manipulate.open(_overlay);
      if (winner.sign == cross) {
        _overlay.classList.add("red");
      } else {
        _overlay.classList.add("blue");
      }
    } else if (Gameboard.isTie()) {
      document.querySelector("#winner").textContent = "It's a tie!";
      Manipulate.open(_overlay);
    }
  };

  if (!name) name = sign;

  function setName(username) {
    this.name = username;
  }

  let isMyTurn = false;

  return {
    play,
    setName,
    sign,
    name,
    isMyTurn,
  };
};

const error = (message) => console.log(`ERROR : ${message}`);
let cross = "✗";
let circle = "○";
let player1 = Player(cross, "Cross");
let player2 = Player(circle, "Circle");

player1.isMyTurn = true;

Gameboard.init();
