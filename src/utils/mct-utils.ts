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
