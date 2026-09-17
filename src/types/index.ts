// Данные из API
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductsResponse {
	total: number;
	items: IProduct[];
}

export type TPayment = 'card' | 'cash';

export interface ICustomer {
	payment: TPayment;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends ICustomer {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

// Клиент API
export interface IApi {
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: string): Promise<T>;
}

export interface IApiError {
	error: string;
}

// Данные для отображения
export interface IProductView extends IProduct {
	image: string;
}

// События приложения
export enum AppEvents {
	ProductsLoaded = 'products:loaded',
	ProductSelect = 'product:select',
	PreviewChanged = 'preview:changed',

	CartChanged = 'cart:changed',
	BasketOpen = 'basket:open',
	BasketItemRemove = 'basket:item-remove',

	ModalClose = 'modal:close',

	OrderOpen = 'order:open',
	OrderChanged = 'order:changed',
	OrderSubmit = 'order:submit',
	ContactsSubmit = 'contacts:submit',
}

//Фабрики и сигнатуры
export type TCardFactory<T> = (item: T, index: number) => HTMLElement;