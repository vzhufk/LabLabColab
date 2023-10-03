import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Copyright } from '../components/Copyright';
import { AuthContext } from '../context/auth';
import { useMutation } from 'react-query';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ChangePassword = () => {
	const navigate = useNavigate();
	const authContext = React.useContext(AuthContext);
	const mutation = useMutation<void, { message: string }, { password: string }>(({ password }) =>
		authContext.changePassword(localStorage.getItem('password') || '', password)
	);
	const [password, setPassword] = React.useState('');
	const [passwordRepeat, setPasswordRepeat] = React.useState('');

	const handleSubmit = async () => {
		mutation.mutate({ password });
		localStorage.removeItem('password');
	};

	React.useEffect(() => {
		if (mutation.isSuccess) {
			authContext.signInWithEmail(localStorage.getItem('email') || '', password).then(() => {
				navigate('dashboard');
			});
		}
	}, [mutation.isSuccess]);

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
				<Box
					sx={{
						my: 8,
						mx: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
            New password
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="passwordRepeat"
							label="Repeat password"
							type="password"
							id="passwordRepeat"
							autoComplete="current-password"
							onChange={(e) => setPasswordRepeat(e.target.value)}
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
							disabled={password !== passwordRepeat || !password || !passwordRepeat}
						>
							{mutation.isLoading ? <CircularProgress /> : 'Change Password'}
						</Button>
						<Copyright />
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
};
