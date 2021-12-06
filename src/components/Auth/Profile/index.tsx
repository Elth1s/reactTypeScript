import { useEffect } from "react";
import { useState } from 'react';
import { IUser } from "../../../types/auth";
import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { useActions } from '../../../hooks/useActions'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage: React.FC = () => {
    const { GetUserProfile } = useActions();

    const initialState: IUser = {
        name: "",
        email: "",
    }
    const [state, setState] = useState<IUser>(initialState);
    useEffect(() => {
        console.log("profile start")
        // GetUserProfile().then(response => {
        //     console.log(response)
        //     console.log("profile end")
        // });
    })

    const ProfileSchema = Yup.object().shape({
        name: Yup.string().min(2).max(100).required('Name is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    });
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialState,
        validationSchema: ProfileSchema,
        onSubmit: values => {
            console.log("Edit profile")
        }
    });

    const { errors, touched, handleSubmit } = formik;
    return (
        <>
            <h1 className="my-3">Profile</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="row">
                    <div className="col col-6">
                        <InputGroup label="Name" field="name" touched={touched.name} error={errors.name} />
                        <InputGroup label="Email" field="email" touched={touched.email} error={errors.email} />
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </div>
                    <div className="col col-6">
                    </div>
                </Form>
            </FormikProvider>
        </>
    );
}

export default ProfilePage;