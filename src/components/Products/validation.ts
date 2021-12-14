import * as Yup from 'yup';

export const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    detail: Yup.string().required('Detail is required'),
});