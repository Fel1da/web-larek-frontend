import { Model } from '../base/Model';
import type { EventEmitter } from '../base/events';
import type { IProduct } from '../../types';
import { AppEvents } from '../../types';

/**
 * Хранит каталог товаров и выбранный товар для детального просмотра.
 * Передаёт изменения презентеру через products:loaded и preview:changed.
 */
export class ProductsModel extends Model<{ items: IProduct[]; preview: IProduct | null }> {
	/** @param events Брокер событий приложения. */
	constructor(events: EventEmitter) {
		super(events, { items: [], preview: null });
	}

	/** Заменяет каталог и оповещает подписчиков. */
	setProducts(items: IProduct[]): void {
		this.data.items = [...items];
		this.emitChanges(AppEvents.ProductsLoaded);
	}

	/** Выбирает товар для просмотра или снимает выбор. */
	setPreview(item: IProduct | null): void {
		this.data.preview = item;
		this.emitChanges(AppEvents.PreviewChanged);
	}

	/** Находит товар по идентификатору. */
	getProductById(id: string): IProduct | undefined {
		return this.data.items.find((p) => p.id === id);
	}

	/** Возвращает копию списка товаров. */
	getProducts(): IProduct[] { return [...this.data.items]; }
	/** Возвращает выбранный товар. */
	getPreview(): IProduct | null { return this.data.preview; }
}
