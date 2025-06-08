import {
  IsDateString,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class FilterAttendanceDto {
  @IsOptional()
  @IsNumberString()
  employeeId?: number;

  @IsOptional()
  @IsDateString()
  checkInTimeFrom?: Date;

  @IsOptional()
  @IsDateString()
  checkInTimeTo?: Date;

  @IsOptional()
  @IsDateString()
  checkOutTimeFrom?: Date;

  @IsOptional()
  @IsDateString()
  checkOutTimeTo?: Date;

  @IsOptional()
  @IsNumber()
  totalWorkingSecondsMin?: number;

  @IsOptional()
  @IsNumberString()
  totalWorkingSecondsMax?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsNumberString()
  offset?: number;
}
