import { NextResponse } from 'next/server';

export async function GET(request: Request, response: Response) {
  const resp = NextResponse.json({
    'code': 0,
    'data': [
      {
        id: 1,
        name: "病人",
        path: "/rehab/patient",
        icon: "AccessibilityIcon",
        children: [
          {
            id: 11,
            name: "11",
            path: "/rehab/rehabilitation",
            icon: "AccessibleIcon",
            children: [{
              id: 111,
              name: "111",
              path: "/rehab/rehabilitation",
              icon: "AccessibleIcon",
              children: [],
            }, {
              id: 112,
              name: "112",
              path: "/rehab/assessment",
              icon: "AccessibleIcon",
              children: [],
            }],
          },{
            id: 12,
            name: "12",
            path: "/rehab/assessment",
            icon: "AccessibleIcon",
            children: [],
          },{
            id: 13,
            name: "13",
            path: "/rehab/training",
            icon: "AccessibleIcon",
            children: [],
          }
        ],
      }, {
        id: 2,
        name: "用户",
        path: "/rehab/staff",
        icon: "AccessibleIcon",
        children: [
          {
            id: 21,
            name: "21",
            path: "/rehab/rehabilitation/",
            icon: "AccessibleIcon",
            children: [],
          }
        ],
      },
      {
        id: 3,
        name: "统计",
        path: "/rehab/equipment",
        icon: "AccessibilityIcon",
        children: [],
      },
      {
        id: 4,
        name: "配置",
        path: "/rehab/config",
        icon: "AccessibleIcon",
        children: [],
      },
    ],
    'msg': '调用成功'
  });

  resp.headers.set('Content-Type', 'application/json; charset=utf-8');
  return resp;
}
