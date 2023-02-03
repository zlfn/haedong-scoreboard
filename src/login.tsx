import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import axios from 'axios'
import {backEndUrl} from "./index";
import ReactModal from "react-modal";
import ReactLoading from "react-loading";
import Cookies from "universal-cookie";

ReactModal.setAppElement('#root');

type LoginProps = {
    loggedIn:boolean;
    setLoggedIn: (value:boolean) => void;
    userName: string;
    setUserName: (value:string) => void;
}
export const Login: React.FC<LoginProps> = ({setUserName, setLoggedIn, loggedIn,  userName}) => {
    const [failModalOpened, setFailModalOpened] = useState(false)
    const [loginModalOpened, setLoginModalOpened] = useState(false)
    const [loginModalWorking, setLoginModalWorking] = useState(false)
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [session, setSession] = useState("")

    function login(session: string) {
        new Cookies().set("session_id", session, {sameSite:"none", secure:true})
        axios.get(backEndUrl + '/user/info', {withCredentials:true})
            .then (response => {
                const res = response.data
                setUserName(res.id)
            })
            .catch (error => {
                failHandle()
                return
            })
        setLoggedIn(true)
    }

    function Button() {
        if (loggedIn) {
            return <>
                <button id="login">{userName}</button>
            </>
        }
        return <LoginButton/>
    }

    function failHandle() {
        setLoginModalOpened(false)
        setLoadingModalOpened(false)
        setFailModalOpened(true)
    }

    //code 쿼리 존재하면 로그인 시도
    useEffect(() => {
        const URLSearch = new URLSearchParams(window.location.search)
        if (URLSearch.has("code")) {
            setLoadingModalOpened(true)
            const auth = URLSearch.get("code")

            window.history.replaceState({}, "", document.location.href.split("?")[0]);
            axios.get(backEndUrl + "/login/?code=" + auth)
                .then(response => {
                    const res = response.data
                    if (res.success) {
                        login(res.session)
                        return
                    } else {
                        if (res.error === 1) {
                            setLoadingModalOpened(false)
                            setFailModalOpened(true)
                            return
                        }
                        if (res.error === 2) {
                            setSession(res.session)
                            setLoadingModalOpened(false)
                            setLoginModalOpened(true)
                            return
                        }
                    }
                })
                .catch(error => {
                    failHandle()
                    return
                })
        }
    }, [userName])

    return <>
        <Modal
            isOpen={loginModalOpened}
            overlayClassName="Modal_Overlay"
            onRequestClose={() => {
                if(!loginModalWorking)
                    setLoginModalOpened(false)
            }}
            className="Modal_Content">
            <LoginModal
                session={session}
                login={login}
                setWorking={setLoginModalWorking}
                closeModal={() => setLoginModalOpened(false)}
                failCallback={failHandle}
            />
        </Modal>
        <Modal
            isOpen={failModalOpened}
            overlayClassName="Modal_Overlay"
            onRequestClose={()=>setFailModalOpened(false)}
            className="Modal_Content">
            <LoginFailModal
                closeModal={() => setFailModalOpened(false)}
            />
        </Modal>
        <Modal
            isOpen={loadingModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Loading">
            <LoadingModal/>
        </Modal>
        <button onClick={() => setLoginModalOpened(true)}>정보 입력 창 열기</button>
        <button onClick={() => setLoadingModalOpened(true)}>로딩 창 열기</button>
        <button onClick={() => setFailModalOpened(true)}>실패 창 열기</button>
        <Button/>
    </>
}


const LoginButton: React.FC = () => {
    const oauthEndPoint = "https://gbs.wiki/oauth2/login?"
    const oauthClientID = "test"
    const oauthRedirectUri = "http://localhost:8080"
    const oauthScope = "id"
    const oauthLoginUri = oauthEndPoint + new URLSearchParams({
        client_id: oauthClientID,
        redirect_uri: oauthRedirectUri,
        scope: oauthScope
    })
    return (
        <button id="login" onClick={() => window.location.href = oauthLoginUri}>Login?</button>
    )
}

type ModalProps = {
    closeModal: () => void
}

interface LoginModalProps extends ModalProps {
    session: string
    login: (session: string) => void
    failCallback: () => void
    setWorking:(value: boolean) => void
}

const LoginModal: React.FC<LoginModalProps> = ({setWorking, session,  login, closeModal, failCallback}) => {
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    function register() {
        setWorking(true)
        setLoadingModalOpened(true)
        axios.defaults.withCredentials = true;
        new Cookies().set("session_id", session,{secure: true, sameSite: 'none'})
        axios.post(backEndUrl + "/login/register", {
            name: name,
            student_id: number
        },{withCredentials:true})
            .then(response => {
                if (response.data.success) {
                    setWorking(false)
                    login(session)
                    return
                } else {
                    setWorking(false)
                    failCallback()
                    return
                }
            })
            .catch(error => {
                setWorking(false)
                failCallback()
                return
            })
    }

    const nameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setName(e.target.value)
    }
    const numberChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setNumber(e.target.value)
    }

    return (
        <>
            <div className="signin">
                
                <div id="messege">
                    <h3>처음 로그인하셨군요.</h3><h3>이름과 학번을 입력하세요.</h3>
                </div>
                <hr className="bar"></hr>
                <br></br>
                <div className="modal-input">
                    <input onChange={numberChange} maxLength={4} placeholder=" 학번"/>
                    <input onChange={nameChange} maxLength={3} placeholder=" 이름"/>
                </div>
                <br/><br/>
                <div className="modal-btn">
                    <button onClick={register}>Submit</button>
                    <button onClick={closeModal}>Cancel</button>
                </div>
                
                <Modal
                    isOpen={loadingModalOpened}
                    overlayClassName="Modal_Alpha_Overlay"
                    className="Modal_Loading">
                    <LoadingModal/>
                </Modal>
            </div>
            
        </>
    )
}


const LoginFailModal: React.FC<ModalProps> = ({closeModal}) => {
    return (
        <>
            <div className="modalfail">
                <h3>로그인에 실패했습니다.</h3>
                <button onClick={closeModal}>닫기</button>
            </div>
            
        </>
    )
}

const LoadingModal: React.FC = () => {
    return (
        <>
            <ReactLoading
                height="100px"
                width="100px"
                type="bars"
                color="#ffffff"
            ></ReactLoading>
        </>
    )
}