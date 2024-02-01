import { makeStyles } from '@material-ui/core';
import { alpha } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  appBar: {
    marginBottom: theme.spacing(3),
    height: '50%',
    width: '100%',
    backgroundColor: theme.palette.primary.main
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: theme.spacing(3, 1, 4, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  },
  notificationsIcon: {
    color: theme.palette.secondary.main
  },
  grow: {
    flexGrow: 1
  },
  greeting: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  card: {
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.grey[100]
  },
  cardContent: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
    },
    color: '#fff',
    fontWeight: 'bold'
  },
  dashboardContainer: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 'calc(100% - ' + theme.spacing(2) + 'px)',
    margin: 'auto'
  },
  dashboardButton: {
    margin: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto'
    }
  },
  dashboardCard: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  accountsCard: {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    padding: theme.spacing(2)
  },
  accountsTitle: {
    marginBottom: theme.spacing(2),
    color: '#1976D2'
  },
  accountCard: {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    cursor: 'pointer',
    padding: theme.spacing(2),
    margin: theme.spacing(2, 0)
  },
  accountName: {
    fontWeight: 'bold'
  },
  summaryCard: {
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    padding: theme.spacing(2)
  },
  summaryTitle: {
    marginBottom: theme.spacing(2),
    color: '#1976D2'
  },
  summaryDetail: {
    marginBottom: theme.spacing(1)
  },
  transactionCard: {
    marginBottom: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 14px 28px rgba(0,0,0,0.25), 0px 10px 10px rgba(0,0,0,0.22)',
    borderRadius: '15px',
    padding: theme.spacing(2)
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh'
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  },
  selectedTableRow: {
    backgroundColor: theme.palette.success.main,
  },
  createButton: {
    marginTop: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
  }
}));
