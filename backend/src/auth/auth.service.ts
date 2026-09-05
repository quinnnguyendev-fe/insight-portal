import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Database } from '../database/database.types.js';
import bcrypt from 'bcrypt';
import { DATABASE } from '../database/database.constraints.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(DATABASE)
        private readonly db: Database,
        private readonly jwtService: JwtService
    ) {}

    async login(email: string, password: string) {
        const user = await this.db.orm.public.User.first({
            email
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { 
            sub: user.id, 
            email: user.email,
            role: user.roleId
        };

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.roleId
            }
        };
    }
}
