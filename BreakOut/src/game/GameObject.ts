import * as PIXI from "pixi.js";
import { threadId } from "worker_threads";
import { GameView } from "../views/GameView";
import { GameObjectBehavior } from "./behavior/GameObjectBehavior";
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from "../GameEvents";

export class GameObject extends PIXI.Container {

    protected id: string;
    protected gameViewRef: GameView;
    protected behavior: Map<string, GameObjectBehavior>;
    protected renderer: Map<string, PIXI.DisplayObject>;
    protected active: boolean = false;
    private bonusTimer: number;

    constructor(gameViewRef: GameView) {
        super();
        this.gameViewRef = gameViewRef;
        this.init();
    }

    protected init() {
        this.renderer = new Map<string, PIXI.DisplayObject>();
        this.behavior = new Map<string, GameObjectBehavior>();
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.BONUS_END, this.bonusEnd, this)
    }

    public setId(id: string) {
        this.id = id;
    }

    public getId() {
        return this.id;
    }

    public destroy() {
        EventDispatcher.getInstance().getDispatcher().removeListener(GameEvents.BONUS_END, this.bonusEnd, this)
        
        this.renderer.forEach((obj, id) => {
            obj.destroy({ texture: true, baseTexture: true });
        });

        this.behavior.forEach((behavior) => {
            behavior.destroy();
        });

        this.behavior.clear();
        this.renderer.clear();

        this.gameViewRef = null;
        this.renderer = null;
        this.behavior = null;

        
    }

    public activate() {
        this.active = true;
    }

    public deactivate() {
        this.active = false;
    }

    public isActive(): Boolean {
        return this.active;
    }

    public getGameViewRef(): GameView {
        return this.gameViewRef;
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

        const renderable: PIXI.DisplayObject = this.renderer.get(id)

        this.removeChild(renderable);
        this.renderer.delete(id);
    }

    public getRenderableById(id: string): PIXI.DisplayObject | null | undefined {
        if (!this.renderer || !this.renderer.has(id)) {
            console.warn("getRenderableById() " + id + " does not exist");
            return null;
        }

        return this.renderer.get(id);
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

    public getBehaviorById(id: string): GameObjectBehavior | null | undefined {
        if (!this.behavior || !this.behavior.has(id)) {
            console.warn("getBehaviorById() " + id + " does not exist");
            return null;
        }

        return this.behavior.get(id);
    }

    private bonusEnd() {
        if (!this.behavior || !this.behavior.has('bonus')) {
            return;
        }

        this.unregisterBehavior('bonus')
    }


    public update(deltaTime: number) {
        this.behavior.forEach((behavior, id) => {
            behavior.update(deltaTime);
        });
    }

}
