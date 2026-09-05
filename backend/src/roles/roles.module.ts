import { Module } from '@nestjs/common';
import { RolesService } from './roles.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
