import {NextResponse} from "next/server";

export async function GET(request: Request, response: Response) {
    return NextResponse.json({
        'code': 0,
        'data': {
            'username': 'zhuyayan',
            'password': '987123',
        },
        'msg': '调用成功'
    })
}
