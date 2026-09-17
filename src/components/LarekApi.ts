import { Api } from './base/api';
import type {
	IOrder,
	IOrderResult,
	IProductsResponse,
} from '../types';

export class LarekApi extends Api {
	getProducts(): Promise<IProductsResponse> {
		return this.get('/product/') as Promise<IProductsResponse>;
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order/', order) as Promise<IOrderResult>;
	}
}