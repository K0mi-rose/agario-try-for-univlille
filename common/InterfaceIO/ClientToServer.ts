import { Pos } from "../Types/TypeList";

export interface ClientToServerEvents {
	join: (name: string) => void;
	playerMoved: (newData: {newAngle : number, globX: number, globY: number}) => void;
}
