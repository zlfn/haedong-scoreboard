import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './resources/index.css';
import "./resources/modal.css"
import "./resources/custom.css"
import {Login} from './login';

export const backEndUrl = "https://hd.hegelty.space";
export const App: React.FC = () => {
    const [loggedIn, setLogin] = useState(false)
    const [userName, setUserName] = useState("박찬웅")

    function temp() {
        if(loggedIn)
            return <TempLogged/>
        else
            return <Temp/>
    }

    return(
        <>
            <div className="top">
                <img src="/logo.png" alt="Logo" id="logo"/>
                <Login
                    loggedIn={loggedIn}
                    userName={userName}
                    setLoggedIn={setLogin}
                    setUserName={setUserName}
                />
            </div>
            {temp()}
        </>
    )
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App/>);


//모양 만들기용 임시 컴포넌트. 개발하면서 조각조각 쪼갤거임.
const Temp: React.FC = () => {
    return (
        <>
            <div className="middle">
                <table>
                    <thead>
                    <tr>
                        <th className="pin"></th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>SCORE</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <th>박찬웅</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greeenT">100점?</b></td>
                    </tr>
                    <tr>
                        <th>나태양</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greeenT">100점?</b></td>
                    </tr>
                    <tr>
                        <th>오레오</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">100점</b></td>
                    </tr>
                    <tr>
                        <th>윤석준</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b className="yellowT">30점</b></td>
                    </tr>
                    <tr>
                        <th>김지민</th>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b className="redT">0점</b></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}
const TempLogged: React.FC = () => {
    return (
        <>
            <div className="middle">
                <table>
                    <thead>
                    <tr>
                        <th className="pin"></th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>PLUS A</th>
                        <th>PLUS B</th>
                        <th>PLUS C</th>
                        <th>PLUS D</th>
                        <th>SCORE</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        {/*로그인 해야 보임*/}
                        <th>내 점수</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greeenT">1111100점</b></td>
                    </tr>
                    <tr>
                        <th>박찬웅</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greeenT">1111100점</b></td>
                    </tr>
                    <tr>
                        <th>나태양</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b>-</b></td>
                        <td><b className="greeenT">111100점</b></td>
                    </tr>
                    <tr>
                        <th>오레오</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b className="greenT">100점</b></td>
                    </tr>
                    <tr>
                        <th>윤석준</th>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b className="greenT">맞았습니다!</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b className="yellowT">30점</b></td>
                    </tr>
                    <tr>
                        <th>김지민</th>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b>-</b></td>
                        <td><b className="redT">0점</b></td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="flag">
                <input type="text" name="text" id="input" placeholder="Wanna type something?"/>
                <input type="submit" name="submit" id="submit" value="Enter.."/>
            </div>
        </>
    )
}