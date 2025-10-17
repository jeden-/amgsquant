import { MachineType, MachineStatus, Prisma } from '@prisma/client';

export const machines: Prisma.MachineCreateInput[] = [
  {
    name: 'Plotter Latex HP 1',
    type: MachineType.PLOTTER_LATEX,
    status: MachineStatus.IDLE,
    speedM2PerHour: 25.0,
    maintenanceHours: 0,
    active: true,
  },
  {
    name: 'Plotter Solvent HP 2',
    type: MachineType.PLOTTER_SOLVENT,
    status: MachineStatus.IDLE,
    speedM2PerHour: 20.0,
    maintenanceHours: 0,
    active: true,
  },
  {
    name: 'Laminator 1',
    type: MachineType.LAMINATOR,
    status: MachineStatus.IDLE,
    speedM2PerHour: 50.0,
    maintenanceHours: 0,
    active: true,
  },
  {
    name: 'Ploter tnący 1',
    type: MachineType.CUTTER,
    status: MachineStatus.IDLE,
    speedM2PerHour: 30.0,
    maintenanceHours: 0,
    active: true,
  },
];
