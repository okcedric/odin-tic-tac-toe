const Gameboard = (function(){
    let _gameBoard = [] ;
    let _grid=document.querySelector('#grid');
    let _nameBoard = document.querySelector('.name-board');
    let _playerShower1 = _nameBoard.querySelector('#player1');
    let _playerShower2 = _nameBoard.querySelector('#player2');
    let _sign1 = _playerShower1.querySelector('.sign');
    let _sign2 = _playerShower2.querySelector('.sign');
    let _username1 = _playerShower1.querySelector('.username');
    let _username2 = _playerShower2.querySelector('.username');
    
    
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

    function showPlayers() {
        _sign1.textContent = player1.sign;
        _sign2.textContent = player2.sign;
        _username1.textContent = player1.name;
        _username2.textContent = player2.name;
    }

    function playerToPlay() {
        return player1.isMyTurn ? player1 : player2
    }
    
    function showTurn() {
        let symbolShower = document.querySelector('#symbol');
        let usernameShower = document.querySelector('#player');
        
        symbolShower.textContent = playerToPlay().sign;
        usernameShower.textContent = playerToPlay().name;
        
        if (playerToPlay() == player1) {
            symbolShower.classList.remove('blue');
            symbolShower.classList.add('red');
            
        } else {
            symbolShower.classList.remove('red');
            symbolShower.classList.add('blue');
        }
    }
    function toggleTurn() {
        player1.isMyTurn = !(player1.isMyTurn);
        player2.isMyTurn = !(player2.isMyTurn);
        showTurn();
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
        showPlayers();
        showTurn();
    }
    
    function events() {
        let cells = Array.from(_grid.querySelectorAll('.cell'));
        cells.map(cell => {
            cell.addEventListener('click', () => {
                let id = cell.getAttribute('data-id');
                playerToPlay().play(id);
            })
        });

        _overlay.addEventListener('click', () => {
            Gameboard.init();
        });

       _nameBoard.addEventListener('click', () => {
                console.log('click')
            });
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
        showTurn,
        toggleTurn,
        showPlayers,
        isWinner,
        isTie,
    }
})();

const Player = (sign, name) => {

    const play = (position)=> {

        if (Gameboard.isFree(position)){
            Gameboard.write(position, sign)
            Gameboard.toggleTurn();
        } 
        
        Gameboard.render();
        let winner = Gameboard.isWinner()
        if(winner) {
            document.querySelector('#winner').textContent = winner.name + ' wins!';
            _overlay.classList.remove('hidden');
            if (winner.sign == "□") {
                _overlay.classList.add('red');
            } else {
                _overlay.classList.add('blue');
                
            }   
        } else if (Gameboard.isTie()) {
            document.querySelector('#winner').textContent = 'It\'s a tie!';
            _overlay.classList.remove('hidden');

        }
    }

    if(!name) name = sign;

    function setName(username){
        this.name = username;
    }

    let isMyTurn = false;
           
    return {
        play,
        setName,
        sign,
        name,
        isMyTurn,
    }
}




const error = (message) => console.log(`ERROR : ${message}`);

let player1 = Player("□",'Square');
let player2 = Player('○', "Circle");

player1.setName('Player 1');
player2.setName('Player 2');

player1.isMyTurn = true;

let _overlay = document.querySelector('#winner-overlay')

Gameboard.init();
