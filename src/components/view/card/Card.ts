import { Component } from '../../base/Component';
import type { IProduct } from '../../../types';
import { formatPrice } from '../../../utils/format';

export abstract class Card extends Component<IProduct> {
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