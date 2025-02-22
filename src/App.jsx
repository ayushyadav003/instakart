import Router from './router'
import { ToastContainer } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
// import ConfirmationPop from './components/confirmation/ConfirmationPop'
import { closeVerifyPopup } from './redux/features/userSlice'

function App() {
  // const [openVerify, setOpenVerify] = useState(false)
  const dispatch = useDispatch()
  const { isLoading, verifyPopUp } = useSelector(
    ({ currentUser }) => currentUser,
  )

  return (
    <>
      <Router />
      <ToastContainer />
      <Backdrop sx={{ color: '#fff', zIndex: '9999' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default App
