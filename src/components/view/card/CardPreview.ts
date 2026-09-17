import { Card } from './Card';

export class CardPreview extends Card {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	private _inCart = false;
	private _onClick: (() => void) | null = null;

	constructor(container: HTMLElement) {
		super(container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
		this._description = container.querySelector('.card__text') as HTMLElement;
		this._button = container.querySelector('.card__button') as HTMLButtonElement;

		this._button.addEventListener('click', () => this._onClick?.());
	}

	set image(value: string) {
		this._image.src = value;
	}

	set category(value: string) {
		this.setText(this._category, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set inCart(value: boolean) {
		this._inCart = value;
		this.setText(this._button, value ? 'Убрать из корзины' : 'Купить');
	}

	get inCart(): boolean {
		return this._inCart;
	}

	set onClick(handler: () => void) {
		this._onClick = handler;
	}

	set disabled(value: boolean) {
		this._button.disabled = value;
	}
}