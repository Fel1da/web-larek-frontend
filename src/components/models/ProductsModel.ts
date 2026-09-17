import { Model } from '../base/Model';
import type { EventEmitter } from '../base/events';
import type { IProduct } from '../../types';
import { AppEvents } from '../../types';

export class ProductsModel extends Model<{
	items: IProduct[];
	preview: IProduct | null;
}> {
	constructor(events: EventEmitter) {
		super(events, { items: [], preview: null });
	}

	setProducts(items: IProduct[]): void {
		this.data.items = items;
		this.emitChanges(AppEvents.ProductsLoaded, { items: this.getProducts() });
	}

	setPreview(item: IProduct | null): void {
		this.data.preview = item;
		this.emitChanges(AppEvents.PreviewChanged, { preview: item });
	}

	getProductById(id: string): IProduct | undefined {
		return this.data.items.find((p) => p.id === id);
	}

	getProducts(): IProduct[] {
		return [...this.data.items];
	}

	getPreview(): IProduct | null {
		return this.data.preview;
	}
}