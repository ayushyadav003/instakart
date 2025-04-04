import Router from "./router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import "./index.scss";
// import ConfirmationPop from './components/confirmation/ConfirmationPop'
function App() {
  // const [openVerify, setOpenVerify] = useState(false)
  const dispatch = useDispatch();
  const { isLoading, verifyPopUp } = useSelector(
    ({ currentUser }) => currentUser
  );

  return (
    <>
      <Router />
      {/* <ToastContainer /> */}
      <Backdrop sx={{ color: "#fff", zIndex: "9999" }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toaster />
    </>
  );
}

export default App;
