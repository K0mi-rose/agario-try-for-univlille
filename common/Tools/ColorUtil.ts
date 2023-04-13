export type Color = {r: number, g: number, b: number}

export namespace Util {

    export class ColorPicker{
        static getRandomColor(): Color{
            return {r: Math.floor(Math.random() * (255 + 1)), g: Math.floor(Math.random() * (255 + 1)), b: Math.floor(Math.random() * (255 + 1))};
        }
    }

}