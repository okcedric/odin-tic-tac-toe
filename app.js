const Gameboard = (function(){
    let _gameBoard = [];
    let _grid=document.querySelector('#grid');

    
    function init() {
        for (let i= 0; i < 9; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-id',i);
            _gameBoard.push("");
            _grid.appendChild(cell);
        }

    }
    
    function render() {
        for (let i = 0; i < 9; i++) {
            if (_gameBoard[i]) {
                let cell = _grid.querySelector(`[data-id = "${i}"]`);
                cell.textContent = _gameBoard[i];
                if (_gameBoard[i] == '×'){
                    cell.classList.add('red');
                } else {
                    cell.classList.add('blue');
                }
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
                toggleTurn();
            })
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
        events
    }
})();

const Player = (sign, name) => {

    if (!(name)) name = sign;

    const play = (position)=> {
        Gameboard.isFree(position) ? Gameboard.write(position, sign): error('Cette place est déjà prise');
        Gameboard.render();
    }
    
    let isMyTurn = false;
    
    
    
    return {
        play,
        sign,
        name,
    }
}

const toggleTurn = () => {
    player1.isMyTurn = !(player1.isMyTurn);
    player2.isMyTurn = !(player2.isMyTurn);
    
}

const error = (message) => console.log(`ERROR : ${message}`);

let player1 = Player("×");
let player2 = Player('○', "okcedric");

Gameboard.init();
Gameboard.render();
Gameboard.events();
player1.isMyTurn = true;
Gameboard.render();
