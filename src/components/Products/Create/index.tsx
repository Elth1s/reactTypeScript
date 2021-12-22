import React from 'react';
import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import { IProduct, UpsertProductServerError } from "../types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { ProductSchema } from "../validation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProduct: React.FC = () => {

    const { CreateProduct } = useActions();
    const navigate = useNavigate();
    const [fileSelected, setFileSelected] = React.useState<string>("https://cdn.picpng.com/icon/upload-files-icon-66764.png")
    const [fileForSend, setFileForSend] = React.useState<File>()

    const initialValues: IProduct = { name: '', detail: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: ProductSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                if (fileForSend) {
                    await CreateProduct(values, fileForSend);
                    navigate("/products/list");
                    toast.success('Product created successfully.');
                }
                else {
                    toast.error('File is required.');
                }
            }
            catch (exeption) {
                const serverErrors = exeption as UpsertProductServerError;
                Object.entries(serverErrors).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        let message = "";
                        value.forEach((item) => {
                            message += `${item} `;
                        });
                        setFieldError(key, message);
                    }
                });
                let message = "Create Product Failed! ";
                if (serverErrors.status === 422)
                    message += "Validation failed.";
                toast.error(message);
            }
        }
    });
    const { errors, touched, handleSubmit } = formik;

    const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;

        if (!fileList) return;
        console.log(fileList)
        setFileSelected(URL.createObjectURL(fileList[0]))
        setFileForSend(fileList[0]);
    };
    return (
        <div>
            <h1 className="my-3">Create Product</h1>
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
                            label="Detail"
                            field="detail"
                            touched={touched.detail}
                            error={errors.detail}
                        />
                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Create</button>
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
        </div >

    );
}

export default CreateProduct;