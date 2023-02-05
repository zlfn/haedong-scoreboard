import React, {FC, useEffect, useState} from 'react'
import axios from "axios";
import {backEndUrl} from "./index";

type ScoreboardProps = {
    login: boolean
    solved: number
}

type userData = {
    name: string
    student_id: number
    solved: boolean[]
    score: number
}

export const Scoreboard: FC<ScoreboardProps> = (login, solved) => {
    const [oobal, setOobal] = useState(false)
    const [data, setData] = useState(new Array<userData>())

    async function fetchData(): Promise<boolean> {
        return await axios.get(backEndUrl + "/scoreboard/api", {withCredentials: true})
            .then(response => {
                const res = response.data
                if (res.success) {
                    if (login)
                        setOobal(res.oobal)
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
            <TableBody oobal={oobal} data={data}/>
        </table>
    </>
}

type TableProps = {
    oobal: boolean
}
const TableHead: FC<TableProps> = ({oobal}) => {
    const temp = []
    temp.push(<>
        <th>test1</th>
        <th>test2</th>
        <th>test3</th>
        <th>test4</th>
    </>)
    if (oobal) {
        temp.push(<>
            <th>oobal1</th>
            <th>oobal2</th>
            <th>oobal3</th>
            <th>-</th>
        </>)
    }
    return <>
        <thead>
        <tr>
            <th className="pin">플래그</th>
            {temp}
            <th>SCORE</th>
        </tr>
        </thead>
    </>
}

interface ElementProps extends TableProps {
    user: userData
}

const TableElement: FC<ElementProps> = ({user, oobal}) => {
    const temp = []
    let index = 4
    if (oobal)
        index = 8

    for (let i = 0; i < index; i++) {
        if (user.solved[i]) {
            temp.push(<td key={user.student_id * 10 + i}><b className="greenT">pwned</b></td>)
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
            <th>{user.name}</th>
            {temp}
        </tr>
    </>
}

interface BodyProps extends TableProps {
    data: Array<userData>
}

const TableBody: FC<BodyProps> = ({data, oobal}) => {
    const temp: JSX.Element[] = []
    data.forEach((e) => {
        temp.push(<TableElement key={e.student_id} oobal={oobal} user={e}/>)
    })
    return <>
        <tbody>
        {temp}
        </tbody>
    </>
}