import { GameObjectBehavior } from './GameObjectBehavior'
import * as PIXI from 'pixi.js';



export class GameObject extends PIXI.Container {

    private id: string;
    private behaviors: Map<string, GameObjectBehavior>;
    private isShooted: boolean = false;
    private isForDestroy: boolean = false;
    private isKilled: boolean = false;

    constructor(id: string) {
        super();
        this.id = id;
        this.init();
    }

    private init() {
        this.behaviors = new Map<string, GameObjectBehavior>();

    }

    public getId() {
        return this.id;
    }

    public update(delta: number) {
        this.behaviors.forEach((behavior) => {
            behavior.update(delta);

            const isShooted = behavior.shoot()
            if (isShooted) {
                this.isShooted = true;
            } else {
                this.isShooted = false
            }

            const isForDestroy = behavior.forDestroy()
            if (isForDestroy) {
                this.isForDestroy = true;
            } else {
                this.isForDestroy = false
            }

            const isKilled = behavior.killed()
            if (isKilled) {
                this.isKilled = true;
            } else {
                this.isKilled = false
            }
        })
    }

    public shoot() {
        return this.isShooted
    }

    public addBehavior(id: string, behavior: GameObjectBehavior) {
        this.behaviors.set(id, behavior);
    }

    public forDestroy(): boolean { 
        return this.isForDestroy
    }
    public killed(): boolean {
        return this.isKilled
    }
    public removeBehavior(id: string) {
        if (!this.behaviors.has(id)) {
            return;
        }

        this.behaviors.get(id).destroy()
        this.behaviors.delete(id);
    }
}