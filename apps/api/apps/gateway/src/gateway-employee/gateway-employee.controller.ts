import { CommonService } from '@app/utils';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEE_SERVICE } from 'apps/gateway/constants';
import { AuthenticatedGuard } from 'apps/gateway/guards';
import { IsAdminGuard } from 'apps/gateway/guards/is-admin.guard';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Request } from 'express';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { TCreateEmployeePayload } from 'apps/employee/src/employee/types/create-employee-payload.type';
import { TSuccessResponse } from 'types/gateway';
import { Employee } from 'apps/employee/src/employee/entities/employee.entity';

@UseGuards(AuthenticatedGuard)
@Controller('employees')
export class GatewayEmployeeController {
  private readonly logger: Logger = new Logger(GatewayEmployeeController.name);
  constructor(
    @Inject(EMPLOYEE_SERVICE) private client: ClientProxy,
    private readonly commonService: CommonService,
  ) {}

  @UseGuards(IsAdminGuard)
  @Post()
  async createEmployee(
    @Req() req: Request,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    const parsedDto: TCreateEmployeePayload = {
      name: createEmployeeDto.name,
      email: createEmployeeDto.email,
      phone: createEmployeeDto.phone,
      job_title: createEmployeeDto.job_title,
      photo_url: createEmployeeDto.photo_profile,
      authorizedUser: req['user'],
    };

    const payload = this.commonService.injectApiKey({
      ...parsedDto,
    });

    this.logger.log(`calling employee service > createEmployee with payload:`);
    this.logger.log(JSON.stringify(payload));
    const response = await this.commonService.processObservable<
      TSuccessResponse<Employee>
    >(this.client.send('employee.createEmployee', payload));

    return response.data;
  }

  @UseGuards(IsAdminGuard)
  @Get()
  async getEmployees(@Req() req: Request): Promise<any> {
    const authorizedUser = req['user'];
    if (!authorizedUser) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      authorizedUser,
    });
    this.logger.log(`calling employee service > getEmployees`);

    const response = await this.commonService.processObservable<
      TSuccessResponse<Employee[]>
    >(this.client.send('employee.getEmployees', payload));

    return response.data;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('user/:userId')
  async getEmployeeByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<any> {
    const authorizedUser = req['user'];
    if (!authorizedUser) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      userId: parseInt(userId),
      authorizedUser,
    });
    this.logger.log(`calling employee service > findByUserId with payload:`);
    this.logger.log(JSON.stringify(payload));

    const response = await this.commonService.processObservable<
      TSuccessResponse<Employee>
    >(this.client.send('employee.findByUserId', payload));

    return response.data;
  }

  @UseGuards(IsAdminGuard)
  @Get(':id')
  async getEmployee(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const authorizedUser = req['user'];
    if (!authorizedUser) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      employeeId: parseInt(id),
      authorizedUser,
    });
    this.logger.log(`calling employee service > findById with payload:`);
    this.logger.log(JSON.stringify(payload));

    const response = await this.commonService.processObservable(
      this.client.send('employee.findById', payload),
    );

    return response.data;
  }

  @Put('update-profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileData: UpdateEmployeeDto,
  ) {
    const authorizedUser = req['user'];
    if (!authorizedUser) {
      throw new UnauthorizedException();
    }

    const userId = authorizedUser.id;
    const payload = this.commonService.injectApiKey({
      userId,
      update: {
        phone: updateProfileData.phone,
      },
      authorizedUser,
    });

    this.logger.log(`calling employee service > updateProfile with payload:`);
    this.logger.log(JSON.stringify(payload));
    const updateResponse = await this.commonService.processObservable(
      this.client.send('employee.updateProfile', payload),
    );

    return updateResponse.data;
  }

  @UseGuards(IsAdminGuard)
  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateDto: UpdateEmployeeDto,
  ) {
    const authorizedUser = req['user'];
    if (!authorizedUser) {
      throw new UnauthorizedException();
    }

    const payload = this.commonService.injectApiKey({
      employeeId: parseInt(id),
      update: updateDto,
      authorizedUser,
    });
    this.logger.log(`calling employee service > updateEmployee with payload:`);
    this.logger.log(JSON.stringify(payload));

    const response = await this.commonService.processObservable(
      this.client.send('employee.updateEmployee', payload),
    );

    return response.data;
  }
}
