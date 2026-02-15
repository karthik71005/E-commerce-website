import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { register, reset } from '../features/auth/authSlice'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const RegisterPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    )

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || user) {
            navigate('/')
        }

        dispatch(reset())
    }, [user, isError, isSuccess, message, navigate, dispatch])

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Required'),
        }),
        onSubmit: (values) => {
            const { name, email, password } = values
            dispatch(register({ name, email, password }))
        },
    })

    if (isLoading) {
        return <div className="text-center mt-20">Loading...</div>
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
            <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                            }`}
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.name}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                            }`}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.email}</p>
                    ) : null}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                            }`}
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.password}</p>
                    ) : null}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''
                            }`}
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        {...formik.getFieldProps('confirmPassword')}
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                        <p className="text-red-500 text-xs italic">{formik.errors.confirmPassword}</p>
                    ) : null}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Register
                    </button>
                    <Link
                        className="inline-block align-baseline font-bold text-sm text-primary hover:text-blue-800"
                        to="/login"
                    >
                        Already have an account?
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage
