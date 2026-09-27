import { Component } from '../base/Component';
import type { EventEmitter } from '../base/events';
import { AppEvents } from '../../types';
import { formatPrice } from '../../utils/format';

/** Выводит подготовленные карточки корзины и итог заказа. */
export class Basket extends Component {
	protected _list: HTMLElement;
	protected _empty: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._list = container.querySelector('.basket__list') as HTMLElement;
		this._empty = container.querySelector('.basket__empty') as HTMLElement;
		this._button = container.querySelector('.basket__button') as HTMLButtonElement;
		this._price = container.querySelector('.basket__price') as HTMLElement;
		this._button.addEventListener('click', () => this.events.emit(AppEvents.OrderOpen, {}));
	}

	set items(cards: HTMLElement[]) {
		this._list.replaceChildren(...cards);
		this._empty.hidden = cards.length !== 0;
		this._button.disabled = cards.length === 0;
	}

	set total(value: number) {
		this.setText(this._price, formatPrice(value));
	}
}
