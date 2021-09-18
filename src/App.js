
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'components/GlobalStyles';
import { useRoutes } from 'react-router-dom';
import theme from 'utils/theme';
import routes from "./routes";
import PerfectScrollbar from 'react-perfect-scrollbar';
import store, { SetIsLogin, SetRole, SetUserInfo } from 'store';
import { toast, ToastContainer } from 'react-toastify';
import { GetUserInfo } from 'api/user.api';
import { useSelector, shallowEqual } from 'react-redux';

const CheckPermission = (token, isLogin) => {
  if (!token) {
    return false;
  }

  if (token && !isLogin) {
    return GetUserInfo()
      .then(res => {
        if (res.meta === 200) {
          store.dispatch(SetUserInfo(res.data));
          store.dispatch(SetIsLogin(true));
          store.dispatch(SetRole(res.data.type));

          //TODO get shop info

          return true;
        }

        return false;
      })
      .catch(err => {
        console.log(err);
        toast.error(err.message);

        return false;
      });
  }

  return true;
}

const App = () => {
  const token = useSelector(state => state.token, shallowEqual);
  const isLogin = useSelector(state => state.isLogin, shallowEqual);

  const routing = useRoutes(routes(CheckPermission(token, isLogin)));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <PerfectScrollbar>
        {routing}
      </PerfectScrollbar>
    </ThemeProvider>
  );
};

export default App;
