import React, { useState } from "react";
import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { ILoginModel, LoginUser } from "../../../store/action-creators/auth";

interface IRegisterModel {
    name: string,
    email: string,
    password: string,
    confirm_password: string
};
const RegisterPage = () => {

    const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/
    const RegisterSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Email must be a valid email address').required('Email is required'),
        password: Yup.string().matches(passwordRegExp, 'Password is not valid').required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
    });
    const initialValues: IRegisterModel = { name: '', email: '', password: '', confirm_password: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: RegisterSchema,
        onSubmit: values => {
            console.log("register", values)
        }
    });
    const { errors, touched, handleSubmit } = formik;
    return (
        <div>
            <h1 className="my-3">Register</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
                    <div className="form-floating mb-3">
                        <InputGroup
                            label="Name"
                            field="name"
                        />
                        {touched.name && errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
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
                    <div className="form-floating mb-3">
                        <InputGroup label="Confirm Password" field="confirm_password" type="password" />
                        {touched.confirm_password && errors.confirm_password && <div className="text-danger">{errors.confirm_password}</div>}
                    </div>
                    <div className="text-end">
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>
                </Form>
            </FormikProvider>
        </div >

    );
}

export default RegisterPage;