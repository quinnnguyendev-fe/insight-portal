import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ReportsModule } from './reports/reports.module.js';

@Module({
  imports: [DatabaseModule, HealthModule, UsersModule, RolesModule, AuthModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
