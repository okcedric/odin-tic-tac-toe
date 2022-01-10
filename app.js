import { cross, circle } from "./constants.js";
import { Game } from "./models/Game.js";
import { Player } from './models/Player.js';

const player1 = Player(cross, "Cross", true);
const player2 = Player(circle, "Circle");

Game.init([player1, player2]);
