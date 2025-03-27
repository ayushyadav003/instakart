import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, InputAdornment, TextField } from '@mui/material'
import * as Yup from 'yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import './login.scss'
import { apiConfig } from '../../services/ApiConfig'
import { useFormik } from 'formik'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../redux/features/userSlice'
import toast from 'react-hot-toast'

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [reCapVal, setReCapVal] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const validateSchema = Yup.object().shape({
    fullName: Yup.string()
      .required('This field is required')
      .matches(/^[a-zA-Z ]+$/, 'Only alphabetic characters are allowed'),
    businessName: Yup.string()
      .required('This field is required')
      .matches(/^[a-zA-Z ]+$/, 'Only alphabetic characters are allowed'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('This field is required'),
      mobile: Yup.string()
      .required('This field is required')
      .matches(/^\d+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number cannot be less than 10 digits')
      .max(10, 'Phone number cannot be more than 10 digits'),
    password: Yup.string()
      .required('This field is required')
      .min(5, 'Pasword must be 5 or more characters')
      .matches(/\d/, 'Password should contain at least one number'),
    confirmPassword: Yup.string()
      .required('This field is required')
      .oneOf([Yup.ref('password')], 'The passwords do not match'),
  })
  const formik = useFormik({
    initialValues: {
      email: '',
      mobile: null,
      password: '',
      confirmPassword: '',
      fullName: '',
      businessName: '',
      roles: ['admin'],
    },
    validationSchema: validateSchema,
    onSubmit: async (values) => {
      console.log('val....', values)
      handleSubmitForm(values)
    },
  })

  const handleSubmitForm = async (values) => {
    try {
      dispatch(startLoading())
      let updatedValues = { ...values }
      delete updatedValues.confirmPassword

      const apiOptions = {
        url: apiConfig.signup,
        method: 'POST',
        data: updatedValues,
        // params: { refKey: localStorage.getItem('refKey') == 1 ? true : false },
      }

      const response = await axios(apiOptions)
      if (response?.status === 201) {
        toast.success(response?.message || 'User created Successfully')
        navigate('/')
      } else {
        toast.error(response?.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong')
    } finally {
      dispatch(stopLoading())
    }
  }

  return (
    <div className="loginForm">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <h2>Signup with InstaKart!</h2>
        <div className="inner">
          <TextField
            placeholder="Full Name"
            fullWidth
            margin="normal"
            name="fullName"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.fullName && formik.errors.fullName)}
            helperText={formik.touched.fullName ? formik.errors.fullName : ''}
          />

          <TextField
            placeholder="Business Name"
            fullWidth
            margin="normal"
            name="businessName"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.businessName}
            error={Boolean(
              formik.touched.businessName && formik.errors.businessName,
            )}
            helperText={
              formik.touched.businessName ? formik.errors.businessName : ''
            }
          />
        </div>
        <div className="inner">
          <TextField
            placeholder="Mobile"
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            name="mobile"
            type={'number'}
            onInput={(e) => {
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 10)
            }}
            onChange={formik.handleChange}
            value={formik.values.mobile}
            error={Boolean(
              formik.touched.mobile && formik.errors.mobile,
            )}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.mobile ? formik.errors.mobile : ''
            }
          />
          <TextField
            placeholder="Email"
            fullWidth
            margin="normal"
            name="email"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={formik.touched.email ? formik.errors.email : ''}
          />
        </div>
        <div className="inner">
          <TextField
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            name="password"
            margin="normal"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={formik.touched.password ? formik.errors.password : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </span>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            name="confirmPassword"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#cde2e7',
                },
              },
            }}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            error={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword,
            )}
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={togglePasswordVisibility}
                  >
                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                  </span>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {/* <div>
          <Checkbox defaultChecked />
        </div> */}
        {/* <ReCAPTCHA
          sitekey="6LdPgK8qAAAAAGrfcqCBochAu_zGbR-vT3theN7Y"
          onChange={(val) => setReCapVal(val)}
        /> */}

        <div className="remember" style={{ margin: '1rem 0 0 0' }}>
          <Button
            variant="contained"
            // disabled={!reCapVal}
            type="submit"
            className="loginBtn"
          >
            Submit
          </Button>
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
