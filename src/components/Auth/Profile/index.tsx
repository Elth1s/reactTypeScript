import { useEffect } from "react";
import { useState } from 'react';
import { IUser } from "../../../types/auth";
import { useActions } from '../../../hooks/useActions'
import 'react-toastify/dist/ReactToastify.css';
import { useTypedSelector } from "../../../hooks/useTypedSelector";

const ProfilePage: React.FC = () => {
    const { GetUserProfile } = useActions();

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

    return (
        <>
            <h1 className="my-3">Profile</h1>
            <div className="row ">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body text-center card-height">
                            <img src="https://mdbootstrap.com/img/Photos/new-templates/bootstrap-chat/ava3.png" alt="avatar" className="rounded-circle img-fluid" width="150px" />
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
        </>
    );
}

export default ProfilePage;