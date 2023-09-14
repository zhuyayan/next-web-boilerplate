import moment from 'moment';
export function genderLabelToValue(label:string): string {
  if (label == "男") {
    return "10"
  }
  return "21"
}
export function genderValueToLabel(value: string): string {
  if (value === "10") {
    return "男";
  }
  return "女";
}

export function getDefaultGenderValue(): string {
  return "10"
}

export function getDefaultGenderLabel(): string {
  return "男"
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


export function GetDefaultMedicalStaff() {
  return {
    id: 0,
    username: '',
    password: '',
    fullName: '',
  }
}

export function GetDefaultPatient() {
  return {
    id: 0,
    name: '',
    age: 0,
    gender: '',
    genderLabel: '',
    medicalHistory: '',
    mediaStrokeType:0,
    mediaStrokeLevel:0,
    physician:'',
    physicianId:0,
    i18d:'',
  }
}

export function GetCurrentDateTime():string {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}

export function GetCurrentDate():string {
  return moment().format('YYYY-MM-DD');
}

export function GetOneWeekAgoDateTime():string {
  return moment().subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss');
}

export function GetOneMonthAgoDateTime():string {
  return moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss');
}

export function GetOneYearAgoDateTime():string {
  return moment().subtract(1, 'years').format('YYYY-MM-DD HH:mm:ss');
}

export function GetOneYearAgoDate():string {
  return moment().subtract(1, 'years').format('YYYY-MM-DD');
}
export function GetDefaultPrescription() {
  return {
    id: 0,
    created_at: '',
    part: '',
    mode: '',
    zz: 0,
    u: 0,
    v: 0,
  }
}

export type DateFormat = 'Date' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD \n HH:mm' | 'HH:mm:ss' | 'ISO';

export const formatDate = (date: Date, format: DateFormat): string | Date => {
  switch (format) {
    case 'YYYY-MM-DD HH:mm:ss':
      const YYYY = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, '0');
      const DD = String(date.getDate()).padStart(2, '0');
      const HH = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
    case 'YYYY-MM-DD HH:mm':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    case 'YYYY-MM-DD \n HH:mm':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} \n ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    case 'HH:mm:ss':
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    case 'ISO':
      return date.toISOString();
    case 'Date':
    default:
      return date;
  }
}

export const getRandomDate = (start: string, end: string, format: DateFormat = 'YYYY-MM-DD HH:mm:ss'): string | Date => {
  const startDate = new Date(start.replace(' ', 'T'));
  const endDate = new Date(end.replace(' ', 'T'));

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  if (endTime < startTime) {
    throw new Error('End date must be after start date.');
  }

  const randomTime = startTime + Math.random() * (endTime - startTime);
  const randomDate = new Date(randomTime);
  return formatDate(randomDate, format);
};