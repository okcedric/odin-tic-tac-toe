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
            _grid.querySelector(`[data-id = "${i}"]`).textContent = _gameBoard[i];
        }
    }
    
    function getBoard() {
        return _gameBoard;
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
        getBoard,
        isFree,
        write,
        
    }
})();

const Player = (sign, name) => {

    if (!(name)) name = sign;

    const play = (position)=> {
        Gameboard.isFree(position) ? Gameboard.write(position, sign): error('Cette place est déjà prise');
        Gameboard.render();
    }

    return {
        play,
        sign,
        name,

    }
}

const error = (message) => console.log(`ERROR : ${message}`);

let player1 = Player("□");
let player2 = Player('○', "okcedric");




Gameboard.init();
Gameboard.render();
player1.play(4);
player2.play(0);
Gameboard.render();
