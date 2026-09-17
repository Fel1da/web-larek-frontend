import { Model } from '../base/Model';
import type { EventEmitter } from '../base/events';
import type { ICustomer } from '../../types';

export class OrderModel extends Model<Partial<ICustomer>> {
	constructor(events: EventEmitter) {
		super(events, {});
	}

	setFields(data: Partial<ICustomer>): void {
		Object.assign(this.data, data);
	}

	validate(): Partial<Record<keyof ICustomer, string>> {
		const errors: Partial<Record<keyof ICustomer, string>> = {};
		if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
		if (!this.data.address?.trim()) errors.address = 'Укажите адрес';
		if (!this.data.email?.trim()) errors.email = 'Укажите email';
		if (!this.data.phone?.trim()) errors.phone = 'Укажите телефон';
		return errors;
	}

	clear(): void {
		this.data = {};
	}
}