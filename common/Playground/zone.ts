import * as G from '../Entities/cell';
import { Game } from '../Types/TypeList';
import ScoreboardHandler from '../Scoreboard/ScoreboardLoader';

export type Player = { player: G.Entities.Cell };
export type Food = { food: G.Entities.Food };

export namespace Zone {

    export class Playground {
        public width: number;
        public height: number;
        private _foodNumber: number;
        private _players: G.Entities.Cell[] = [];
        private _food: G.Entities.Food[] = [];
        private _tempFood: G.Entities.Food[] = [];
        private _tempPlayers: G.Entities.Cell[] = [];
        private _playersStatus: Player[] = [];
        private _foodStatus: Food[] = [];
        private readonly foodSize = 5;
        private _scoreboardl: ScoreboardHandler;

        constructor(width: number = 2000, height: number = 2000, foodNumber: number = 50) {
            this.width = width;
            this.height = height;
            this._foodNumber = foodNumber;
            this.initSomeFood();
            this._scoreboardl = new ScoreboardHandler();
        }

        addPlayer(player: G.Entities.Cell): void{
            this._players.push(player);
        }

        popPlayer(id: string): void{
            const index = this._players.findIndex(element => element.id == id);
            if(index != undefined){
                //this._players.slice(index, 1);
                this._players = this._players.filter(function(player) {
                    return player.id !== id
                });
            }
        }

        updatePlayers(): G.Entities.Cell[] {
            const eatenPlayers: G.Entities.Cell[] = [];
            this._players.forEach(player => {
                player.updatePlayer(this.width, this.height);
                this._tempFood = this._food;
                this._food.forEach(food => {
                    let eaten = player.eatFood(food);
                    if(eaten != null) {
                        const index = this._food.findIndex(food => {
                            food == eaten;
                        })
                        this._tempFood = this._tempFood.filter(function(food) {
                            return food != eaten;
                        });
                    }
                });
                this._food = this._tempFood;
                this._tempPlayers = this._players;
                this._players.forEach(player2 => {
                    let eaten = player.eatPlayer(player2);
                    if(eaten != null) {
                        eatenPlayers.push(eaten);
                        const index = this._players.findIndex(pl => {
                            pl == eaten;
                        })
                        this._tempPlayers = this._tempPlayers.filter(function(pl) {
                            return pl != eaten;
                        });
                    }
                });
                this._players = this._tempPlayers;
                if(this._food.length < this._foodNumber){
                    this.refillFood();
                }
            });
            return eatenPlayers;
        }

        updatePlayerPos(id: string, angle: number = -1, x: number = -1, y: number = -1): void{
            const index = this._players.findIndex(element => element.id == id);
            if(index != -1) this._players[index].setAngle(angle);
            if(x != -1 && y != -1 && index != -1) this._players[index].setSwiftness(x,y); 
        }

        initSomeFood(): void{
            for(let fnumber = 0; fnumber < this._foodNumber; fnumber++){
                this._food.push(new G.Entities.Food(this.width, this.height));
            }
        }

        getCurrentGame(): Game {
            this._playersStatus = [];
            this._foodStatus = [];
            this._players.forEach( player => this._playersStatus.push({player: player}));
            this._food.forEach( food => this._foodStatus.push({food: food}));
            return {players: this._playersStatus, foods: this._foodStatus, width: this.width, height: this.height};
        }

        getWidth(): number {
            return this.width;
        }

        getHeight(): number {
            return this.height;
        }
        
        refillFood(): void{
            for(let i = this._food.length; i <= this._foodNumber; i++){
                this._food.push(new G.Entities.Food(this.width, this.height));
            }
        }

        updateScores(eaten: G.Entities.Cell[]): void {
            this._scoreboardl.updateScoreboard(eaten);
        }

        getScoreboard(): ScoreboardHandler {
            return this._scoreboardl;
        };
    }

}