import { useEffect } from "react";
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
    const [fileSelected, setFileSelected] = React.useState<string>("https://static.remove.bg/remove-bg-web/6c5ea334216f9ded64486efb0e2a4421757cbce5/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png")
    let cropper: Cropper;
    const { user } = useTypedSelector((store) => store.auth);

    useEffect(() => {
        async function fetchMyAPI() {
            try {
                await GetUserProfile();
            }
            catch (ex) {
                console.log("error", ex);
            }
        }
        fetchMyAPI();
    }, [])

    const selectImage = async () => {
        console.log("Select image");
        const modalEle = modalRef.current;
        const bsModal = new Modal(modalEle as unknown as Element, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();

        const image = await document.getElementById("image");
        console.log(cropper)
        if (cropper) {
            console.log("replace2")
        }
        else
            cropper = new Cropper(image as any, {
                aspectRatio: 1 / 1,
                viewMode: 1,
                dragMode: 'move',
                crop(event) {
                    // console.log(event.detail.x);
                    // console.log(event.detail.y);
                    // console.log(event.detail.width);
                    // console.log(event.detail.height);
                    // console.log(event.detail.rotate);
                    // console.log(event.detail.scaleX);
                    // console.log(event.detail.scaleY);
                },
            });
        console.log(fileSelected)

    }

    const handleImageChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
        const fileList = e.target.files;
        if (!fileList || fileList.length == 0) return;

        await setFileSelected(URL.createObjectURL(fileList[0]))
        console.log(fileSelected)
        selectImage()
    };

    return (
        <>
            <h1 className="my-3">Profile</h1>
            <div className="row ">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body text-center card-height">
                            <label htmlFor="Image">
                                <img src={fileSelected}
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
                            <p>Modal body text goes here.</p>
                            <div>
                                <img id="image"
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
                            <button type="button" className="btn btn-primary" onClick={() => {
                                cropper.rotate(90);
                            }}>
                                rotate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfilePage;