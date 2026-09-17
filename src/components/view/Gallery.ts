import { Component } from '../base/Component';
import type { IProduct } from '../../types';
import type { TCardFactory } from '../../types';

export class Gallery extends Component {
	constructor(
		container: HTMLElement,
		private cardFactory: TCardFactory<IProduct>
	) {
		super(container);
	}

	setItems(items: IProduct[]): void {
		const cards = items.map((item, i) => this.cardFactory(item, i));
		this.container.replaceChildren(...cards);
	}
}