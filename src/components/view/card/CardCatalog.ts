import { Card } from './Card';
import { getCategoryMod } from '../../../utils/format';

/** Карточка каталога сообщает о выборе товара через обработчик. */
export class CardCatalog extends Card<{ title: string; price: number | null; image: string; category: string }> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, onClick: () => void) {
		super(container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
		container.addEventListener('click', onClick);
	}

	set image(value: string) { this._image.src = value; }
	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = 'card__category';
		this._category.classList.add(`card__category_${getCategoryMod(value)}`);
	}
}
