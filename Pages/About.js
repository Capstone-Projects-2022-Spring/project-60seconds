import { View } from 'react-native';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link"
import aaronPhoto from '../assets/aaron.png'
import styles from '../App.style';

export default function About() {
  return (
    <View style={styles.container}>
      <div className="App">
		  <Container component="main" maxWidth="md">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
            marginBottom: 3,
						display: "flex",
						flexDirection: "column",
						alignItems: "left",
					}}
				>
          <Typography>
            60 Seconds is a web-based applicaiton for recording short audio segments to serve as a daily journal. 
            The application is being developed by Aaron Scofield, Xu Lyu, Zack Waxler, Ryan Hardison, and Zach Preston 
            for CIS4398 at Temple University. The application is open-source, and the public repository can be found <Link href="https://github.com/Capstone-Projects-2022-Spring/project-60seconds">here.</Link>
          </Typography>
        </Box>
        <Box
          sx={{
            marginBottom: 3,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              marginBottom: 3,
              marginRight: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
				  >
            <img src={aaronPhoto} alt="Aaron Scofield" height={200} width={200} padding={50}/>
            <Typography>Aaron Scofield</Typography>
            <Typography>scofield@temple.edu</Typography>
            <Typography><Link href="https://github.com/aaronscofield">GitHub</Link></Typography>
          </Box>
        </Box>
      </Container>
      </div>
    </View>
  );
}