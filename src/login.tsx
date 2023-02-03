import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import * as url from "url";
import * as queryString from "query-string";
import {useSearchParams} from 'react-router-dom';
import axios from 'axios'
import {backEndUrl} from "./index";
import {inspect} from "util";
import ReactModal from "react-modal";
import ReactLoading from "react-loading";
import Cookies from "universal-cookie";

ReactModal.setAppElement('#root');

type LoginProps = {
    loggedIn: Boolean;
    login: (session: string)=>void;
}

type StudentInfo = {
    name: string;
    studentNum: string;
}
export const Login: React.FC<LoginProps> = ({loggedIn, login}) => {
    const [failModalOpened, setFailModalOpened] = useState(false)
    const [loginModalOpened, setLoginModalOpened] = useState(false)
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [authCode, setAuthCode] = useState("")

    function Button() {
        if(loggedIn) {
            return <ProfileHolder/>
        }
        return <LoginButton/>
    }

    function registerFailHandle() {
        setLoginModalOpened(false)
        setFailModalOpened(true)
    }

    console.log(authCode)
    //code 쿼리 존재하면 로그인 시도
    useEffect(() => {
        const URLSearch = new URLSearchParams(window.location.search)
        if(URLSearch.has("code")) {
            setLoadingModalOpened(true)
            const auth = URLSearch.get("code")
            // @ts-ignore
            setAuthCode(auth)

            window.history.replaceState({}, "", document.location.href.split("?")[0]);
            setTimeout(()=>
            {axios.get(backEndUrl + "/login?code=" + auth)
                .then(response => {
                    const res = response.data
                    if(res.success) {
                        login(res.session)
                        return
                    } else {
                        if(res.error === 1) {
                            setLoadingModalOpened(false)
                            setFailModalOpened(true)
                            return
                        }
                        if(res.error === 2) {
                            new Cookies().set("session_id", res.session)
                            setLoadingModalOpened(false)
                            setLoginModalOpened(true)
                            return
                        }
                    }
                })
                .catch(error => {
                    setLoadingModalOpened(false)
                    setFailModalOpened(true)
                })
        },1000)
        }
    }, [login])

    return <>
        <Modal
            isOpen={loginModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Content">
            <LoginModal
                login={login}
                authCode={authCode}
                closeModal={()=>setLoginModalOpened(false)}
                failCallback={registerFailHandle}
            />
        </Modal>
        <Modal
            isOpen={failModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Content">
            <LoginFailModal
                closeModal={()=>setFailModalOpened(false)}
            />
        </Modal>
        <Modal
            isOpen={loadingModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Loading">
            <LoadingModal/>
        </Modal>
        <button onClick={()=>setLoginModalOpened(true)}>정보 입력 창 열기</button>
        <button onClick={()=>setLoadingModalOpened(true)}>로딩 창 열기</button>
        <button onClick={()=>setFailModalOpened(true)}>실패 창 열기</button>
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
        <button id="login" onClick={()=>window.location.href=oauthLoginUri}>Login?</button>
    )
}

const ProfileHolder: React.FC = () => {
    return (
        <button id="login">zlfn</button>
    )
}

type ModalProps = {
    closeModal: ()=>void
}

interface LoginModalProps extends ModalProps {
    authCode: string
    login: (session: string)=>void
    failCallback: ()=>void
}

const LoginModal: React.FC<LoginModalProps> = ({authCode, login, closeModal, failCallback}) => {
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    function register() {
        setLoadingModalOpened(true)
        setTimeout(() => {axios.post(backEndUrl + "/login/register", {
                name: name,
                student_id: number
            }, {withCredentials:true})
                .then(response => {
                    if (response.data.success) {
                        setTimeout(()=> {axios.get(backEndUrl + "/login?code=" + authCode)
                                .then(response => {
                                    if (response.data.success) {
                                        login(response.data.session)
                                        closeModal()
                                    } else {
                                        failCallback()
                                    }
                                })
                                .catch(error => {
                                    failCallback()
                                })
                        },1000)
                    } else {
                        failCallback()
                    }
                })
                .catch(error => {
                    failCallback()
                    return
                })
        }, 1000)
    }

    const nameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setName(e.target.value)
    }
    const numberChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setNumber(e.target.value)
    }

    return (
        <>
            <h3>처음 로그인 하셨군요! 이름과 학번을 알려주시곘어요?</h3>
            <input onChange={nameChange} maxLength={3} placeholder="이름"/>
            <input onChange={numberChange} maxLength={4} placeholder="학번"/>
            <br/><br/>
            <button onClick={register}>제출하기</button>
            <button onClick={closeModal}>로그인 취소</button>
            <Modal
                isOpen={loadingModalOpened}
                overlayClassName="Modal_Alpha_Overlay"
                className="Modal_Loading">
                <LoadingModal/>
            </Modal>
        </>
) }


const LoginFailModal: React.FC<ModalProps> = ({closeModal}) => {
    return (
        <>
            <h3>로그인에 실패했습니다.</h3>
            <button onClick={closeModal}>닫기</button>
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
                color="#2e2e2e"
            ></ReactLoading>
        </>
    )
}