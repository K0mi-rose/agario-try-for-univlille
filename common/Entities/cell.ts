import { Util, Color } from '../Tools/ColorUtil';

export namespace Entities{

    export interface Entity {
        getPosX(): number;

        getPosY(): number;
        
    }

    export class Cell implements Entity {
        x: number;
        y: number;
        size: number;
        swiftns: number;
        id: string;
        angle: number;
        color: Color;
        maxSpeed: number;
        name: string;
        alive: boolean;
        timeAlive: number;
        foodCount: number = 0;
        
        constructor(x: number, y: number, id: string, name: string, swiftness: number = 1, size: number = 20){
            this.x = x;
            this.y = y;
            this.swiftns = swiftness;
            this.size = size;
            this.id = id;
            this.name = name;
            this.angle = -1;
            this.color = Util.ColorPicker.getRandomColor();
            this.maxSpeed = 4;
            this.alive = true;
            this.timeAlive = Date.now();
        }

        getPosX(): number {
            return this.x;
        }
        getPosY(): number {
            return this.y;
        }

        getSize(): number {
            return this.size;
        }

        getSwiftness(): number {
            return this.swiftns;
        }

        getId(): string{
            return this.id;
        }

        setAngle(angle: number): void{
            this.angle = angle;
        }

        setSwiftness(x: number, y: number){
            let speed = Math.sqrt(Math.pow((this.x - x),2) + Math.pow(this.y - y,2))/(60)
            this.swiftns = speed > this.maxSpeed ? this.maxSpeed : speed;
        }

        setAlive(status: boolean): void {
            this.alive = status;
        }

        computeSwiftnessReduction(): number {
            return (0.3 * this.size)/100;
        }

        updatePlayer(width: number, height: number): void{
            if(this.angle != -1){
                if(this.xIsUpdatable(this.angle, width)) this.x += Math.sin(this.angle) * (this.swiftns - (this.swiftns * this.computeSwiftnessReduction())) ;
                else {
                    if(this.x + this.size > width ){
                        this.x -= 1;
                    } else if(this.x - this.size < 0){
                        this.x += 1;
                    }
                }
                if(this.yIsUpdatable(this.angle, height)) this.y += Math.cos(this.angle) * (this.swiftns - (this.swiftns * this.computeSwiftnessReduction()));
                else{
                    if(this.y + this.size > height ){
                        this.y -= 1;
                    } else if(this.y - this.size < 0){
                        this.y += 1;
                    }
                };
            }
        }

        xIsUpdatable(angle: number, size:number): boolean{
            return !((this.x - this.size + (Math.sin(angle) * this.swiftns)) < 0 || (this.x + this.size + (Math.sin(angle) * this.swiftns)) > size);
        }

        yIsUpdatable(angle: number, size:number): boolean{
            return !((this.y - this.size + (Math.cos(angle) * this.swiftns)) < 0 || (this.y + this.size + (Math.cos(angle) * this.swiftns)) > size);
        }
        
        //TODO: BOTH NEXT FUNCTIONS REQUIRE OTHER CLASSES, STILL TODO
        eatPlayer(otherPlayer: Cell): Cell | null {
            if( otherPlayer.size < this.size && Math.sqrt(Math.pow((otherPlayer.x - this.x), 2) + Math.pow((otherPlayer.y - this.y), 2)) < this.size && otherPlayer.size != 20){
                this.size += (otherPlayer.size/2)*(otherPlayer.size / this.size);
                otherPlayer.alive = false;
            return otherPlayer;
            }
            return null;

        }

        eatFood(food: Food): Food | null{
            if(Math.sqrt(Math.pow((food.x - this.x), 2) + Math.pow((food.y - this.y), 2)) < this.size){
                this.foodCount++;
                this.size += (1)*(20/this.size);
            return food;
            }
            return null;
        }
    }

    export class Food implements Entity{
        x: number;
        y: number;
        color: Color;
        
        constructor(maxWidth: number, maxHeight: number){
            this.x = Math.floor(Math.random() * (maxWidth+1));
            this.y = Math.floor(Math.random() * (maxHeight+1));
            this.color = Util.ColorPicker.getRandomColor();
        }

        getPosX(): number {
            return this.x;
        }
        getPosY(): number {
            return this.y;
        }

        getColor(): Color{
            return this.color;
        }
    }
}