
export enum ShiftType {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde',
  NIGHT = 'Noite',
  OFF = 'Folga'
}

export interface Participant {
  id: string;
  name: string;
  role: string;
  sector: string;
  photo: string;
  shift: ShiftType;
  extension?: string;
}

export interface SafetyTip {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
}
