import { Component } from '../../base/Component';
import { formatPrice } from '../../../utils/format';

export abstract class Card<T extends { title: string; price: number | null } = { title: string; price: number | null }> extends Component<T> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this._title = container.querySelector('.card__title') as HTMLElement;
		this._price = container.querySelector('.card__price') as HTMLElement;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number | null) {
		this.setText(this._price, formatPrice(value));
	}
}