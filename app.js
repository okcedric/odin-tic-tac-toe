const Gameboard = (function(){
    let _gameBoard = [] ;
    let _grid=document.querySelector('#grid');
    
    
    function init(player = player1) {
        _gameBoard = [];
        _grid.innerHTML =""

        for (let i= 0; i < 9; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-id',i);
            _gameBoard.push("");
            _grid.appendChild(cell);
        }
        events();
        render();
        _overlay.classList.remove('blue');
        _overlay.classList.remove('red');
        _overlay.classList.add('hidden');   
    }
    
    function showPlayer(player) {
        let playerShower = document.querySelector('#player');
        playerShower.innerHTML = player.sign;
        if (player == player1) {
            playerShower.classList.remove('blue');
            playerShower.classList.add('red');
        } else {
            playerShower.classList.remove('red');
            playerShower.classList.add('blue');
        }
    }

    function isWinner(){
        let isLine = (a,b,c) => (_gameBoard[a] == _gameBoard[b]) && (_gameBoard[a] == _gameBoard[c]) && (_gameBoard[a]);
        let whoPlayedHere = (position) => {
            if (_gameBoard[position] == player1.sign)  return player1;
            if (_gameBoard[position] == player2.sign)  return player2;
        }
        let winner = false;

        if (isLine(4, 0, 8) || isLine(4, 1, 7) || isLine(4, 2, 6) || isLine(4, 3, 5 )) winner = whoPlayedHere(4);
        if (isLine(0, 1, 2) || isLine(0, 3, 6)) winner = whoPlayedHere(0);
        if (isLine(8, 5, 2) || isLine(8, 7, 6)) winner = whoPlayedHere(8);
        return winner
    }
    function isTie(){
        let cells = Array.from(_grid.querySelectorAll('.cell'));
        return cells.every((cell)=> cell.textContent);
    }
    
    function render() {
        for (let i = 0; i < 9; i++) {
            let cell = _grid.querySelector(`[data-id = "${i}"]`);
                cell.innerText = _gameBoard[i];
            if (_gameBoard[i] == '○'){
                    cell.classList.add('blue');
                } else if (_gameBoard[i] == '□'){
                    cell.classList.add('red');
                }
            }
        }
    
    
    function events() {
        let cells = Array.from(_grid.querySelectorAll('.cell'));
        cells.map(cell => {
            cell.addEventListener('click', () => {
                let id = cell.getAttribute('data-id');
                if (player1.isMyTurn) {
                    player1.play(id);
                } else {
                    player2.play(id)
                }
            })
        });
        _overlay.addEventListener('click', () => {
            Gameboard.init();
        })
    }
    
    function isFree(position) {
        return !_gameBoard[position]
    }
    
    function write(position,sign) {
        _gameBoard[position] = sign;
    }
    
    return {
        init,
        render,
        isFree,
        write,
        events,
        showPlayer,
        isWinner,
        isTie,
    }
})();

const Player = (sign, name) => {

    const play = (position)=> {

        if (Gameboard.isFree(position)){
            Gameboard.write(position, sign)
            toggleTurn();
        } 
        
        Gameboard.render();
        let winner = Gameboard.isWinner()
        if(winner) {
            document.querySelector('#winner').textContent = winner.name + ' wins!';
            _overlay.classList.remove('hidden');
            if (winner == "□") {
                _overlay.classList.add('red');
            } else {
                _overlay.classList.add('blue');
                
            }   
        } else if (Gameboard.isTie()) {
            document.querySelector('#winner').textContent = 'It\'s a tie!';
            _overlay.classList.remove('hidden');

        }
    }

    const setName = (name) => this.name = name;
    
    let isMyTurn = false;
           
    return {
        play,
        sign,
        name,
        isMyTurn,
    }
}


const toggleTurn = () => {
    player1.isMyTurn = !(player1.isMyTurn);
    player2.isMyTurn = !(player2.isMyTurn);
    if (player1.isMyTurn) Gameboard.showPlayer(player1);
    if (player2.isMyTurn) Gameboard.showPlayer(player2);
}

const error = (message) => console.log(`ERROR : ${message}`);

let player1 = Player("□");
let player2 = Player('○', "okcedric");
player1.isMyTurn = true;
Gameboard.showPlayer(player1);
let _overlay = document.querySelector('#overlay')

Gameboard.init();
