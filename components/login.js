import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import GoogleLogin from "react-google-login";
import Register from "./register";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const clientId =
	"889429585915-hma88iu6bd4tk7qfmtj79b94nf6r9gp5.apps.googleusercontent.com";

function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				60 Seconds
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function Login() {
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			username: data.get("username"),
			password: data.get("password"),
		});

		axios
			.post("http://54.226.36.70/api/login", {
				username: data.get("username"),
				password: data.get("password"),
			})
			.then(function (response) {
				console.log(response);
				alert(
					"User: " + data.get("username") + " successfully logged in"
				);
				navigate("/Profile", {
					state: { username: data.get("username") },
				});
			})
			.catch(function (error) {
				console.log(error);
				alert("Error: " + error);
			});
	};

	const onSuccess = (res) => {
		console.log("[Login in Success] currentUser: ", res.profileObj);
		// refreshTokenSetup(res);
	};
	const onFailure = (res) => {
		console.log("[Login failed] res: ", res);
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Typography component="h1" variant="h4">
						Login
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="username"
							label="Username"
							name="username"
							autoComplete="username"
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
						<FormControlLabel
							control={
								<Checkbox value="remember" color="primary" />
							}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Login
						</Button>
					</Box>
					<hr style={{ color: "black", width: 300 }} />
					<h4> Don't have an account?</h4>
					<Link underline="none" href="/Register">
						<Button
							variant="outlined"
							style={{ width: 180, height: 40 }}
						>
							Register Here
						</Button>
					</Link>
					<h5>OR</h5>
					<GoogleLogin
						clientId={clientId}
						onSuccess={onSuccess}
						onFailure={onFailure}
						buttonText="Login With Google"
					/>
				</Box>
				<Copyright sx={{ mt: 8, mb: 4 }} />
			</Container>
		</ThemeProvider>
	);
}
