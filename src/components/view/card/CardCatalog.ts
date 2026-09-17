import { Card } from './Card';
import { getCategoryMod } from '../../../utils/format';

export class CardCatalog extends Card {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);
		this._image = container.querySelector('.card__image') as HTMLImageElement;
		this._category = container.querySelector('.card__category') as HTMLElement;
	}

	set image(value: string) {
		this._image.src = value;
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = 'card__category';
		this._category.classList.add(`card__category_${getCategoryMod(value)}`);
	}
}