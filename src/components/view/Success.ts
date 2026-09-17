import { Component } from '../base/Component';
import type { EventEmitter } from '../base/events';
import { AppEvents } from '../../types';
import { formatPrice } from '../../utils/format';

export class Success extends Component<{ total: number }> {
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._description = container.querySelector(
			'.order-success__description'
		) as HTMLElement;
		this._button = container.querySelector(
			'.order-success__close'
		) as HTMLButtonElement;

		this._button.addEventListener('click', () => {
			this.events.emit(AppEvents.ModalClose, {});
		});
	}

	set total(value: number) {
		this.setText(this._description, `Списано ${formatPrice(value)}`);
	}
}