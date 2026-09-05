import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { Database } from '../database/database.types.js';
import { DATABASE } from '../database/database.constraints.js';
import { RolesService } from '../roles/roles.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,

    private readonly rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.db.orm.public.User.first({
      email: dto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.db.orm.public.User.first({
      username: dto.username,
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const userRole = await this.rolesService.findByName('USER');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.db.orm.public.User.create({
      email: dto.email,
      username: dto.username,
      name: dto.name,
      passwordHash,
      roleId: userRole.id,
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      roleId: user.roleId,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
