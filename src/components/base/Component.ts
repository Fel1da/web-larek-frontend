export abstract class Component<T = object> {
	protected readonly container: HTMLElement;

	protected constructor(container: HTMLElement) {
		this.container = container;
	}

	protected setText(
		el: HTMLElement,
		value: string | number | null | undefined
	): void {
		el.textContent = value === null || value === undefined ? '' : String(value);
	}

	protected setImage(el: HTMLImageElement, src: string, alt = ''): void {
		el.src = src;
		el.alt = alt;
	}

	protected toggleClass(
		el: HTMLElement,
		className: string,
		force?: boolean
	): void {
		el.classList.toggle(className, force);
	}

	protected setDisabled(
		el: HTMLButtonElement | HTMLInputElement,
		value: boolean
	): void {
		el.disabled = value;
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) Object.assign(this, data);
		return this.container;
	}
}