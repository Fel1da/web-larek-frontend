import type { EventEmitter } from './events';

export abstract class Model<T extends object> {
	protected data: T;
	protected events: EventEmitter;

	constructor(events: EventEmitter, data: Partial<T> = {}) {
		this.events = events;
		this.data = data as T;
	}

	protected emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? this.data);
	}

	setData(data: Partial<T>): void {
		this.data = { ...this.data, ...data };
	}

	getData(): T {
		return { ...this.data } as T;
	}
}