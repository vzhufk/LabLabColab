import { Axios } from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { LogInSide } from '../pages/Login';
import { config } from '../config';
import { User } from '../models/user';

export type AuthCallback = (token: string, user: User) => void;

export type AuthorizerContextProps = {
  client: Axios;
  user: User;
  token: string;
};
// Create a new context for the authorization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AuthContext = createContext<AuthorizerContextProps>({} as any);

// Create the AuthProvider component
const AuthProvider = ({ children }: { children: React.ReactNode}) => {
	const predefinedUser = localStorage.getItem('user');
	const [token, setToken] = useState<string>('');
	const [user, setUser] = useState<User>(predefinedUser ? JSON.parse(predefinedUser) : {});
	const [axios] = useState<Axios>(new Axios({ baseURL: config.API_URL }));

	useEffect(() => {
		const localToken = localStorage.getItem('token');

		if (localToken) {
			setToken(localToken);
		}
	});

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(user));
		}
	}, [token, user]);
	const callback = (token: string, user: User) => { setToken(token); setUser(user); };

	if (!token) {
		return <LogInSide callback={callback}></LogInSide>;
	}

	axios.interceptors.request.use((config) => {
		config.headers.Authorization = token ? `Bearer ${token}` : '';
		return config;
	});
	axios.interceptors.response.use((response) => {
		response.data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
		if ([402].includes(response.status)) {
			setToken('');
		}
		return response;
	});

	return <AuthContext.Provider value={{ token, client: axios, user }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
