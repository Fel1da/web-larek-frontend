import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
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

// Модели хранят состояние; события представлений обрабатываются здесь.
const events = new EventEmitter();
const api = new LarekApi(API_URL, {});
const productsModel = new ProductsModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);
const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const preview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), () => {
	events.emit(AppEvents.PreviewToggle, {});
});
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate<HTMLElement>('#success'), events);

function renderBasket(): void {
	basket.items = cartModel.getItems().map((item, index) => {
		const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), () => {
			events.emit(AppEvents.BasketItemRemove, { id: item.id });
		});
		return card.render({ title: item.title, price: item.price, index: index + 1 });
	});
	basket.total = cartModel.getTotal();
}

function renderPreview(): void {
	const product = productsModel.getPreview();
	if (!product) return;
	preview.render({ title: product.title, price: product.price, image: `${CDN_URL}${product.image}`, category: product.category, description: product.description });
	preview.inCart = cartModel.has(product.id);
	preview.disabled = product.price === null;
}

function renderOrder(): void {
	const data = orderModel.getData();
	const errors = orderModel.validate();
	orderForm.setPayment(data.payment);
	orderForm.address = data.address;
	orderForm.valid = !errors.payment && !errors.address;
	orderForm.setErrors([errors.payment, errors.address].filter((error): error is string => Boolean(error)));
	contactsForm.email = data.email;
	contactsForm.phone = data.phone;
	contactsForm.valid = !errors.email && !errors.phone;
	contactsForm.setErrors([errors.email, errors.phone].filter((error): error is string => Boolean(error)));
}

// Каталог: представление получает подготовленные карточки после события модели.
events.on(AppEvents.ProductsLoaded, () => {
	gallery.items = productsModel.getProducts().map((item: IProduct) => {
		const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), () => {
			events.emit(AppEvents.ProductSelect, { id: item.id });
		});
		return card.render({ title: item.title, price: item.price, image: `${CDN_URL}${item.image}`, category: item.category });
	});
});

events.on(AppEvents.ProductSelect, ({ id }: { id: string }) => {
	const product = productsModel.getProductById(id);
	if (product) productsModel.setPreview(product);
});

events.on(AppEvents.PreviewChanged, () => {
	if (!productsModel.getPreview()) return;
	renderPreview();
	modal.content = preview.render();
	modal.open();
});

events.on(AppEvents.PreviewToggle, () => {
	const product = productsModel.getPreview();
	if (!product || product.price === null) return;
	if (cartModel.has(product.id)) cartModel.remove(product.id);
	else cartModel.add(product);
});

// Изменения корзины перерисовывают её независимо от открытого окна.
events.on(AppEvents.CartChanged, () => {
	header.counter = cartModel.getCount();
	renderBasket();
	renderPreview();
});

events.on(AppEvents.BasketOpen, () => {
	modal.content = basket.render();
	modal.open();
});

events.on(AppEvents.BasketItemRemove, ({ id }: { id: string }) => {
	cartModel.remove(id);
});

// Формы всегда получают актуальные значения из модели.
events.on(AppEvents.OrderOpen, () => {
	renderOrder();
	modal.content = orderForm.render();
	modal.open();
});

events.on(AppEvents.OrderChanged, (data: Partial<ICustomer>) => {
	orderModel.setFields(data);
});

events.on(AppEvents.OrderValidationChanged, () => {
	renderOrder();
});

events.on(AppEvents.OrderSubmit, () => {
	const errors = orderModel.validate();
	if (errors.payment || errors.address) return;
	modal.content = contactsForm.render();
	modal.open();
});

events.on(AppEvents.ContactsSubmit, async () => {
	if (Object.keys(orderModel.validate()).length !== 0 || cartModel.getCount() === 0) return;
	const data = orderModel.getData();
	if (!data.payment) return;
	const order: IOrder = {
		payment: data.payment,
		address: data.address,
		email: data.email,
		phone: data.phone,
		total: cartModel.getTotal(),
		items: cartModel.getItems().map((product) => product.id),
	};
	try {
		const result = await api.createOrder(order);
		cartModel.clear();
		orderModel.clear();
		success.total = result.total;
		modal.content = success.render();
		modal.open();
	} catch (error) {
		console.error('Ошибка оформления заказа:', error);
	}
});

events.on(AppEvents.SuccessClose, () => modal.close());

renderBasket();
renderOrder();
api.getProducts()
	.then((response) => productsModel.setProducts(response.items))
	.catch((error) => console.error('Ошибка загрузки каталога:', error));
