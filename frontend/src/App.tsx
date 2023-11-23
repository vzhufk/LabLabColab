import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import AuthProvider from './providers/auth';
import { Editor } from './pages/Editor';

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
						<Route path="/solution/:solutionId" element={<Editor />} />
					</Routes>
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
