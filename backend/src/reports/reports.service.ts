import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Database } from '../database/database.types.js';
import { DATABASE } from '../database/database.constraints.js';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async create(userId: number, title: string, description?: string) {
    return this.db.orm.public.Report.create({
      title,
      description,
      createdBy: userId,
    });
  }

  async findAll(userId: number) {
    return this.db.orm.public.Report.where({
      createdBy: userId,
    }).all();
  }

  async findOne(userId: number, reportId: number) {
    const report = await this.db.orm.public.Report.first({
      id: reportId,
      createdBy: userId,
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async update(
    userId: number,
    reportId: number,
    data: {
      title?: string;
      description?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    },
  ) {
    await this.findOne(userId, reportId);

    return this.db.orm.public.Report.where({
      id: reportId,
      createdBy: userId,
    }).update(data);
  }

  async remove(userId: number, reportId: number) {
    await this.findOne(userId, reportId);

    return this.db.orm.public.Report.where({
      id: reportId,
      createdBy: userId,
    }).delete();
  }
}
