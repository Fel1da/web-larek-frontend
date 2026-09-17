import { Form } from './Form';
import type { EventEmitter } from '../../base/events';
import { AppEvents } from '../../../types';

export class ContactsForm extends Form {
	constructor(container: HTMLFormElement, events: EventEmitter) {
		super(container, events);
	}

	protected onInput(name: string, value: string): void {
		if (name === 'email' || name === 'phone') {
			this.events.emit(AppEvents.OrderChanged, { [name]: value });
		}
	}

	protected onSubmit(): void {
		this.events.emit(AppEvents.ContactsSubmit, {});
	}
}