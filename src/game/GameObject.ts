import { GameObjectBehavior } from './behavior/GameObjectBehavior'
import * as PIXI from 'pixi.js';
import { GameView } from '../views/GameView'



export class GameObject extends PIXI.Container {

    private id: string;
    protected gameViewRef: GameView;
    private behavior: Map<string, GameObjectBehavior>;
    protected renderer: Map<string, PIXI.DisplayObject>;
    protected active: boolean = false;

    constructor(gameViewRef: GameView) {
        super();
        this.gameViewRef = gameViewRef;
        this.init();
    }

    protected init() {
        this.renderer = new Map<string, PIXI.DisplayObject>();
        this.behavior = new Map<string, GameObjectBehavior>();
    }
    public setId(id: string) {
        this.id = id;
    }
    public getId(): string {
        return this.id;
    }
    public activate() {
        this.active = true;
    }
    public deactivate() {
        this.active = false;
    }
    public addBehavior(id: string, behavior: GameObjectBehavior) {
        this.behavior.set(id, behavior);
    }
    public getBonusBehavior(): GameObjectBehavior{
        return this.behavior.get('bonus')
    }
    public getBehavior(id: string): GameObjectBehavior {

        if (!this.behavior.has(id)) {
            return;
        }

        return this.behavior.get(id)
    }
    public registerRenderable(id: string, renderable: PIXI.DisplayObject) {
        if (this.renderer.has(id)) {
            console.warn("registerRenderable() " + id + " already exist");
            return;
        }

        this.renderer.set(id, renderable);

        this.addChild(renderable);
    }
    public unregisterRenderable(id: string) {
        if (!this.renderer.has(id)) {
            console.warn("unregisterRenderable() " + id + " does not exist");
            return;
        }

        this.removeChild(this.renderer.get(id) as PIXI.DisplayObject);
        this.renderer.delete(id);
    }
    public registerBehavior(id: string, behavior: GameObjectBehavior) {
        if (this.behavior.has(id)) {
            console.warn("registerBehavior() " + id + " already exist");
            return;
        }

        this.behavior.set(id, behavior);
    }
    public unregisterBehavior(id: string) {
        if (!this.behavior.has(id)) {
            console.warn("unregisterBehavior() " + id + " does not exist");
            return;
        }

        this.behavior.get(id).destroy()
        this.behavior.delete(id);
    }
    public getRenderableById(id: string): PIXI.DisplayObject | null | undefined {
        if (!this.renderer || !this.renderer.has(id)) {
            console.warn("getRenderableById() " + id + " does not exist");
            return null;
        }

        return this.renderer.get(id);
    }
    public update(delta: number) {
        this.behavior.forEach((behavior) => {
            behavior.update(delta);
        })
    }

}