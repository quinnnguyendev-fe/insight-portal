import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { DATABASE } from '../database/database.constraints.js';
import type { Database } from '../database/database.types.js';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}
  async onModuleInit() {
    await this.seed();
  }

  async findByName(name: 'ADMIN' | 'USER') {
    const role = await this.db.orm.public.Role.first({
      name,
    });

    if (!role) {
      throw new Error(`Role "${name}" not found`);
    }

    return role;
  }

  private async seed() {
    await this.db.orm.public.Role.upsert({
      create: {
        name: 'ADMIN',
      },
      update: {},
      conflictOn: {
        name: 'ADMIN',
      },
    });

    await this.db.orm.public.Role.upsert({
      create: {
        name: 'USER',
      },
      update: {},
      conflictOn: {
        name: 'USER',
      },
    });
  }
}
