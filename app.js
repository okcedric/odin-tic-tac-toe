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
            console.log(cell);
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

    function checkForWinner(){
        
        if(_gameBoard[4]){
            if ((_gameBoard[4] == _gameBoard[0]) && (_gameBoard[4] == _gameBoard[8])) return _gameBoard[4];
            if ((_gameBoard[4] == _gameBoard[1]) && (_gameBoard[4] == _gameBoard[7])) return _gameBoard[4];
            if ((_gameBoard[4] == _gameBoard[2]) && (_gameBoard[4] == _gameBoard[6])) return _gameBoard[4];
            if ((_gameBoard[4] == _gameBoard[3]) && (_gameBoard[4] == _gameBoard[5])) return _gameBoard[4];
        };
        if(_gameBoard[0]){
            if ((_gameBoard[0] == _gameBoard[1]) && (_gameBoard[0] == _gameBoard[2])) return _gameBoard[0];
            if ((_gameBoard[0] == _gameBoard[3]) && (_gameBoard[0] == _gameBoard[6])) return _gameBoard[0];
                };
        if(_gameBoard[8]){
            if ((_gameBoard[8] == _gameBoard[2]) && (_gameBoard[8] == _gameBoard[5])) return _gameBoard[8];
                    if ((_gameBoard[8] == _gameBoard[6]) && (_gameBoard[8] == _gameBoard[7])) return _gameBoard[8];
                };

        
                return false
    }
    function checkForTie(){
        let cells = Array.from(_grid.querySelectorAll('.cell'));
        return cells.every((cell)=> !!cell.textContent);
    }
    
    function render() {
        console.log('render');
        for (let i = 0; i < 9; i++) {
            let cell = _grid.querySelector(`[data-id = "${i}"]`);
                console.log(cell)
                cell.innerText = _gameBoard[i];
                if (_gameBoard[i] == '□'){
                    cell.classList.add('red');
                } else {
                    cell.classList.add('blue');
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
        checkForWinner,
        checkForTie,
    }
})();

const Player = (sign, name) => {

    if (!(name)) name = sign;

    const play = (position)=> {

        if (Gameboard.isFree(position)){
            Gameboard.write(position, sign)
            toggleTurn();
        } 
        
        error('Cette place est déjà prise');
        Gameboard.render();
        let winner = Gameboard.checkForWinner()
        if(winner) {
            document.querySelector('#winner').textContent = winner + ' wins!';
            _overlay.classList.remove('hidden');
            if (winner == "□") {
                _overlay.classList.add('red');
            } else {
                _overlay.classList.add('blue');
                
            }   
        } 
        
        let tie = Gameboard.checkForTie();
        if (tie) {
            document.querySelector('#winner').textContent = 'It\'s a tie!';
            _overlay.classList.remove('hidden');

        }
    }
    
    let isMyTurn = false;
           
    return {
        play,
        sign,
        name,
        isMyTurn,
    }
}


const toggleTurn = () => {
    console.log(player1.isMyTurn);
    console.log(player2.isMyTurn);
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
