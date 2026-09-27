import { Model } from '../base/Model';
import type { EventEmitter } from '../base/events';
import type { ICustomer, TPayment } from '../../types';
import { AppEvents } from '../../types';

/** Данные покупателя и проверка заполнения двух шагов заказа. */
export class OrderModel extends Model<ICustomer> {
	constructor(events: EventEmitter) {
		super(events, { payment: null, address: '', email: '', phone: '' });
	}

	setFields(data: Partial<ICustomer>): void {
		Object.assign(this.data, data);
		this.emitChanges(AppEvents.OrderValidationChanged);
	}

	validate(): Partial<Record<keyof ICustomer, string>> {
		const errors: Partial<Record<keyof ICustomer, string>> = {};
		if (!this.data.payment) errors.payment = 'Выберите способ оплаты';
		if (!this.data.address.trim()) errors.address = 'Укажите адрес';
		if (!this.data.email.trim()) errors.email = 'Укажите email';
		if (!this.data.phone.trim()) errors.phone = 'Укажите телефон';
		return errors;
	}

	get payment(): TPayment | null { return this.data.payment; }

	clear(): void {
		this.data = { payment: null, address: '', email: '', phone: '' };
		this.emitChanges(AppEvents.OrderValidationChanged);
	}
}
