import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ReportsService } from './reports.service.js';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  create(
    @Request() req: any,
    @Body()
    body: {
      title: string;
      description?: string;
    },
  ) {
    return this.reportsService.create(
      req.user.id,
      body.title,
      body.description,
    );
  }

  @Get()
  findAll(@Request() req: any) {
    return this.reportsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.reportsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      title?: string;
      description?: string;
      status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    },
  ) {
    return this.reportsService.update(req.user.id, id, body);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.reportsService.remove(req.user.id, Number(id));
  }
}
