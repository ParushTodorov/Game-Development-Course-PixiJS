import { Button } from './Button'
import { EventDispatcher } from './EventDispatcher';

export class Button2 extends Button {

    constructor(label: string) {
        super(label);
        this.init()
    }

    protected init() {
        super.init();
    }

    protected onPointerUp() {
        super.onPointerUp();
        EventDispatcher.getInstance().getDispatcher().emit('initbtnup')
    }

    protected onPointerDown() {
        super.onPointerDown();
        EventDispatcher.getInstance().getDispatcher().emit('initbtndown')
    }
}