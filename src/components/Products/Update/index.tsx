import InputGroup from "../../comon/InputGroup";
import { useFormik, Form, FormikProvider } from 'formik';
import { IProductItem, UpsertProductServerError } from "../types";
import { useEffect, useState } from "react";
import { useActions } from '../../../hooks/useActions'
import { useNavigate } from 'react-router-dom';
import { ProductSchema } from "../validation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTypedSelector } from "../../../hooks/useTypedSelector";

const UpdateProduct = () => {

    const { GetProduct, UpdateProduct } = useActions();
    const [loadingPage, setLoadingPage] = useState<boolean>(false);

    const { currentProduct } = useTypedSelector((store) => store.product);
    const navigate = useNavigate();

    useEffect(() => {
        async function getProduct() {
            setLoadingPage(true);
            try {
                const url = window.location.search;
                const params = new URLSearchParams(url); // id=123
                let id = params.get("id");
                if (id === null) {
                    navigate("/");
                }
                else
                    await GetProduct(id);
                setLoadingPage(false);
            } catch (ex) {
                console.log("Problem fetch");
                setLoadingPage(false);
            }
        }
        getProduct();
    }, []);

    const formik = useFormik({
        initialValues: currentProduct,
        validationSchema: ProductSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await UpdateProduct(values);
                navigate("/products/list");
                toast.success('Product updated successfully.');
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
                let message = "Update Product Failed! ";
                if (serverErrors.status === 422)
                    message += "Validation failed.";
                toast.error(message);
            }
        }
    });
    const { errors, touched, handleSubmit } = formik;
    return (
        <div>
            <h1 className="my-3">Update Product</h1>
            {loadingPage ? <h2>Loading ...</h2> :
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
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </Form>
                </FormikProvider>
            }
        </div >

    );
}

export default UpdateProduct;