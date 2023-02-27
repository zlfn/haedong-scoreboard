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
                <div className='notice'>
                    <span className="graynotice">* 이 웹사이트는 Firefox와 Chrome 최신 버전에 최적화되어 있습니다.<br/>
                        * Safari 등의 브라우저는 로그인 기능이 동작하지 않을 수 있습니다. "크로스 사이트 추적 방지" 설정을 꺼주세요.</span>
                </div>
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
                className="Modal_Credit">
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
            <div id="credit">
                <div id="message2">
                    <p>Credit</p>
                </div>
                <div id="creditMember">
                    <p>Frontend | 박찬웅 최용혁</p>
                    <p>Web Publishing | 최용혁 김서호</p>
                    <p>Backend | 나태양</p>
                    <p>Problems | 김서호 신희찬</p>
                </div>
                <button className="modal-btn seokjoon-sibalseki" onClick={closeModal}>Close</button>
            </div>
            
        </>
    )
}
