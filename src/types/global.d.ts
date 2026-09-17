declare module '*.scss' {
	const content: Record<string, string>;
	export default content;
}

declare module '*.sass' {
	const content: Record<string, string>;
	export default content;
}

declare module '*.css' {
	const content: Record<string, string>;
	export default content;
}

declare module '*.png' {
	const src: string;
	export default src;
}

declare module '*.jpg' {
	const src: string;
	export default src;
}

declare module '*.jpeg' {
	const src: string;
	export default src;
}

declare module '*.gif' {
	const src: string;
	export default src;
}

declare module '*.svg' {
	const src: string;
	export default src;
}

declare module '*.woff' {
	const src: string;
	export default src;
}

declare module '*.woff2' {
	const src: string;
	export default src;
}

declare module '*.ttf' {
	const src: string;
	export default src;
}

declare namespace NodeJS {
	interface ProcessEnv {
		/** Адрес API-сервера, подставляется Webpack'ом из .env */
		API_ORIGIN: string;
		/** Флаг production-сборки */
		NODE_ENV?: 'development' | 'production';
	}
}

declare const process: {
	env: NodeJS.ProcessEnv;
};