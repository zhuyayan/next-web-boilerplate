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
