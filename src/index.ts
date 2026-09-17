import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { LarekApi } from './components/LarekApi';
import { ProductsModel } from './components/models/ProductsModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { CardCatalog } from './components/view/card/CardCatalog';
import { CardPreview } from './components/view/card/CardPreview';
import { CardBasket } from './components/view/card/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/form/OrderForm';
import { ContactsForm } from './components/view/form/ContactsForm';
import { Success } from './components/view/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { AppEvents } from './types';
import type { IProduct, IOrder, ICustomer } from './types';

document.querySelectorAll('.modal').forEach((m) => {
	if (m.id !== 'modal-container') m.remove();
});

// Инициализация
const events = new EventEmitter();
const api = new LarekApi(API_URL, {});
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

// Отображения
const modal = new Modal(
	document.querySelector('#modal-container') as HTMLElement,
	events
);

const header = new Header(
	document.querySelector('.header') as HTMLElement,
	events
);

const gallery = new Gallery(
	document.querySelector('.gallery') as HTMLElement,
	(item: IProduct): HTMLElement => {
		const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'));
		const el = card.render({
			...item,
			image: `${CDN_URL}${item.image}`,
		});
		el.addEventListener('click', () => {
			events.emit(AppEvents.ProductSelect, { id: item.id });
		});
		return el;
	}
);

const basket = new Basket(
	cloneTemplate<HTMLElement>('#basket'),
	events,
	(item: IProduct, index: number): HTMLElement => {
		const card = new CardBasket(
			cloneTemplate<HTMLElement>('#card-basket'),
			() => {
				events.emit(AppEvents.BasketItemRemove, { id: item.id });
			}
		);
		return card.render({
			...item,
			image: `${CDN_URL}${item.image}`,
			index,
		} as IProduct & { index: number });
	}
);

// ссылки на активные формы
let activeOrderForm: OrderForm | null = null;
let activeContactsForm: ContactsForm | null = null;

// Каталог
events.on(AppEvents.ProductsLoaded, (data: { items: IProduct[] }) => {
	gallery.setItems(data.items);
});

events.on(AppEvents.ProductSelect, (data: { id: string }) => {
	const product = productsModel.getProductById(data.id) ?? null;
	productsModel.setPreview(product);
});

events.on(
	AppEvents.PreviewChanged,
	(data: { preview: IProduct | null }) => {
		const product = data.preview;
		if (!product) return;

		const card = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'));
		card.onClick = () => {
			if (cartModel.has(product.id)) {
				cartModel.remove(product.id);
				card.inCart = false;
			} else {
				cartModel.add(product);
				card.inCart = true;
			}
		};

		card.render({
			...product,
			image: `${CDN_URL}${product.image}`,
		});
		card.inCart = cartModel.has(product.id);
		card.disabled = product.price === null;

		modal.content = card.render();
		modal.open();
	}
);

// Корзина
events.on(AppEvents.CartChanged, () => {
	header.counter = cartModel.getCount();
});

events.on(AppEvents.BasketOpen, () => {
	basket.setItems(cartModel.getItems(), cartModel.getTotal());
	modal.content = basket.render();
	modal.open();
});

events.on(AppEvents.BasketItemRemove, (data: { id: string }) => {
	cartModel.remove(data.id);
	basket.setItems(cartModel.getItems(), cartModel.getTotal());
	if (cartModel.getCount() === 0) {
		modal.close();
	}
});

// Оформление заказа
events.on(AppEvents.OrderOpen, () => {
	orderModel.clear();
	activeOrderForm = new OrderForm(
		cloneTemplate<HTMLFormElement>('#order'),
		events
	);
	activeOrderForm.setPayment(null);
	activeOrderForm.setErrors([]);
	activeOrderForm.valid = false;
	activeContactsForm = null;

	modal.content = activeOrderForm.render();
	modal.open();
});

events.on(AppEvents.OrderChanged, (data: Partial<ICustomer>) => {
	orderModel.setFields(data);
	const errors = orderModel.validate();

	if (activeOrderForm) {
		activeOrderForm.valid = !errors.payment && !errors.address;
		activeOrderForm.setErrors(
			[errors.payment, errors.address].filter(Boolean) as string[]
		);
	}

	if (activeContactsForm) {
		activeContactsForm.valid = !errors.email && !errors.phone;
		activeContactsForm.setErrors(
			[errors.email, errors.phone].filter(Boolean) as string[]
		);
	}
});

events.on(AppEvents.OrderSubmit, () => {
	activeContactsForm = new ContactsForm(
		cloneTemplate<HTMLFormElement>('#contacts'),
		events
	);
	activeContactsForm.setErrors([]);
	activeContactsForm.valid = false;
	activeOrderForm = null;

	modal.content = activeContactsForm.render();
	modal.open();
});

events.on(AppEvents.ContactsSubmit, async () => {
	try {
		const data = orderModel.getData() as ICustomer;
		const order: IOrder = {
			payment: data.payment,
			address: data.address,
			email: data.email,
			phone: data.phone,
			total: cartModel.getTotal(),
			items: cartModel.getItems().map((p) => p.id),
		};

		const result = await api.createOrder(order);

		cartModel.clear();
		orderModel.clear();
		activeOrderForm = null;
		activeContactsForm = null;

		const success = new Success(
			cloneTemplate<HTMLElement>('#success'),
			events
		);
		success.total = result.total;
		modal.content = success.render();
		modal.open();
	} catch (err) {
		console.error('Ошибка оформления заказа:', err);
	}
});

// Загрузка каталога
api
	.getProducts()
	.then((res) => productsModel.setProducts(res.items))
	.catch((err) => console.error('Ошибка загрузки каталога:', err));

void Api;