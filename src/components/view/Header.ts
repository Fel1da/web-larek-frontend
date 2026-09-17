import { Component } from '../base/Component';
import type { EventEmitter } from '../base/events';
import { AppEvents } from '../../types';

export class Header extends Component<{ counter: number }> {
	protected _counter: HTMLElement;
	protected _basketBtn: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._counter = container.querySelector(
			'.header__basket-counter'
		) as HTMLElement;
		this._basketBtn = container.querySelector(
			'.header__basket'
		) as HTMLButtonElement;

		this._basketBtn.addEventListener('click', () => {
			this.events.emit(AppEvents.BasketOpen, {});
		});
	}

	set counter(value: number) {
		this._counter.textContent = String(value);
	}
}