
import { Participant, ShiftType } from './types';

export const SHIFT_HOURS = {
  MORNING: { start: 6, end: 14 },
  AFTERNOON: { start: 14, end: 22 },
  NIGHT: { start: 22, end: 6 }
};

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    role: 'Presidente',
    sector: 'Manutenção',
    photo: 'https://picsum.photos/seed/carlos/300/300',
    shift: ShiftType.MORNING,
    extension: '4501'
  },
  {
    id: '2',
    name: 'Ana Silva',
    role: 'Vice-Presidente',
    sector: 'RH',
    photo: 'https://picsum.photos/seed/ana/300/300',
    shift: ShiftType.MORNING,
    extension: '4502'
  },
  {
    id: '3',
    name: 'Roberto Santos',
    role: 'Secretário',
    sector: 'Logística',
    photo: 'https://picsum.photos/seed/roberto/300/300',
    shift: ShiftType.AFTERNOON,
    extension: '4503'
  },
  {
    id: '4',
    name: 'Juliana Lima',
    role: 'Membro Titular',
    sector: 'Produção',
    photo: 'https://picsum.photos/seed/juliana/300/300',
    shift: ShiftType.AFTERNOON,
    extension: '4504'
  },
  {
    id: '5',
    name: 'Marcos Souza',
    role: 'Suplente',
    sector: 'Segurança do Trabalho',
    photo: 'https://picsum.photos/seed/marcos/300/300',
    shift: ShiftType.NIGHT,
    extension: '4505'
  },
  {
    id: '6',
    name: 'Fernanda Rocha',
    role: 'Membro Titular',
    sector: 'Qualidade',
    photo: 'https://picsum.photos/seed/fernanda/300/300',
    shift: ShiftType.NIGHT,
    extension: '4506'
  },
  {
    id: '7',
    name: 'Paulo Vieira',
    role: 'Suplente',
    sector: 'Almoxarifado',
    photo: 'https://picsum.photos/seed/paulo/300/300',
    shift: ShiftType.MORNING,
    extension: '4507'
  },
  {
    id: '8',
    name: 'Beatriz Costa',
    role: 'Membro Titular',
    sector: 'Produção II',
    photo: 'https://picsum.photos/seed/beatriz/300/300',
    shift: ShiftType.AFTERNOON,
    extension: '4508'
  }
];
