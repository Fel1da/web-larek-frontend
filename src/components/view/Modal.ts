import { Component } from '../base/Component';
import type { EventEmitter } from '../base/events';
import { AppEvents } from '../../types';

export class Modal extends Component {
	protected _content: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._content = container.querySelector('.modal__content') as HTMLElement;
		this._close = container.querySelector('.modal__close') as HTMLButtonElement;

		this._close.addEventListener('click', () => this.close());
		container.addEventListener('click', (e) => {
			if (e.target === container) this.close();
		});
	}

	set content(node: HTMLElement) {
		this._content.replaceChildren(node);
	}

	open(): void {
		this.container.classList.add('modal_active');
		document.documentElement.classList.add('page_locked');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		document.documentElement.classList.remove('page_locked');
		this._content.replaceChildren();
		this.events.emit(AppEvents.ModalClose, {});
	}
}