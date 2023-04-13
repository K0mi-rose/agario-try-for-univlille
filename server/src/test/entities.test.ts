import { Entities } from "../../../common/Entities/cell";



describe('entitiesCreationOk', () => {

    const cell = new Entities.Cell(0,0,'0','0')
    const food = new Entities.Food(1000,1000);

    it('should return a new cell specified with default params', () => {
        expect(cell.getSize()).toBeGreaterThan(0);
        expect(cell.getSwiftness()).toBeGreaterThan(0);
    })

    it('should return a new food inferior to param and superior to zero', () => {
        expect(food.getPosX()).toBeGreaterThanOrEqual(0);
        expect(food.getPosX()).toBeLessThanOrEqual(1000);
        expect(food.getPosY()).toBeGreaterThanOrEqual(0);
        expect(food.getPosY()).toBeLessThanOrEqual(1000);        
    })
})