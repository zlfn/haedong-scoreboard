import React, {useEffect, useRef, useState} from "react";
import Modal from "react-modal";
import ReactModal from "react-modal";
import axios from 'axios'
import {backEndUrl, ModalProps} from "./index";
import ReactLoading from "react-loading";

ReactModal.setAppElement('#root');

type LoginProps = {
    loggedIn: boolean;
    setLoggedIn: (value: boolean) => void;
    setID: (value: number) => void;
}
export const Login: React.FC<LoginProps> = ({setID, setLoggedIn, loggedIn}) => {
    const [userName, setUserName] = useState("")
    const [failModalOpened, setFailModalOpened] = useState(false)
    const [loginModalOpened, setLoginModalOpened] = useState(false)
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)

    async function login(): Promise<boolean> {
        return await axios.get(backEndUrl + '/user/info', {withCredentials: true})
            .then(response => {
                const res = response.data
                if (res.success) {
                    setUserName(res.name)
                    setID(res.student_id)
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

        <button className="seokjoon-sibalseki" onClick={() => setLoginModalOpened(true)}>정보 입력 창 열기</button>
        <button className="seokjoon-sibalseki" onClick={() => setLoadingModalOpened(true)}>로딩 창 열기</button>
        <button className="seokjoon-sibalseki" onClick={() => setFailModalOpened(true)}>실패 창 열기</button>
        <button className="seokjoon-sibalseki" onClick={() => {
            if (loggedIn)
                setLoggedIn(false)
            else {
                login().then(success => {
                    if (!success)
                        setUserName("<<VIRTUAL>>")
                    setLoggedIn(true)
                })
            }
        }}>로그인 토글
        </button>
        <button className="seokjoon-sibalseki" onClick={() => {
            axios.post(backEndUrl + '/login/delete', {}, {withCredentials: true})
                .then(() => {
                    setLoggedIn(false)
                })
        }}>
            탈퇴하기
        </button>
        <Button/>
    </>
}


const LoginButton: React.FC = () => {
    const oauthEndPoint = "https://gbs.wiki/oauth2/login?"
    const oauthClientID = "hd-flag"
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


interface LoginModalProps extends ModalProps {
    login: () => Promise<boolean>
    failCallback: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({login, closeModal, failCallback}) => {
    const [loadingModalOpened, setLoadingModalOpened] = useState(false)
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    const nameRef = useRef<HTMLInputElement | null>(null)
    const numberRef = useRef<HTMLInputElement | null>(null)


    function register() {
        if (4 < name.length || name.length < 2 || number.length !== 4 || /[ㄱ-ㅎㅏ-ㅣa-zA-Z]/.test(name))
            return

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
        if (result.length === 4)
            nameRef.current!.focus()
        setNumber(result);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, loc: number) => {
        if (e.key === 'Enter') {
            if (loc === 0)
                nameRef.current!.focus()
            if (loc === 1)
                nameRef.current!.blur()
            register()
        }
    }

    function submitButton() {
        if (4 >= name.length && name.length >= 2 && number.length === 4 && !/[ㄱ-ㅎㅏ-ㅣa-zA-Z]/.test(name))
            return <button onClick={register}>Submit</button>
        else
            return <button
                className="modal-btn-inactive">Submit</button>
    }

    function updateCaution() {
        const warnNo = document.getElementById('warnNo')
        const inputNo = document.getElementById('numInput')
        if (number.length !== 4 && document.activeElement !== numberRef.current! && number.length !== 0){
            warnNo?.classList.remove('invis')
            inputNo?.classList.add('redBorder')
        }
        else{
            warnNo?.classList.add('invis')
            inputNo?.classList.remove('redBorder')
        }
        const warnName = document.getElementById('warnName')
        const inputName = document.getElementById('nameInput')
        if ((4 < name.length || name.length < 2 || /[ㄱ-ㅎㅏ-ㅣa-zA-Z]/.test(name)) && document.activeElement !== nameRef.current! && name.length !== 0){
            warnName?.classList.remove('invis')
            inputName?.classList.add('redBorder')
        }
        else{
            warnName?.classList.add('invis')
            inputName?.classList.remove('redBorder')
        }
    }

    /* 이름, 학번 업데이트마다 주의문구 갱신*/
    useEffect(updateCaution, [name, number])


    return (
        <>
            <div className="signIn">

                <div id="message">
                    <h3>처음 로그인하셨군요.</h3><h3>이름과 학번을 입력하세요.</h3>
                </div>
                <hr className="bar"></hr>
                <br></br>
                <div className="modal-input">
                    <div className="stuNo">
                        <input
                            id="numInput"
                            onKeyDown={(e) => {
                                onKeyDown(e, 0)
                            }}
                            onBlur={updateCaution}
                            value={number} ref={numberRef}
                            onChange={numberChange}
                            maxLength={4}
                            placeholder=" 학번"
                        />
                        <p id="warnNo" className="redT schar invis">&nbsp;학번은 4자리 숫자여야 합니다.</p>
                    </div>

                    <div className="stuName">
                        <input
                            id="nameInput"
                            onKeyDown={(e) => {
                                onKeyDown(e, 1)
                            }}
                            onBlur={updateCaution}
                            value={name}
                            ref={nameRef}
                            onChange={nameChange}
                            maxLength={4}
                            placeholder=" 이름"
                        />
                        <p id="warnName" className="redT schar invis">&nbsp;이름은 2-4자의 완성된 한글이어야 합니다.</p>
                    </div>
                </div>

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
