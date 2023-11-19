import {NextResponse} from "next/server";

export async function GET(request: Request, response: Response) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                NextResponse.json({
                    code: 0,
                    data: {
                        username: 'zhuyayan',
                        password: '987123'
                    },
                    msg: '调用成功',
                })
            )
        } , 5000)
    })
}

export async function POST(request: Request, response: Response) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(
                NextResponse.json({
                    code: 0,
                    data: {
                        username: 'zhuyayan',
                        password: '987123'
                    },
                    msg: '调用成功',
                })
            )
        } , 1000)
    })
}
