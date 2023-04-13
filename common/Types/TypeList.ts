import { Player } from "../Playground/zone";
import { Food } from "../Playground/zone";

export type Pos = {newX: number, newY: number};
export type Game = {players: Player[], foods: Food[], width: number, height: number};
export type Score = {player: string, score: number};