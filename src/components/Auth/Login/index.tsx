import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { ILoginModel, LoginUser } from "../../../store/action-creators/auth";

const LoginPage = () => {

    const LoginSchema = Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required')
    });
    const initialValues: ILoginModel = { email: '', password: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: LoginSchema,
        onSubmit: values => {
            LoginUser(values);
        }
    });

    const { errors, touched, handleSubmit } = formik;

    return (

        <div>
            <h1 className="my-3">Login</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
                    <div className="form-floating mb-3">
                        <InputGroup
                            label="Email"
                            field="email"
                        />
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