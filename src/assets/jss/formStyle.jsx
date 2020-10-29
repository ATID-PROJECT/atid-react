import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    bootstrapRoot: {
      'label + &': {
        marginTop: 12,
      },
    },
    customLabel: {
      fontSize: 16,
      position: 'relative',
    },
    bootstrapInput: {
      borderRadius: 4,
      backgroundColor: theme.palette.common.white,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
    bootstrapFormLabel: {
      fontSize: 18,
      position: 'relative'
    },
    heading: {
      fontSize: 18,
      color: '#196c87',
      fontWeight: 'bold',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      paddingRight: 10,
    },
  }));