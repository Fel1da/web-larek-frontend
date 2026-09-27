import type { EventEmitter } from './events';

export abstract class Model<T extends object> {
	protected data: T;
	protected events: EventEmitter;

	constructor(events: EventEmitter, data: T) {
		this.events = events;
		this.data = data;
	}

	protected emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? this.data);
	}

	getData(): T {
		return { ...this.data };
	}
}