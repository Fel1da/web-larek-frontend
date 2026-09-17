import { Model } from '../base/Model';
import type { EventEmitter } from '../base/events';
import type { IProduct } from '../../types';
import { AppEvents } from '../../types';

export class CartModel extends Model<{ items: IProduct[] }> {
	constructor(events: EventEmitter) {
		super(events, { items: [] });
	}

	add(item: IProduct): void {
		if (this.has(item.id)) return;
		this.data.items.push(item);
		this.emitChanges(AppEvents.CartChanged, { items: this.getItems() });
	}

	remove(id: string): void {
		this.data.items = this.data.items.filter((p) => p.id !== id);
		this.emitChanges(AppEvents.CartChanged, { items: this.getItems() });
	}

	clear(): void {
		this.data.items = [];
		this.emitChanges(AppEvents.CartChanged, { items: [] });
	}

	has(id: string): boolean {
		return this.data.items.some((p) => p.id === id);
	}

	getItems(): IProduct[] {
		return [...this.data.items];
	}

	getCount(): number {
		return this.data.items.length;
	}

	getTotal(): number {
		return this.data.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
	}
}