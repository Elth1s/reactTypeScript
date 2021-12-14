import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { DeleteProductServerError, IProductItem, IProductSearch, IProductsModel } from "../types";
import classNames from "classnames"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import qs from "qs";

const ProductList: React.FC = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const { products, last_page } = useTypedSelector((store) => store.product);
    const { GetProducts, DeleteProduct } = useActions();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState<IProductSearch>(
        {
            page: searchParams.get("page"),
            name: searchParams.get("name"),
        }
    )
    useEffect(() => {
        async function getProducts() {
            setLoading(true);
            try {
                await GetProducts(search);
                setLoading(false);
            } catch (ex) {
                console.log("Problem fetch");
                setLoading(false);
            }
        }
        getProducts();
    }, [search]);

    const DeleteProductHandle = async (id: number) => {
        setLoading(true);
        try {
            await DeleteProduct(id);
            await GetProducts(search);
            setLoading(false);
            toast.success('Product deleted successfully.');
        }
        catch (exeption) {
            setLoading(false);
            const serverErrors = exeption as DeleteProductServerError;
            toast.error(serverErrors.error);
        }
    }

    const buttons = [];
    for (var i = 1; i <= last_page; i++) {
        buttons.push(i);
    }
    return (
        <>
            <div className="row">
                <h1 className="col-3 my-3">Product List</h1>
                <Link className="col-3 my-auto ms-auto me-3 btn btn-dark btn-lg w-auto" to={`/products/create`}>
                    Create new product
                </Link>
            </div>
            {loading ? <h2>Loading ...</h2> :
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Details</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td width="10%">{item.id}</td>
                                        <td width="35%">{item.name}</td>
                                        <td width="35%">{item.detail}</td>
                                        <td width="20%">
                                            <div className="row">
                                                <Link to={'/products/update?id=' + item.id} className="btn btn-warning w-auto me-3">Edit</Link>
                                                <button key={item.id} className="btn btn-danger w-auto text-black" onClick={() => DeleteProductHandle(item.id)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="text-end">
                        {buttons.map((item, key) => {
                            return (
                                <Link
                                    onClick={() => {
                                        setSearch({ page: item })
                                    }}
                                    key={key}
                                    to={"/products/list?page=" + item}
                                    className={classNames("btn btn-dark mx-1",
                                        { "disabled": item == search.page }
                                    )}
                                >
                                    {item}
                                </Link>
                            );
                        })}
                    </div>
                </>
            }

        </>
    );
}
export default ProductList