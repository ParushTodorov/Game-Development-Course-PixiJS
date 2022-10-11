import { throwStatement } from '@babel/types';
import {Button} from './Button'

export class Button1 extends Button {

    constructor(label: string) {
        super(label);
        this.init()
    }

    protected init() {
        super.init();
    }

    protected onPointerUp() {
        super.onPointerUp();
        
        this.dispatcher.emit('btn1up')
    }

    protected onPointerDown() {
        super.onPointerDown();
        
        this.dispatcher.emit('btn1down')
    }
}