import { MachineType, MachineStatus, Prisma } from '@prisma/client';

export const machines: Prisma.MachineCreateInput[] = [
  {
    name: 'HP Latex 370',
    type: MachineType.PLOTTER_LATEX,
    status: MachineStatus.IDLE,
    speedM2PerHour: 12,
    active: true,
  },
  {
    name: 'Roland VersaCAMM',
    type: MachineType.PLOTTER_SOLVENT,
    status: MachineStatus.IDLE,
    speedM2PerHour: 10,
    active: true,
  },
  {
    name: 'GMP Excelam Q6',
    type: MachineType.LAMINATOR,
    status: MachineStatus.IDLE,
    speedM2PerHour: 15,
    active: true,
  },
  {
    name: 'Summa S2 T160',
    type: MachineType.CUTTER,
    status: MachineStatus.IDLE,
    speedM2PerHour: 20,
    active: true,
  },
];
