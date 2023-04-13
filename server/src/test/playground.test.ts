import { Entities } from "../../../common/Entities/cell";
import { Zone } from "../../../common/Playground/zone";

describe('zoneCreationOk', () => {

    const playground = new Zone.Playground();
    const player = new Entities.Cell(0,0,'newPlayerId','newPlayer');


    beforeEach(() => {
        playground.addPlayer(player);
        //Food is already added on creation and when lacking
    })

    it('should create correctly with default parameters', () => {
        expect(playground.getWidth()).not.toBeNull();
        expect(playground.getHeight()).not.toBeNull();
    })

    it('should be able to contain player and food', () => {
        expect(playground.getCurrentGame().players.length).toBeGreaterThan(0);
        expect(playground.getCurrentGame().foods.length).toBeGreaterThan(0);
    })

})