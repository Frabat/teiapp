// @ts-ignore
import  AppIcon from "../assets/icon.svg?react"
import { Box, IconButton } from "@mui/material";

export default function Icon1() {
  return (
    <Box>
        <IconButton aria-label="Euripides Rewritten" sx={{ width: 128, height: 128 }}>
            <AppIcon />    
        </IconButton>
    </Box>
  );
}
