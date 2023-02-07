import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './resources/index.css';
import "./resources/modal.css"
import "./resources/custom.css"
import {Login} from './login';
import {Scoreboard} from "./scoreboard";
import {FlagSubmit} from "./submit";

export const backEndUrl = "https://hd.hegelty.space";
export const App: React.FC = () => {
    //로그인 여부
    const [login, setLogin] = useState(false)
    //이번에 푼 문제 개수, 스코어 보드의 갱신을 위해 제출 후 맞을 때 마다 1 증가
    const [solved, setSolved] = useState(0)
    //학번
    const [id, setID] = useState(0)

    function addSolved() {
        setSolved(solved + 1)
    }

    return (
        <>
            <div className="top">
                <img src="/logo.png" alt="Logo" id="logo"/>

                <Login
                    loggedIn={login}
                    setLoggedIn={setLogin}
                    setID={setID}
                />
            </div>
            <div className="middle">
                <div className='notice'>
                    <p className="graynotice">* 이 웹사이트는 Chrome 최신 버전에 최적화되어 있습니다.</p><br></br>
                    <p className="graynotice">* Safari 등의 브라우저는 로그인 기능이 동작하지 않을 수 있습니다. "크로스 사이트 추적 방지" 설정을 꺼주세요.</p>
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
        </>
    )
}


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<App/>);