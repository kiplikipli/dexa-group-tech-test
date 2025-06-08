import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckInDto {
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}
