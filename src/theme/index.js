import { CssBaseline } from "@mui/material";
import {
  alpha,
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import customizeComponents from "./customizations";

const PRIMARY = {
  lighter: "#1f3c34", 
  light: "#0d3e31",   
  main: "#0a5b46",    
  dark: "#08473d",    
  darker: "#062e2a",
  lightest: alpha("#0a5b46", 0.05), 
  contrastText: "#FFF", 
};

const SECONDARY = {
  lighter: "#FFB74D", 
  light: "#FFA726",    
  main: "#FF9800",     
  dark: "#F57C00",     
  darker: "#EF6C00",   
  contrastText: "#FFF", 
};

const SUCCESS = {
  lighter: "#C8E6C9", 
  light: "#A5D6A7",  
  main: "#4CAF50",    
  dark: "#388E3C",    
  darker: "#2E7D32",  
  contrastText: "#FFF", 
};

const GREY = {
  0: "#212121",      
  100: "#303030",    
  200: "#424242",    
  300: "#616161",    
  400: "#757575",    
  500: "#BDBDBD",    
  600: "#E0E0E0",    
  700: "#F5F5F5",    
  800: "#FFFFFF",    
  900: "#F5F5F5",    
  500_8: alpha("#BDBDBD", 0.08),
  500_12: alpha("#BDBDBD", 0.12),
  500_16: alpha("#BDBDBD", 0.16),
  500_24: alpha("#BDBDBD", 0.24),
  500_32: alpha("#BDBDBD", 0.32),
  500_48: alpha("#BDBDBD", 0.48),
  500_56: alpha("#BDBDBD", 0.56),
  500_80: alpha("#BDBDBD", 0.8),
};


function ThemeProvider({ children }) {
  const themeOptions = {
    palette: {
      primary: PRIMARY,
      secondary: SECONDARY,
      success: SUCCESS,
      text: {
        primary: GREY[100],   
        secondary: GREY[200], 
        disabled: GREY[500],  
      },
            background: { paper: "#fff", default: "#fff", neutral: GREY[200] },
      action: {
        active: GREY[600],
        hover: GREY[500_8],
        selected: GREY[500_16],
        disabled: GREY[500_80],
        disabledBackground: GREY[500_24],
        focus: GREY[500_24],
        hoverOpacity: 0.08,
        disabledOpacity: 0.48,
      },
    },
    shape: { borderRadius: 8 },
  };

  const theme = createTheme(themeOptions);
  theme.components = customizeComponents(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default ThemeProvider;