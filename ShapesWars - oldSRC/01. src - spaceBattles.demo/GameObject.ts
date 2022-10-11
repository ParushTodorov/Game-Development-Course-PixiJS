import { GameObjectBehavior } from './GameObjectBehavior'
import * as PIXI from 'pixi.js'


export class GameObject extends PIXI.Container {

    private id: string;
    private behaviors: Map<string, GameObjectBehavior>;

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
            
            if (behavior.shoot){
                return true
            }
        })
    }

    public shoot(){
        return true
    }

    public addBehavior(id: string, behavior: GameObjectBehavior) {
        this.behaviors.set(id, behavior);
    }

    public removeBehavior(id: string) {
        if (!this.behaviors.has(id)) {
            return;
        }

        this.behaviors.get(id).destroy()
        this.behaviors.delete(id);
    }
}