import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from './providers/auth';
import { Editor } from './pages/Editor';
import { Labs } from './pages/Labs';

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
	},
	shape: {
		borderRadius: 0
	}
});
	
function App() {
	return (
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/labs/:labId/solution" element={<Editor />} />
						<Route path="/labs" element={<Labs />} />
					</Routes>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
