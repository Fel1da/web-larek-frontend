import { Component } from '../base/Component';

/** Выводит готовые карточки каталога. */
export class Gallery extends Component {
	set items(cards: HTMLElement[]) {
		this.container.replaceChildren(...cards);
	}
}
