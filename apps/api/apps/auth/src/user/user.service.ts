import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';
import { TAuthorizedUserRequest } from 'types/services/request';
import { TCreateEmployeePayload } from 'apps/employee/src/employee/types/create-employee-payload.type';
import { AuthConfigService } from '@app/app-config/auth-config.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly authConfigService: AuthConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { role: true },
    });

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        role: true,
      },
    });

    return user;
  }

  async createEmployeeUser(
    user: TCreateEmployeePayload,
    createdBy: TAuthorizedUserRequest,
  ): Promise<User> {
    const employeeRole = await this.roleService.findByKey('employee');
    if (!employeeRole) {
      throw new Error('Employee role not found');
    }

    const creator = await this.findById(createdBy.userId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const duplicateEmailUser = await this.findByEmail(user.email);
    if (duplicateEmailUser) {
      throw new BadRequestException('Email already exists');
    }

    const parsedUser: Omit<User, 'id' | 'latestRefreshToken'> = {
      email: user.email,
      password: bcrypt.hashSync(this.authConfigService.defaultUserPassword, 10),
      role: employeeRole,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: creator,
    };

    const newUser = await this.userRepository.save(parsedUser);
    return newUser;
  }

  async updatePassword(id: number, hashedPassword: string): Promise<User> {
    const updatedData = {
      password: hashedPassword,
    };
    await this.userRepository.update(id, updatedData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('User not found after updating');
    }

    return updatedUser;
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    const updatedData = {
      latestRefreshToken: bcrypt.hashSync(refreshToken, 10),
    };
    await this.userRepository.update(id, updatedData);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('User not found after updating');
    }

    return updatedUser;
  }

  async emptyRefreshToken(userId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(
      {
        id: userId,
      },
      {
        latestRefreshToken: null,
      },
    );

    return user;
  }
}
