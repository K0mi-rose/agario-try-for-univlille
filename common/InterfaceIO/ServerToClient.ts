import { Entities } from "../Entities/cell";
import ScoreboardHandler from "../Scoreboard/ScoreboardLoader";
import { Game, Score } from "../Types/TypeList"

export interface ServerToClientEvents {
	currentGame: (game: Game) => void;
	start: () => void;
	askRestart: (element: Entities.Cell) => void;
	scoreboard: (scoreboard: Score[]) => void;
	score: (score: ScoreboardHandler) => void;
}
