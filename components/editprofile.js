import * as React from 'react';
import StockProfilePic from '../assets/stockProfilePicture.jpg';
import '../styles/editprofile.css';
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme();
axios.defaults.withCredentials = true;

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


export default function Edit() {
    

    const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		axios
			.post("https://api.60seconds.io/api/update_user_info", {
                first_name: data.get("firstName"),
				last_name: data.get("lastName"),
				school: data.get("school"),
				occupation: data.get("occupation"),
				description: data.get("description")
			})
			.then(function (response) {
				console.log(response);
				alert(
					"User profile successfully changed"
				);
				window.location.href = "/#/Profile"
			})
			.catch(function (error) {
				console.log(error);
				alert(error);
			});
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
						Edit Profile
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
								required
									autoComplete="given-name"
									name="firstName"
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
								required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="school"
									label="School"
									name="school"
									autoComplete="school"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="occupation"
									label="Occupation"
									type="occupation"
									id="occupation"
									autoComplete="occupation"
								/>
							</Grid>
							<Grid item xs={15}>
								<TextField
									required
									fullWidth
									name="description"
									label="description"
									type="description"
									id="description"
									autoComplete="Description"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Edit
						</Button>
					</Box>
				</Box>
                <Copyright sx={{ mt: 5 }} />
                </Container>
		</ThemeProvider>

    );
}