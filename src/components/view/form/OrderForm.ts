import { Form } from './Form';
import type { EventEmitter } from '../../base/events';
import type { TPayment } from '../../../types';
import { AppEvents } from '../../../types';

export class OrderForm extends Form {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
		this._card = container.querySelector('button[name="card"]') as HTMLButtonElement;
		this._cash = container.querySelector('button[name="cash"]') as HTMLButtonElement;

		this._card.addEventListener('click', () => {
			this.setPayment('card');
			this.events.emit(AppEvents.OrderChanged, { payment: 'card' });
		});
		this._cash.addEventListener('click', () => {
			this.setPayment('cash');
			this.events.emit(AppEvents.OrderChanged, { payment: 'cash' });
		});
	}

	setPayment(value: TPayment | null): void {
		this.toggleClass(this._card, 'button_alt-active', value === 'card');
		this.toggleClass(this._cash, 'button_alt-active', value === 'cash');
	}

	protected onInput(name: string, value: string): void {
		if (name === 'address') {
			this.events.emit(AppEvents.OrderChanged, { address: value });
		}
	}

	protected onSubmit(): void {
		this.events.emit(AppEvents.OrderSubmit, {});
	}
}