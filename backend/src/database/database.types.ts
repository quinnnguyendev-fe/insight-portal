import type postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from '../prisma/contract.d.ts';

export type Database = ReturnType<typeof postgres<Contract>>;