import React, {useEffect, useState} from "react";
import Modal from "react-modal";

type LoginProps = {
    loggedIn: Boolean;
    setToken: (token: string)=>void;
}

type StudentInfo = {
    name: string;
    studentNum: string;
}
export const Login: React.FC<LoginProps> = ({loggedIn, setToken}) => {
    function Button() {
        if(loggedIn) {
            return <ProfileHolder/>
        }
        return <LoginButton/>
    }

    useEffect(() => {

    })

    return <>
        <LoginModal/>
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

const LoginModal: React.FC = () => {
    const [isOpen, setOpen] = useState(true)
    return (
        <Modal isOpen={isOpen} style={ModalStyle as ReactModal.Styles}>
            <h3>처음 로그인 하셨군요! 이름과 학번을 알려주시겠어요?</h3>
            이름<br/>
            <input type="text"/><br/>
            학번<br/>
            <input type="text"/><br/>
            <br/><br/><br/>
            <button>확인</button>
            <span>              </span>
            <button onClick={()=>setOpen(false)}>로그인 취소</button>
        </Modal>
    )
}

const ModalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
    },
    content: {
        position: 'absolute',
        zIndex:101,
        top: '30%',
        left: '30%',
        right: '30%',
        bottom: '30%',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '10px',
        outline: 'none',
        padding: '20px'
    }
}
