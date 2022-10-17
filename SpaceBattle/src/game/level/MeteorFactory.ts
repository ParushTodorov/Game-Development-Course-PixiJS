import * as PIXI from 'pixi.js';
import { GameView } from '../../views/GameView';
import { GameObject } from '../GameObject';
import { GameApplication } from '../../GameApplication';
import { Model } from '../../Model';
import { MeteorBehavior } from '../behavior/meteors/MeteorBehavior';
import { MeteorBehaviorLeft } from '../behavior/meteors/MeteorBehaviorLeft';
import { MeteorBehaviorLeftSpeedUp } from '../behavior/meteors/MeteorBehaviorLeftSpeedUp';
import { MeteorBehaviorSpeedUp } from '../behavior/meteors/MeteorBehaviorSpeedUp';

export class MeteorFactory extends PIXI.Container {

    private meteors: Array<GameObject>;
    private meteorCount: number = 6;

    private gameViewRef: GameView;
    private direction: boolean = false;

    constructor(gameViewRef: GameView) {
        super();

        this.gameViewRef = gameViewRef;
        this.init();
    }

    public startMeteorShower(): Array<GameObject> {
        let direction: string = 'right'
        this.meteors = []
        if (this.direction) {
            direction = 'left';
            this.direction = false;
        } else {
            this.direction = true;
        }
        console.log(direction)

        if (this.meteorCount <= 9) {
            return this.getLevel(1, direction);
        } else {
            return this.getLevel(2, direction);
        }
    }

    private getLevel(difficulty: number, direction: string): Array<GameObject> {


        if (this.meteorCount < 10) {
            this.meteorCount++
        }

        if (difficulty === 1) {
            for (let i = 0; i < this.meteorCount; i++) {
                const meteor = this.meteorFactory(difficulty, direction)
                this.meteors.push(meteor)
            };
            return this.meteors;
        }

        if (difficulty === 2) {
            for (let i = 0; i < 4; i++) {
                const meteor = this.meteorFactory(1, direction)
                this.meteors.push(meteor)
            };

            for (let i = 0; i < 6; i++) {
                const meteor = this.meteorFactory(difficulty, direction)
                this.meteors.push(meteor)
            };

            return this.meteors;
        }

        return this.meteors;
    }

    private init() {
        this.meteors = [];
    }

    private meteorFactory(difficulty: number, direction: string): GameObject {
        const meteor: GameObject = new GameObject(this.gameViewRef);
        const gfx: PIXI.Graphics = new PIXI.Graphics();

        switch (difficulty) {
            case 1:
                switch (direction) {
                    case 'left':
                        {
                            const gfx: PIXI.Graphics = new PIXI.Graphics();
                            gfx.lineStyle(2, 0x000000, 1)
                            gfx.beginFill(0xc0c0c0);
                            gfx.drawRoundedRect(0, 0, 8, 13, 5)
                            gfx.endFill();

                            gfx.cacheAsBitmap = true;

                            meteor.registerRenderable('meterImg', gfx);

                            const meteorBehaviorLevelOne: MeteorBehaviorLeft = new MeteorBehaviorLeft(meteor)

                            meteor.registerBehavior('meteorBehaviorLevelOne', meteorBehaviorLevelOne)
                            break;
                        };
                    case 'right':
                        {
                            const gfx: PIXI.Graphics = new PIXI.Graphics();
                            gfx.lineStyle(2, 0x000000, 1)
                            gfx.beginFill(0xc0c0c0);
                            gfx.drawRoundedRect(0, 0, 8, 13, 5)
                            gfx.endFill();

                            gfx.cacheAsBitmap = true;

                            meteor.registerRenderable('meterImg', gfx);

                            const meteorBehaviorLevelOne: MeteorBehavior = new MeteorBehavior(meteor)

                            meteor.registerBehavior('meteorBehaviorLevelOne', meteorBehaviorLevelOne)
                            break;
                        }
                }
                break;
            case 2:
                switch (direction) {
                    case 'left':
                        {
                            const gfx: PIXI.Graphics = new PIXI.Graphics();
                            gfx.lineStyle(2, 0x000000, 1)
                            gfx.beginFill(0xc0c0c0);
                            gfx.drawRoundedRect(0, 0, 10, 15, 5)
                            gfx.endFill();

                            gfx.cacheAsBitmap = true;

                            meteor.registerRenderable('meterImg', gfx);

                            const meteorBehaviorLevelTwo: MeteorBehaviorLeftSpeedUp = new MeteorBehaviorLeftSpeedUp(meteor)

                            meteor.registerBehavior('meteorBehaviorLevelOne', meteorBehaviorLevelTwo)
                            break;
                        };
                    case 'right':
                        {
                            const gfx: PIXI.Graphics = new PIXI.Graphics();
                            gfx.lineStyle(2, 0x000000, 1)
                            gfx.beginFill(0xc0c0c0);
                            gfx.drawRoundedRect(0, 0, 10, 15, 5)
                            gfx.endFill();

                            gfx.cacheAsBitmap = true;

                            meteor.registerRenderable('meterImg', gfx);

                            const meteorBehaviorLevelTwo: MeteorBehaviorSpeedUp = new MeteorBehaviorSpeedUp(meteor)

                            meteor.registerBehavior('meteorBehaviorLevelOne', meteorBehaviorLevelTwo)
                            break;
                        }
                }
                break;
        }

        return meteor;
    }
}