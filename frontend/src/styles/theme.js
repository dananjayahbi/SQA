import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4880FF',
      light: '#5C8CFF',
      dark: '#3D76F5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F93C65',
      light: '#FA5E7D',
      dark: '#E12F54',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF3826',
    },
    background: {
      default: '#F5F6FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202224',
      secondary: '#565656',
      disabled: 'rgba(0, 0, 0, 0.5)',
    },
    divider: '#D5D5D5',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: 1.364,
      letterSpacing: '-0.35%',
    },
    h2: {
      fontWeight: 700,
      fontSize: '24px',
      lineHeight: 1.364,
    },
    h3: {
      fontWeight: 700, 
      fontSize: '20px',
      lineHeight: 1.364,
    },
    body1: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: 1.364,
    },
    body2: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: 1.364,
    },
    button: {
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: 1.364,
      letterSpacing: '2.14%',
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #D5D5D5',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: '8px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '14px',
        },
        body: {
          fontSize: '14px',
        },
      },
    },
  },
});

export default theme; 