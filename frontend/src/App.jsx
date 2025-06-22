import './App.css'
import TableComponent from './TableComponent.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: { mode: 'light' }, // or 'dark'
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <TableComponent></TableComponent>
    </ThemeProvider>
  )
}

export default App
