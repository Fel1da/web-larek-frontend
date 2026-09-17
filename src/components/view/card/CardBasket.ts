import { Card } from './Card';

export class CardBasket extends Card {
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, onClick: () => void) {
		super(container);
		this._index = container.querySelector('.basket__item-index') as HTMLElement;
		this._button = container.querySelector(
			'.basket__item-delete'
		) as HTMLButtonElement;
		this._button.addEventListener('click', onClick);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}