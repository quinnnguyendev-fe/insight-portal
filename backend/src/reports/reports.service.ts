import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Database } from '../database/database.types.js';
import { DATABASE } from '../database/database.constraints.js';
import { or } from '@prisma/orm-postgres/orm-client';

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

  async findAll(
    userId: number,
    search?: string,
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    page = 1,
    limit = 10,
  ) {
    const normalizedStatus = status?.toUpperCase() as
      'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | undefined;

    let query = this.db.orm.public.Report.where({
      createdBy: userId,
    });

    if (search?.trim()) {
      const keyword = `%${search.trim()}%`;

      query = query.where((report) =>
        or(report.title.ilike(keyword), report.description.ilike(keyword)),
      );
    }

    if (normalizedStatus) {
      query = query.where({
        status: normalizedStatus,
      });
    }

    if (status) {
      query = query.where({
        status: status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      });
    }

    const allReports = await query.all();
    const total = allReports.length;

    const reports = await query
      .orderBy((report) => report.createdAt.desc())
      .offset((page - 1) * limit)
      .limit(limit)
      .all();

    return {
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getStats(userId: number) {
    const reports = await this.db.orm.public.Report.where({
      createdBy: userId,
    }).all();

    return {
      total: reports.length,
      draft: reports.filter((report) => report.status === 'DRAFT').length,
      published: reports.filter((report) => report.status === 'PUBLISHED')
        .length,
      archived: reports.filter((report) => report.status === 'ARCHIVED').length,
    };
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
