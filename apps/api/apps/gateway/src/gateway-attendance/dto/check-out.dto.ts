import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckOutDto {
  @IsNumber()
  @IsNotEmpty()
  employeeId: number;
}
