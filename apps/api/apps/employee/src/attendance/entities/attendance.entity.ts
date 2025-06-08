import { WithCreatedUpdatedTimestamp } from 'shared/entities/with-created-update-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('attendances')
export class Attendance extends WithCreatedUpdatedTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.attendances)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'check_in_time', type: 'timestamptz' })
  checkInTime: string;

  @Column({ name: 'check_out_time', nullable: true, type: 'timestamptz' })
  checkOutTime: string;

  @Column({ name: 'total_working_seconds', nullable: true })
  totalWorkingSeconds: number;
}
