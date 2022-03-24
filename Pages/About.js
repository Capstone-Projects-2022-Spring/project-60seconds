import { View } from 'react-native';
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import aaronPhoto from '../assets/aaron.png';
import ryanPhoto from '../assets/ryan.png';
import zachPhoto from '../assets/zach.jpg';
import xuPhoto from '../assets/xu.jpg'
import zackPhoto from '../assets/zack.jpg'
import styles from '../App.style';

export default function About() {
  return (
    <View style={styles.container}>
      <div className="App">
		  <Container component="main" maxWidth="lg">
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
          <Box
            sx={{
              marginBottom: 3,
              marginRight: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
				  >
            <img src={ryanPhoto} alt="Ryan Hardison" height={200} width={200} padding={50}/>
            <Typography>Ryan Hardison</Typography>
            <Typography>tuj02293@temple.edu</Typography>
            <Typography><Link href="https://github.com/rhardison455">GitHub</Link></Typography>
          </Box>
          <Box
            sx={{
              marginBottom: 3,
              marginRight: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
				  >
            <img src={zachPhoto} alt="Zach Preston" height={200} width={200} padding={50}/>
            <Typography>Zach Preston</Typography>
            <Typography>zprestoz@protonmail.com</Typography>
            <Typography><Link href="https://github.com/ZacharyWilliamPreston">GitHub</Link></Typography>
          </Box>
          <Box
            sx={{
              marginBottom: 3,
              marginRight: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
				  >
            <img src={xuPhoto} alt="Xu Lyu" height={200} width={200} padding={50}/>
            <Typography>Xu Lyu</Typography>
            <Typography>tuj85073@temple.edu</Typography>
            <Typography><Link href="https://github.com/tuj85073">GitHub</Link></Typography>
          </Box>
          <Box
            sx={{
              marginBottom: 3,
              marginRight: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
				  >
            <img src={zackPhoto} alt="Zack Waxler" height={200} width={200} padding={50}/>
            <Typography>Zack Waxler</Typography>
            <Typography>tuj00149@temple.edu</Typography>
            <Typography><Link href="https://github.com/ZackWaxler">GitHub</Link></Typography>
          </Box>
        </Box>
      </Container>
      </div>
    </View>
  );
}