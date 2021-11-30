import { Field } from "formik";

type AppProps = {
    label: string,
    field: string,
    type?: string,
};

const InputGroup = ({ label, field, type = "text" }: AppProps) => {

    return (
        <>
            <Field type={type} name={field} className="form-control" id={field} placeholder={label} />
            <label htmlFor={field}>{label}</label>
        </>
    );
};

export default InputGroup;