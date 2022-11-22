import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import axios, { AxiosRequestConfig } from 'axios';

import { NEXT_PUBLIC_BACKEND_URL } from './constants';

export const instance = axios.create({
	baseURL: NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

const nonNeededToken = ['/auth/login', '/auth/refresh', '/auth/registerAzure'];

export const getToken = async (context?: GetServerSidePropsContext) => {
	const session = await getSession(context);
	if (session) return `Bearer ${session?.accessToken}`;
	return 'Bearer ';
};

instance.interceptors.request.use(async (config) => {
	const { url, headers } = config;
	if (url && headers && !nonNeededToken.includes(url)) headers.Authorization = await getToken();
	return config;
});

export const serverSideInstance = axios.create({
	baseURL: NEXT_PUBLIC_BACKEND_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

type Options = {
	refreshToken?: string;
	serverSide?: boolean;
	context?: GetServerSidePropsContext;
} & AxiosRequestConfig;

const fetchData = async <T,>(url: string, options?: Options): Promise<T> => {
	const { method = 'GET', context, refreshToken, serverSide } = options ?? {};
	const instanceOptions: AxiosRequestConfig = {
		url,
		method,
		...options
	};

	if (context || refreshToken) {
		instanceOptions.headers = {
			...options?.headers,
			Authorization: refreshToken ? `Bearer ${refreshToken}` : await getToken(context)
		};
	}
	try {
		const { data } = !serverSide
			? await instance(instanceOptions)
			: await serverSideInstance(instanceOptions);

		return data;
	} catch {
		return null as any;
	}
};

export default fetchData;
