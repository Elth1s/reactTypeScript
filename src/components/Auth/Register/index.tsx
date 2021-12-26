import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { IRegisterModel, RegisterServerError } from "./types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { LegacyRef, useRef, useState } from "react";
import { Modal } from "bootstrap";
import Cropper from 'cropperjs';

const RegisterPage = () => {

    const { RegisterUser } = useActions();
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const [fileSelected, setFileSelected] = React.useState<string>("https://cdn.picpng.com/icon/upload-files-icon-66764.png")
    const [cropperObj, setCropperObj] = useState<Cropper>();
    const imgRef = useRef<HTMLImageElement>(null);


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
                if (cropperObj) {
                    let blob: Blob;
                    if (imgRef.current?.src) {
                        blob = base64ImageToBlob(imgRef.current?.src)
                        var file = new File([blob], "image");
                        await RegisterUser(values, file);
                        navigate("/");
                        toast.success('Register Success!');
                    }
                }
                else {
                    toast.error('File is required.');
                }
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

    const base64ImageToBlob = (str: string) => {
        // extract content type and base64 payload from original string
        var pos = str.indexOf(';base64,');
        var type = str.substring(5, pos);
        var b64 = str.substr(pos + 8);

        // decode base64
        var imageContent = atob(b64);

        // create an ArrayBuffer and a view (as unsigned 8-bit)
        var buffer = new ArrayBuffer(imageContent.length);
        var view = new Uint8Array(buffer);

        // fill the view, using the decoded base64
        for (var n = 0; n < imageContent.length; n++) {
            view[n] = imageContent.charCodeAt(n);
        }

        // convert ArrayBuffer to Blob
        var blob = new Blob([buffer], { type: type });

        return blob;
    }

    const selectImage = async (url: string) => {
        if (!cropperObj) {
            const cropper = new Cropper(imgRef.current as HTMLImageElement, {
                aspectRatio: 1 / 1,
                viewMode: 1,
                dragMode: 'move',
            });
            cropper.replace(url);
            setCropperObj(cropper);
        }
        else
            cropperObj?.replace(url);

        const modalEle = modalRef.current;
        const bsModal = new Modal(modalEle as unknown as Element, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();
    }

    const handleImageChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList || fileList.length == 0) return;

        // await setFileSelected(URL.createObjectURL(fileList[0]))
        await console.log(fileList[0])
        await selectImage(URL.createObjectURL(fileList[0]));
    };

    const rotateImg = () => {
        cropperObj?.rotate(90);
    };

    const modalSave = async function (e: React.MouseEvent<HTMLElement>) {
        const base = cropperObj?.getCroppedCanvas().toDataURL() as string;
        await setFileSelected(base)
    };

    const { errors, touched, handleSubmit } = formik;
    return (
        <>
            <h1 className="my-3">Register</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="row">
                    <div className="col col-6">
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
                    </div>
                    <div className="col col-6">
                        <div className="mb-3">
                            <label htmlFor="Image">
                                <img src={fileSelected}
                                    width="200px"
                                    style={{ cursor: "pointer" }}
                                />
                            </label>
                            <input className="form-control d-none" type="file" name="Image" id="Image" onChange={handleImageChange} />
                        </div>
                    </div>
                </Form>
            </FormikProvider>
            <div className="modal" ref={modalRef} tabIndex={-1}>
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Modal title</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <button type="button" className="btn btn-primary mb-3" onClick={rotateImg}>
                                Rotate
                            </button>
                            <div>
                                <img id="image" ref={imgRef as LegacyRef<HTMLImageElement>}
                                    src={fileSelected} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={modalSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;