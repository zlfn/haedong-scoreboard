import React, {FC, useEffect, useState} from 'react'
import axios from "axios";
import {backEndUrl} from "./index";

type ScoreboardProps = {
    login: boolean
    id: number
    solved: number
}

type userData = {
    name: string
    student_id: number
    solved: boolean[]
    score: number
}

export const Scoreboard: FC<ScoreboardProps> = ({id, login, solved}) => {
    const [oobal, setOobal] = useState(false)
    const [data, setData] = useState(new Array<userData>())

    async function fetchData(): Promise<boolean> {
        return await axios.get(backEndUrl + "/scoreboard/api", {withCredentials: true})
            .then(response => {
                const res = response.data
                if (res.success) {
                    if (login)
                        setOobal(res.oobal)
                    else
                        setOobal(false)
                    const temp: userData[] = []
                    res.data.forEach((e: userData) => {
                        temp.push(e)
                    })
                    setData(temp)
                    return true
                }
                return false
            })
            .catch(error => {
                return false
            })
    }

    /* 컴포넌트 마운트 / 로그인 / 문제 솔브 시마다 스코어 보드 갱신*/
    useEffect(() => {
        fetchData()
        const ID = setInterval(fetchData, 10000)
        return () => {
            clearInterval(ID)
        }
    }, [login, solved])

    return <>
        <table>
            <TableHead oobal={oobal}/>
            <TableBody login={login} student_id={id} oobal={oobal} data={data}/>
        </table>
    </>
}

type TableProps = {
    oobal: boolean
}
const TableHead: FC<TableProps> = ({oobal}) => {
    const temp = []
    for (let i = 0; i < 4; i++)
        temp.push(<th key={i}>test{i + 1}</th>)
    if (oobal) {
        for (let i = 0; i < 4; i++)
            temp.push(<th key={i + 4}>oobal{i + 1}</th>)
    }
    return <>
        <thead>
        <tr>
            <th className="pin">등수</th>
            <th className='namepin'>이름</th>
            {temp}
            <th>SCORE</th>
        </tr>
        </thead>
    </>
}

interface ElementProps extends TableProps {
    me: boolean
    rank: number
    user: userData
}

const TableElement: FC<ElementProps> = ({rank, me, user, oobal}) => {
    const temp = []
    let index = 4
    if (oobal)
        index = 8


    for (let i = 0; i < index; i++) {
        if (user.solved[i]) {
            temp.push(<td key={user.student_id * 10 + i}><b className="greenT">Pwned</b></td>)
        } else {
            temp.push(<td key={user.student_id * 10 + i}><b>-</b></td>)
        }
    }


    let color = ""
    let score = user.score.toString()
    if (user.score > 100) {
        color = "greeenT"
        if (!oobal)
            score = "100?"
    } else if (user.score === 100)
        color = "greenT"
    else if (user.score > 0)
        color = "yellowT"
    else
        color = "redT"
    temp.push(<td key={user.student_id * 10 + 9}><b className={color}>{score}</b></td>)

    return <>
        <tr>
            {me ? <th>-</th> : <th key={user.student_id * 10 + 8}><b>{rank}</b></th>}
            <th>{me ? "You" : user.name}</th>
            {temp}
        </tr>
    </>
}

interface BodyProps extends TableProps {
    login: boolean
    student_id: number
    data: Array<userData>
}

const TableBody: FC<BodyProps> = ({login, student_id, data, oobal}) => {
    const me: JSX.Element[] = []
    const temp: JSX.Element[] = []
    for(const[rank, e] of data.entries()) {
        temp.push(<TableElement rank={rank+1} me={false} key={e.student_id} oobal={oobal} user={e}/>)
        if (student_id === e.student_id && login) {
            me.push(<TableElement rank={0} me={true} key={e.student_id} oobal={oobal} user={e}/>)
        }
    }
    return <>
        <tbody>
        {me}
        {temp}
        </tbody>
    </>
}