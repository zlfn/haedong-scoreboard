import React, {useEffect, useState} from "react";
import Modal from "react-modal";
import axios from 'axios'
import {backEndUrl} from "./index";
import ReactModal from "react-modal";
import ReactLoading from "react-loading";

ReactModal.setAppElement('#root');

type LoginProps = {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    userName: string;
    setUserName: (value: string) => void;
}
export const Login: React.FC<LoginProps> = ({setUserName, setLoggedIn, loggedIn, userName}) => {
    const [failModalOpened, setFailModalOpened] = useState(false)
    const [loginModalOpened, setLoginModalOpened] = useState(false)
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)

    async function login(): Promise<boolean> {
        return await axios.get(backEndUrl + '/user/info', {withCredentials: true})
            .then(response => {
                const res = response.data
                if (res.success) {
                    setUserName(res.name)
                    setLoggedIn(true)
                    return true
                } else
                    return false
            })
            .catch(error => {
                return false
            })
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

    useEffect(() => {
        //code 쿼리 존재하면 로그인 시도
        const URLSearch = new URLSearchParams(window.location.search)
        if (URLSearch.has("code")) {
            setLoadingModalOpened(true)
            const auth = URLSearch.get("code")

            window.history.replaceState({}, "", document.location.href.split("?")[0]);
            axios.get(backEndUrl + "/login/?code=" + auth, {withCredentials: true})
                .then(response => {
                    const res = response.data
                    if (res.success) {
                        if (!login())
                            failHandle()
                        else
                            setLoadingModalOpened(false)
                    } else {
                        if (res.error === 1) {
                            setLoadingModalOpened(false)
                            setFailModalOpened(true)
                        }
                        if (res.error === 2) {
                            setLoadingModalOpened(false)
                            setLoginModalOpened(true)
                        }
                    }
                })
                .catch(error => {
                    failHandle()
                })
        }
        //존재하지 않으면 세션으로 자동 로그인 시도
        else {
            setLoadingModalOpened(true)
            login().then(value => {
                setLoadingModalOpened(false)
            })
        }
    }, [userName])

    return <>
        <Modal
            isOpen={loginModalOpened}
            overlayClassName="Modal_Overlay"
            className="Modal_Content">
            <LoginModal
                login={login}
                closeModal={() => setLoginModalOpened(false)}
                failCallback={failHandle}
            />
        </Modal>
        <Modal
            isOpen={failModalOpened}
            overlayClassName="Modal_Overlay"
            onRequestClose={() => setFailModalOpened(false)}
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
        <button onClick={() => {
            if (loggedIn)
                setLoggedIn(false)
            else
            {
                login().then(success=>{
                    if(!success)
                        setUserName("<<VIRTUAL>>")
                        setLoggedIn(true)
                })
            }
        }}>로그인 토글
        </button>
        <button onClick={() => {
            setLoggedIn(false)
            axios.post(backEndUrl + '/login/delete', {}, {withCredentials: true})
        }}>
            탈퇴하기
        </button>
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
    login: () => Promise<boolean>
    failCallback: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({login, closeModal, failCallback}) => {
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    function register() {
        setLoadingModalOpened(true)
        axios.defaults.withCredentials = true;
        axios.post(backEndUrl + "/login/register", {
            name: name,
            student_id: number
        }, {withCredentials: true})
            .then(response => {
                if (response.data.success) {
                    if (!login())
                        failCallback()
                    else {
                        setLoadingModalOpened(false)
                        closeModal()
                    }
                } else {
                    failCallback()
                }
            })
            .catch(error => {
                failCallback()
            })
    }

    const nameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]/g, '');
        setName(result)
    }
    const numberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = e.target.value.replace(/\D/g, '');
        setNumber(result);
    }

    function submitButton() {
        if (4 >= name.length && name.length >= 2 && number.length === 4 && !/[a-zA-Z]/.test(name))
            return <button onClick={register}>Submit</button>
        else
            return <button
                className="modal-btn-inactive">Submit</button>
    }

    function cautionText() {
        if ((4 < name.length || name.length <= 2) && number.length !== 4)
            return <p className="redT">⚠ 학번은 4자리 숫자여야 합니다.<br/>⚠ 이름은 2자리 - 4자리의 한글이어야 합니다.</p>
        if (4 < name.length || name.length < 2 || /[a-zA-Z]/.test(name))
            return <p className="redT">⚠ 이름은 2자리 - 4자리의 한글이어야 합니다.</p>
        if (number.length !== 4)
            return <p className="redT">⚠ 학번은 4자리 숫자여야 합니다.</p>
        return <p></p>
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
                    <input value={number} onChange={numberChange} maxLength={4} placeholder=" 학번"/>
                    <input value={name} onChange={nameChange} maxLength={4} placeholder=" 이름"/>
                </div>
                {cautionText()}

                <div className="modal-btn">
                    {submitButton()}
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
                <button onClick={closeModal}>Close</button>
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