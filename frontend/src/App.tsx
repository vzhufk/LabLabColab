import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { LogInSide } from './pages/Login';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from './context/auth';
import { ChangePassword } from './pages/ChangePassword';

const queryClient = new QueryClient();

export const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#eeff41'
		},
		secondary: {
			main: '#e040fb'
		}
	}
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes>
						<Route path="/" element={<LogInSide />} />
						<Route path="/password" element={<ChangePassword />} />
						<Route path="/dashboard" element={<Dashboard />} />
					</Routes>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
