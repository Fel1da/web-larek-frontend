export abstract class Component<T = object> {
	protected readonly container: HTMLElement;

	constructor(container: HTMLElement) {
		this.container = container;
	}

	protected setText(
		el: HTMLElement,
		value: string | number | null | undefined
	): void {
		el.textContent = value === null || value === undefined ? '' : String(value);
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) Object.assign(this, data);
		return this.container;
	}
}