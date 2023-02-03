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

ReactModal.setAppElement('#root');

type LoginProps = {
    loggedIn: Boolean;
    setToken: (token: string)=>void;
}

type StudentInfo = {
    name: string;
    studentNum: string;
}
export const Login: React.FC<LoginProps> = ({loggedIn, setToken}) => {
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

    //code 쿼리 존재하면 로그인 시도
    useEffect(() => {
        const URLSearch = new URLSearchParams(window.location.search)
        if(URLSearch.has("code")) {
            setLoadingModalOpened(true)
            const auth = URLSearch.get("code")
            // @ts-ignore
            setAuthCode(auth)
            console.log(auth)
            window.history.replaceState({}, "", document.location.href.split("?")[0]);
            axios({
                url: backEndUrl + "/login",
                method: 'get',
                data: {
                    code: auth
                }
            }).then(response => {
                    console.log(response.data.data)
                    //TODO: 로그인 프로세스 구성
                })
                .catch(error => {
                    setLoadingModalOpened(false)
                    setFailModalOpened(true)
                })
        }
    }, [])

    return <>
        <Modal
            isOpen={loginModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Content">
            <LoginModal
                closeModal={()=>setLoginModalOpened(false)}
                setStudentData={()=>{}}
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
    setStudentData: ()=>void
}

const LoginModal: React.FC<LoginModalProps> = ({closeModal}) => {
    return (
        <>
            <h3>처음 로그인 하셨군요! 이름과 학번을 알려주시곘어요?</h3>
            <button onClick={closeModal}>로그인 취소</button>
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