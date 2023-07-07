export function genderLabelToValue(label:string): string {
  if (label == "男") {
    return "10"
  }
  return "21"
}
export function getDefaultGenderValue(): string {
  return "10"
}

export function getDefaultGenderLabel(): string {
  return "10"
}

export function timeSampleFormat(time: string): string {
  let date = new Date(time);  // 或者任何日期对象

  let year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');
  let hour = date.getHours().toString().padStart(2, '0');
  let minute = date.getMinutes().toString().padStart(2, '0');
  let second = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export const NumToBodyPartMapping: { [key: string]: number } = {
  "左手": 1,
  "右手": 2,
  "左腕": 3,
  "右腕": 4,
  "左踝": 5,
  "右踝": 6,
  "无效": 0,
};

export const NumToModeMapping: { [key: string]: number } = {
  "被动计次模式": 1,
  "被动定时模式": 2,
  "主动计次模式": 3,
  "主动定时模式": 4,
  "助力计次模式": 5,
  "助力定时模式": 6,
  "手动计次模式": 7,
  "无效": 0,
};

export const NumToStateMapping: { [key: string]: number } = {
  "停止态": 1,
  "暂停态": 2,
  "伸动作态": 3,
  "弯曲动作态": 4,
  "伸保持态": 5,
  "弯曲保持态": 6,
};

export const BodyPartToNumMapping: { [key: number]: string } = {
  1: "左手",
  2: "右手",
  3: "左腕",
  4: "右腕",
  5: "左踝",
  6: "右踝",
  0: "无效",
};

export const ModeToNumMapping: { [key: number]: string } = {
  1: "被动计次模式",
  2: "被动定时模式",
  3: "主动计次模式",
  4: "主动定时模式",
  5: "助力计次模式",
  6: "助力定时模式",
  7: "手动计次模式",
  0: "无效",
};

export const StateToNumMapping: { [key: number]: string } = {
  1: "停止态",
  2: "暂停态",
  3: "伸动作态",
  4: "弯曲动作态",
  5: "伸保持态",
  6: "弯曲保持态",
};
