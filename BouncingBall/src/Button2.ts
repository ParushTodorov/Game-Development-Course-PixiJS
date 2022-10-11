import {Button} from './Button'

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
        this.dispatcher.emit('btn2up')
    }

    protected onPointerDown() {
        super.onPointerDown();
        this.dispatcher.emit('btn2down')
    }
}