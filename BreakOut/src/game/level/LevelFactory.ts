import * as PIXI from 'pixi.js';
import { GameView } from '../../views/GameView';
import { GameObject } from '../GameObject';
import { GameApplication } from '../../GameApplication';
import { BrickType } from './BrickType';
import { Model } from '../../Model';
import { BrickBehaviorLevel1 } from '../behavior/BrickBehaviors/BrickBehaviorLevel1';
import { BrickBehaviorLevel2 } from '../behavior/BrickBehaviors/BrickBehaviorLevel2';
import { BrickBehaviorLevel3 } from '../behavior/BrickBehaviors/BrickBehaviorLevel3';
import { BrickBehaviorLevel4 } from '../behavior/BrickBehaviors/BrickBehaviorLevel4';
import { BrickBehaviorLevel5 } from '../behavior/BrickBehaviors/BrickBehaviorLevel5';
import { BrickBehaviorLevel6 } from '../behavior/BrickBehaviors/BrickBehaviorLevel6';
import { BrickBehaviorLevel7 } from '../behavior/BrickBehaviors/BrickBehaviorLevel7';
import { CollisionManager } from '../../CollisionManager';

export class LevelFactory extends PIXI.Container {

    private bricks: Array<GameObject>;
    private gameViewRef: GameView;
    private brickTop: number = 100;
    private skyFallBrick: number = 0;
    private nbrBrickHorizontal: number;
    private nbrBrickVertical: number;

    constructor(gameViewRef: GameView) {
        super();

        this.gameViewRef = gameViewRef;
        this.init();
    }

    private init() {
        this.bricks = [];
    }

    public getNextLevel(level: number): Array<GameObject> {
        return this.getLevel(6);
    }

    private getLevel(difficulty: number): Array<GameObject> {
        this.calculateNumberOfBricks(difficulty);

        let brickWidth: number;
        let brickHeight: number;

        this.bricks = [];

        Model.getInstance().setTotalNbrBrick(this.nbrBrickHorizontal * this.nbrBrickVertical);
        brickWidth = (GameApplication.STAGE_WIDTH - 4) / this.nbrBrickHorizontal;
        brickHeight = Math.floor(GameApplication.STAGE_HEIGHT * 0.03);
        for (let i = 0; i < this.nbrBrickVertical; i++) {
            for (let j = 0; j < this.nbrBrickHorizontal; j++) {
                const targetDifficulty: number = this.calculateTargetDifficulty(difficulty, this.nbrBrickHorizontal, i, j);

                const brick: GameObject = this.brickFactory(targetDifficulty, brickWidth, brickHeight);
                const coord: PIXI.Point = this.getPosition(j, i, brickWidth, brickHeight);
                brick.x = coord.x;
                brick.y = coord.y;
                this.bricks.push(brick)
            }
        }

        return this.bricks;
    }

    private calculateNumberOfBricks(difficulty: number) {
        if (difficulty <= 3) {
            this.nbrBrickHorizontal = 10;
            this.nbrBrickVertical = 3
        } else if (3 < difficulty && difficulty <= 10) {
            this.nbrBrickHorizontal = 15;
            this.nbrBrickVertical = 3
        } else if (10 < difficulty && difficulty <= 20) {
            this.nbrBrickHorizontal = 15;
            this.nbrBrickVertical = 4
        } else if (20 < difficulty) {
            this.nbrBrickHorizontal = 20;
            this.nbrBrickVertical = 4
        }
    }

