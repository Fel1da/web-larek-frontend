import { Component } from '../base/Component';
import type { EventEmitter } from '../base/events';
import type { IProduct } from '../../types';
import type { TCardFactory } from '../../types';
import { AppEvents } from '../../types';
import { formatPrice } from '../../utils/format';

export class Basket extends Component {
	protected _list: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(
		container: HTMLElement,
		protected events: EventEmitter,
		private cardFactory: TCardFactory<IProduct>
	) {
		super(container);
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._button = container.querySelector('.basket__button') as HTMLButtonElement;
		this._price = container.querySelector('.basket__price') as HTMLElement;

		this._button.addEventListener('click', () => {
			this.events.emit(AppEvents.OrderOpen, {});
		});
	}

	setItems(items: IProduct[], total: number): void {
		const cards = items.map((item, i) => this.cardFactory(item, i + 1));
		this._list.replaceChildren(...cards);
		this.setText(this._price, formatPrice(total));
		this._button.disabled = items.length === 0;
	}
}