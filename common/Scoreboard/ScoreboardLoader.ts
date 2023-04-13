import * as G from '../Entities/cell';

type ScorePart = {player: string, score: number}

export default class ScoreboardHandler {

    json: any;

    constructor(){
        fetch("http://localhost:8000/scores.json").then(data => data.json()).then(data => this.json = data); 
    }

    updateScoreboard(players: G.Entities.Cell[]): void{
        players.forEach(player => {
            this.putInScoreboard(player);
        });
    }

    putInScoreboard(player: G.Entities.Cell): void {
        for(let i = 0; i < this.json.length; i++){
            let element = this.json.at(i);
            if(player.size > element.score){
                element.player = player.name;
                element.score = Math.floor(player.size);
                return;
            }
        }
        /*
        this.json.forEach( (element: ScorePart) => {
            if(player.size > element.score){
                element.player = player.name;
                element.score = Math.floor(player.size);
                
            }
        });*/
    }

}