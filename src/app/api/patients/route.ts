import {NextResponse} from "next/server";

export async function GET(request: Request, response: Response) {
   const resp =  NextResponse.json({
    'code': 0,
    'data': [
      { id: 1, name: 'John Doe', age: 30, gender: 'Male', medicalHistory: 'Lorem ipsum dolor sit amet' },
      { id: 2, name: 'Jane Smith', age: 40, gender: 'Female', medicalHistory: 'Lorem ipsum dolor sit amet' },
    ],
    'msg': '调用成功'
  })
  resp.headers.set('Content-Type', 'application/json; charset=utf-8')
  return resp
}
