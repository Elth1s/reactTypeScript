import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { ILoginModel, LoginServerError } from "./types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {

    const { LoginUser } = useActions();
    const navigate = useNavigate();
    const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/
    const LoginSchema = Yup.object().shape({
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().matches(passwordRegExp, 'Password is not valid').required('Password is required')
    });
    const initialValues: ILoginModel = { email: '', password: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: LoginSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await LoginUser(values);
                navigate("/");
                toast.success('Login Success!');
            }
            catch (exeption) {
                const serverErrors = exeption as LoginServerError;
                Object.entries(serverErrors).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        let message = "";
                        value.forEach((item) => {
                            message += `${item} `;
                        });
                        setFieldError(key, message);
                    }
                });
                let message = "Login Failed! ";
                if (serverErrors.status === 401)
                    message += "The user with the entered data does not exist.";
                if (serverErrors.status === 422)
                    message += "Validation failed.";
                toast.error(message);
            }

        }
    });

    const { errors, touched, handleSubmit } = formik;

    return (

        <div>
            <h1 className="my-3">Login</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
                    <InputGroup label="Email" field="email" touched={touched.email} error={errors.email} />
                    <InputGroup label="Password" field="password" type="password" touched={touched.password} error={errors.password} />
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </Form>
            </FormikProvider>
        </div>
    );
}

export default LoginPage;