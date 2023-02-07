import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './resources/index.css';
import "./resources/modal.css"
import "./resources/custom.css"
import {Login} from './login';
import {Scoreboard} from "./scoreboard";
import {FlagSubmit} from "./submit";
import Modal from "react-modal";

export const backEndUrl = "https://hd.hegelty.space";
export const App: React.FC = () => {
    //로그인 여부
    const [login, setLogin] = useState(false)
    //이번에 푼 문제 개수, 스코어 보드의 갱신을 위해 제출 후 맞을 때 마다 1 증가
    const [solved, setSolved] = useState(0)
    //학번
    const [id, setID] = useState(0)
    const [creditModalOpened, setCreditModalOpened] = useState(false)

    function addSolved() {
        setSolved(solved + 1)
    }

    return (
        <>
            <div className="top">
                <img src="/logo.png" alt="Logo" id="logo" onClick={()=>setCreditModalOpened(true)}/>
                <Login
                    loggedIn={login}
                    setLoggedIn={setLogin}
                    setID={setID}
                />
            </div>
            <div className="middle">
                <Scoreboard
                    id={id}
                    login={login}
                    solved={solved}
                />
            </div>
            <div className="flag">
                <FlagSubmit
                    login={login}
                    addSolved={addSolved}
                />
            </div>

            <Modal
                isOpen={creditModalOpened}
                overlayClassName="Modal_Overlay"
                onRequestClose={()=>setCreditModalOpened(false)}
                className="Modal_Loading">
                <CreditModal closeModal={()=>setCreditModalOpened(false)}/>
            </Modal>
        </>
    )
}


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<App/>);


export type ModalProps = {
    closeModal: () => void
}
const CreditModal: React.FC<ModalProps> = ({closeModal}) => {
    return (
        <>
            <h1>여기 크레딧</h1>
            <button onClick={closeModal}>Close</button>
        </>
    )
}
