import { Component } from '../../base/Component';
import type { EventEmitter } from '../../base/events';

export abstract class Form<T extends object = object> extends Component<T> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, protected events: EventEmitter) {
		super(container);
		this._submit = container.querySelector(
			'button[type="submit"]'
		) as HTMLButtonElement;
		this._errors = container.querySelector('.form__errors') as HTMLElement;

		container.addEventListener('submit', (e) => {
			e.preventDefault();
			this.onSubmit();
		});

		container.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			if (target.name) this.onInput(target.name, target.value);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	setErrors(errors: string[]): void {
		this.setText(this._errors, errors.join('; '));
	}

	protected abstract onInput(name: string, value: string): void;
	protected abstract onSubmit(): void;
}