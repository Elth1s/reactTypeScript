import { LegacyRef, useEffect } from "react";
import { useState } from 'react';
import { IUser } from "../../../types/auth";
import { useActions } from '../../../hooks/useActions'
import 'react-toastify/dist/ReactToastify.css';
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import { useRef } from 'react';
import { Modal } from "bootstrap";
import Cropper from 'cropperjs';
import React from "react";

const ProfilePage: React.FC = () => {
    const { GetUserProfile } = useActions();
    const modalRef = useRef(null);
    const [fileSelected, setFileSelected] = React.useState<string>("")
    const [cropperObj, setCropperObj] = useState<Cropper>();
    const imgRef = useRef<HTMLImageElement>(null);
    const { user } = useTypedSelector((store) => store.auth);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        async function fetchMyAPI() {
            setLoading(true);
            try {
                await GetUserProfile();
                setLoading(false);
            }
            catch (ex) {
                setLoading(false);
                console.log("error", ex);
            }
        }
        fetchMyAPI();
    }, [])

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

    return (
        <>
            <h1 className="my-3">Profile</h1>
            {loading ? <h2>Loading ...</h2> :
                <>
                    <div className="row ">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center card-height">
                                    <label htmlFor="Image">
                                        <img src={fileSelected == "" ? `http://local.laravel.pu911.com:100${user.image}` : fileSelected}
                                            width="250px"
                                            style={{ cursor: "pointer" }}
                                            alt="avatar"
                                        />
                                    </label>
                                    <input className="form-control d-none" type="file" name="Image" id="Image" onChange={handleImageChange} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body card-height">
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.name}</p>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user.email}</p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div >

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
            }
        </>
    );
}

export default ProfilePage;