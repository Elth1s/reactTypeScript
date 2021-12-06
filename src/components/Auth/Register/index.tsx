import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { IRegisterModel, RegisterServerError } from "./types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage = () => {

    const { RegisterUser } = useActions();
    const navigate = useNavigate();

    const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/
    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().matches(passwordRegExp, 'Password is not valid').required('Password is required'),
        password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
    });
    const initialValues: IRegisterModel = { name: '', email: '', password: '', password_confirmation: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: RegisterSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await RegisterUser(values);
                navigate("/");
                toast.success('Register Success!');
            }
            catch (exeption) {
                const serverErrors = exeption as RegisterServerError;
                Object.entries(serverErrors).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        let message = "";
                        value.forEach((item) => {
                            message += `${item} `;
                        });
                        setFieldError(key, message);
                    }
                });
                let message = "Register Failed! ";
                if (serverErrors.status === 422)
                    message += "Validation failed.";
                toast.error(message);
            }

        }
    });
    const { errors, touched, handleSubmit } = formik;
    return (
        <div>
            <h1 className="my-3">Register</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
                    <InputGroup
                        label="Name"
                        field="name"
                        touched={touched.name}
                        error={errors.name}
                    />
                    <InputGroup
                        label="Email"
                        field="email"
                        touched={touched.email}
                        error={errors.email}
                    />
                    <InputGroup
                        label="Password"
                        field="password"
                        type="password"
                        touched={touched.password}
                        error={errors.password}
                    />
                    <InputGroup
                        label="Confirm Password"
                        field="password_confirmation"
                        type="password"
                        touched={touched.password_confirmation}
                        error={errors.password_confirmation}
                    />
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </Form>
            </FormikProvider>
        </div >

    );
}

export default RegisterPage;