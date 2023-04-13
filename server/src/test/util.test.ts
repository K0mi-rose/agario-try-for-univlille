import { Util, Color } from "../../../common/Tools/ColorUtil";

describe('colorUtilOk', () => {

    it('should return a color under the type of Color', () => {
        expect(Util.ColorPicker.getRandomColor().r).toBeLessThanOrEqual(255);
        expect(Util.ColorPicker.getRandomColor().g).toBeLessThanOrEqual(255);
        expect(Util.ColorPicker.getRandomColor().b).toBeLessThanOrEqual(255);
    })

})