    private calculateTargetDifficulty(difficulty: number, nbrBrickHorizontal: number, i: number, j: number): number {

        const rand: number = Math.random();
        let targetDifficulty: number;

        if (rand <= 0.40) {
            targetDifficulty = 1;
        } else if (rand > 0.40 && rand <= 0.55) {
            targetDifficulty = 2;
        } else if (rand > 0.55 && rand <= 0.65) {
            targetDifficulty = 3;
        } else if (rand > 0.65 && rand <= 0.70) {
            targetDifficulty = 4;
        } else if (rand > 0.70 && rand <= 0.83) {
            targetDifficulty = 5;
        } else if (rand > 0.83 && rand <= 0.93) {
            targetDifficulty = 6;
        } else {
            targetDifficulty = 7;
        }

        if (targetDifficulty > difficulty) {
            targetDifficulty = this.calculateTargetDifficulty(difficulty, nbrBrickHorizontal, i, j);
        }

        if (targetDifficulty === 4) {
            this.skyFallBrick++;
            if (this.skyFallBrick > 0) {
                targetDifficulty = this.calculateTargetDifficulty(difficulty, nbrBrickHorizontal, i, j);
            }
        };

        if ((targetDifficulty != 6) || (i === 0 || (j === 0 || j === nbrBrickHorizontal - 1))) {
            return targetDifficulty;
        }

        const index: number = this.bricks.length - nbrBrickHorizontal;
        const indexList: Array<number> = [index - 1, index, index + 1, this.bricks.length - 1];
        let isType6: boolean = false;

        indexList.forEach((index) => {
            if (CollisionManager.setBrickType(this.bricks[index]) === BrickType.TYPE_6) {
                isType6 = true
            }
        });

        if (isType6) {
            targetDifficulty = this.calculateTargetDifficulty(difficulty, nbrBrickHorizontal, i, j);
        };

        return targetDifficulty;

    }

    private getPosition(x: number, y: number, width: number, height: number): PIXI.Point {
        const starPos: number = 2;
        const coord: PIXI.Point = new PIXI.Point();
        coord.x = x === 0 ? x * width + starPos : x * width;
        coord.y = (y * height) + this.brickTop;
        return coord;
    }

    private createBrickGfx(width: number, height: number): PIXI.Sprite {
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.lineStyle(1, 0x000000, 1)
        gfx.beginFill(0xffffff);
        gfx.drawRect(0, 0, width, height);
        gfx.endFill();

        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
        return sprite
    }

    private brickFactory(difficulty: number, width: number, height: number): GameObject {
        const brick: GameObject = new GameObject(this.gameViewRef);

        switch (difficulty) {
            case 1:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height);
                    sprite.tint = 0x00ff00;

                    brick.registerRenderable('brickImg', sprite);

                    brick.width = width;
                    brick.height = height;

                    const brickBehaviorLevel1: BrickBehaviorLevel1 = new BrickBehaviorLevel1(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel1)
                }
                break;
            case 2:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height);
                    sprite.tint = 0xffff00;

                    brick.registerRenderable('brickImg', sprite);

                    brick.width = width;
                    brick.height = height;

                    const brickBehaviorLevel2: BrickBehaviorLevel2 = new BrickBehaviorLevel2(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel2)
                }
                break;
            case 3:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height)
                    sprite.tint = 0xff0000;

                    brick.registerRenderable('brickImg', sprite);

                    brick.width = width;
                    brick.height = height;

                    const brickBehaviorLevel3: BrickBehaviorLevel3 = new BrickBehaviorLevel3(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel3)
                }
                break;
            case 4:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height)
                    sprite.tint = 0x0000ff;

                    brick.registerRenderable('brickImg', sprite);

                    brick.width = width;
                    brick.height = height;

                    const brickBehaviorLevel4: BrickBehaviorLevel4 = new BrickBehaviorLevel4(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel4)
                }
                break;
            case 5:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height)
                    sprite.tint = 0xff7f00;

                    brick.registerRenderable('brickImg', sprite);

                    brick.width = width;
                    brick.height = height;

                    const brickBehaviorLevel5: BrickBehaviorLevel5 = new BrickBehaviorLevel5(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel5)
                }
                break;
            case 6:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height)
                    sprite.tint = 0x9400D3;

                    brick.registerRenderable('brickImg', sprite);


                    const brickBehaviorLevel6: BrickBehaviorLevel6 = new BrickBehaviorLevel6(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel6)
                }
                break;
            case 7:
                {
                    const sprite: PIXI.Sprite = this.createBrickGfx(width, height)
                    sprite.tint = 0x4B0082;

                    brick.registerRenderable('brickImg', sprite);


                    const brickBehaviorLevel6: BrickBehaviorLevel7 = new BrickBehaviorLevel7(brick)

                    brick.registerBehavior('brickBehavior', brickBehaviorLevel6)
                }
        }

        return brick;
    }


}