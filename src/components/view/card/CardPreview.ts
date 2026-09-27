import { Card } from './Card';

/** Отображает товар и сообщает о нажатии кнопки покупки. */
export class CardPreview extends Card<{ title: string; price: number | null; image: string; category: string; description: string }> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, onClick: () => void) {
		super(container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
		this._description = container.querySelector('.card__text') as HTMLElement;
		this._button = container.querySelector('.card__button') as HTMLButtonElement;
		this._button.addEventListener('click', onClick);
	}

	set image(value: string) { this._image.src = value; }
	set category(value: string) { this.setText(this._category, value); }
	set description(value: string) { this.setText(this._description, value); }
	set inCart(value: boolean) {
		this.setText(this._button, value ? 'Убрать из корзины' : 'Купить');
	}
	set disabled(value: boolean) { this._button.disabled = value; }
}
