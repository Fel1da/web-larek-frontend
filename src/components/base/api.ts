import type { IApi, IApiError } from '../../types'; 

export class Api implements IApi {
	constructor(
		protected baseUrl: string,
		protected options: RequestInit = {}
	) {}

	protected async request<T>(
		uri: string,
		options: RequestInit
	): Promise<T> {
		const response = await fetch(this.baseUrl + uri, {
			...this.options,
			...options,
			headers: {
				'Content-Type': 'application/json',
				...this.options.headers,
				...options.headers,
			},
		});

		if (!response.ok) {
			const error: IApiError = await response
				.json()
				.catch(() => ({ error: `HTTP ${response.status}` }));
			throw new Error(error.error);
		}

		return (await response.json()) as T;
	}

	get<T>(uri: string): Promise<T> {
		return this.request<T>(uri, { method: 'GET' });
	}

	post<T>(uri: string, data: object, method = 'POST'): Promise<T> {
		return this.request<T>(uri, {
			method,
			body: JSON.stringify(data),
		});
	}
}