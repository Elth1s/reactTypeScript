import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import { IProduct, UpsertProductServerError } from "../types";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { ProductSchema } from "../validation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProduct = () => {

    const { CreateProduct } = useActions();
    const navigate = useNavigate();


    const initialValues: IProduct = { name: '', detail: '' };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: ProductSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await CreateProduct(values);
                navigate("/products/list");
                toast.success('Product created successfully.');
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
    return (
        <div>
            <h1 className="my-3">Create Product</h1>
            <FormikProvider value={formik} >
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} className="col col-6">
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
                </Form>
            </FormikProvider>
        </div >

    );
}

export default CreateProduct;