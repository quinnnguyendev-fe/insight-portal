import { Controller, Get, Inject } from "@nestjs/common";
import { DATABASE } from "../database/database.constraints.js";
import type { Database } from "../database/database.types.js";

@Controller('health')
export class HealthController {

    constructor(
        @Inject(DATABASE) 
        private readonly db: Database
    ) {}
  @Get()
  async check() {
    const roles = await this.db.orm.public.Role.all();

    return {
      status: 'ok',
      database: 'connected',
      rolesCount: roles.length,
    };
  }
}