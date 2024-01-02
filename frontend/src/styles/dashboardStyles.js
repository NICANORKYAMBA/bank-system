import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    marginBottom: theme.spacing(3),
    height: '50%',
    width: '100%',
    backgroundColor: theme.palette.primary.main
  },
  title: {
    fontWeight: 600,
    fontSize: '1.5rem'
  },
  drawer: {
    width: 240,
    flexShrink: 0
  },
  drawerPaper: {
    width: 240,
    backgroundColor: theme.palette.grey[200]
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    }
  },
  dashboardContainer: {
    marginTop: theme.spacing(3)
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
  }
}));
