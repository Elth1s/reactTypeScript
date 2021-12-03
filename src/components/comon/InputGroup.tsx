import { Field } from "formik";
import classNames from "classnames"
type AppProps = {
    label: string,
    field: string,
    type?: string,
    touched?: boolean | null,
    error?: string | null
};

const InputGroup = ({ label, field, type = "text", touched, error }: AppProps) => {

    return (
        <div className="form-floating mb-3">
            <Field type={type} name={field} id={field} placeholder={label} className={classNames("form-control",
                { "is-invalid": touched && error },
                { "is-valid": touched && !error }
            )} />
            <label htmlFor={field}>{label}</label>
            {touched && error && <div className="text-danger">{error}</div>}
        </div>
    );
};

export default InputGroup;