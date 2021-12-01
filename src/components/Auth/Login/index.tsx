import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { ILoginModel } from "./types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';

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
        onSubmit: async (values) => {
            try {
                await LoginUser(values);
                navigate("/");
            }
            catch (error) {
                console.log(error)
            }
        }
    });

    const { errors, touched, handleSubmit } = formik;

    return (

        <div>
            <h1 className="my-3">Login</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
                    <div className="form-floating mb-3">
                        <InputGroup label="Email" field="email" />
                        {touched.email && errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="form-floating mb-3">
                        <InputGroup label="Password" field="password" type="password" />
                        {touched.password && errors.password && <div className="text-danger">{errors.password}</div>}
                    </div>
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                </Form>
            </FormikProvider>
        </div>
    );
}

export default LoginPage;