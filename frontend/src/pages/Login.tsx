import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Copyright } from '../components/Copyright';
import { useMutation } from 'react-query';
import { CircularProgress } from '@mui/material';
import { AuthCallback } from '../providers/auth';
import axios from 'axios';
import { config } from '../config';
import { User } from '../models/user';

export const LogInSide = ({ callback }: { callback: AuthCallback }) => {
	const mutation = useMutation<{ data: { jwt: string, user: User } }, { message: string }, { email: string; password: string }>(
		({ email, password }) => axios.post('/auth/local', { identifier: email, password }, { baseURL: config.API_URL })
	);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		mutation.mutate({ email: data.get('email') as string, password: data.get('password') as string });
	};

	React.useEffect(() => {
		if (mutation.isSuccess && mutation.data) {
			callback(mutation.data.data.jwt, mutation.data.data.user);
		}
	}, [mutation.data, mutation.isSuccess]);

	return (
		<Grid container component="main" sx={{ height: '100vh' }}>
			<CssBaseline />
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage:
            'url(https://www.chnu.edu.ua/media/mytl0lvp/art_2314.jpg?format=webp&quality=80&v=1d96c0b26183120)',
					backgroundRepeat: 'no-repeat',
					backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
					backgroundSize: 'cover',
					backgroundPosition: 'center'
				}}
			/>
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<Grid container>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center'
						}}
					>
						<Grid item>
							<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
								<LockOutlinedIcon />
							</Avatar>
						</Grid>
						<Grid item>
							<Typography component="h1" variant="h5">
                Sign in
							</Typography>
						</Grid>
						<Grid item>
							<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									autoFocus
								/>
								<TextField
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
								/>
								<Grid container>
									<Box>
										{mutation.isError ? <Typography color="error">Error: {mutation.error?.message}</Typography> : null}
									</Box>
								</Grid>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									style={{ height: 50, fontSize: 15 }}
								>
									{mutation.isLoading ? <CircularProgress color="secondary" /> : 'Sign In'}
								</Button>
								<Grid container justifyContent="space-between">
									<Grid item>
										<Link href="#" variant="body2">
                      Forgot password?
										</Link>
									</Grid>
									<Grid item>
										<Link href="#" variant="body2">
											{'Don\'t have an account? Contact your teacher.'}
										</Link>
									</Grid>
								</Grid>
								<Copyright />
							</Box>
						</Grid>
					</Box>
				</Grid>
			</Grid>
		</Grid>
	);
};
