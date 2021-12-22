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
            id: searchParams.get("id"),
            name: searchParams.get("name"),
            detail: searchParams.get("detail"),
        }
    )
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
    useEffect(() => {
        getProducts();
    }, [search.page]);

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

    const ChangeIdHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let data: IProductSearch = {
            ...search,
            id: e.target.value,
        };
        setSearch(data);
    }
    const ChangeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let data: IProductSearch = {
            ...search,
            name: e.target.value,
        };
        setSearch(data);
    }
    const ChangeDetailHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let data: IProductSearch = {
            ...search,
            detail: e.target.value,
        };
        setSearch(data);
    }
    const onClickSearch = () => {
        let data: IProductSearch = {
            ...search,
            page: 1
        };
        setSearch(data)
        setSearchParams(qs.stringify(data));
        getProducts()
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
                    <div className="row my-2  me-1">
                        <div className="col-12 py-2 py-md-0 col-sm-6 col-md">
                            <input type="text" className="form-control" placeholder="id" value={search.id ?? ""} onChange={ChangeIdHandler} />
                        </div>
                        <div className="col-12 py-2 py-md-0 col-sm-6 col-md">
                            <input type="text" className="form-control" placeholder="name" value={search.name ?? ""} onChange={ChangeNameHandler} />
                        </div>
                        <div className="col-12 py-2 py-md-0 col-sm-6 col-md">
                            <input type="text" className="form-control" placeholder="detail" value={search.detail ?? ""} onChange={ChangeDetailHandler} />
                        </div>
                        <div className="col-12 py-2 py-md-0 col-sm-6 col-md-3 col-lg-2 px-md-0 ms-auto">
                            <Link className="btn btn-primary w-100" onClick={onClickSearch} to={"?" + qs.stringify({ page: 1, id: search.id, name: search.name, detail: search.detail })}>Search</Link>
                        </div>
                    </div>
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
                                        <td width="10%">
                                            <img src={`http://local.laravel.pu911.com:100${item.image}`} alt='манул' width='100' />
                                        </td>
                                        <td width="30%">{item.name}</td>
                                        <td width="30%">{item.detail}</td>
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
                            const data: IProductSearch = {
                                ...search,
                                page: item,
                            };
                            return (
                                <Link
                                    onClick={() => {
                                        setSearch(data);
                                        setSearchParams(qs.stringify(data));
                                    }}
                                    key={key}
                                    to={"?" + qs.stringify(data)}
                                    className={classNames("btn btn-dark mx-1",
                                        { "disabled": item == search.page || (item == 1 && search.page == null) }
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