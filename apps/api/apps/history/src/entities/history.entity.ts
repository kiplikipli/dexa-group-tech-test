import { WithCreatedUpdatedTimestamp } from 'shared/entities/with-created-update-timestamp.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('histories')
export class History extends WithCreatedUpdatedTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @Column({ name: 'old_employee', type: 'jsonb' })
  oldEmployee: any;

  @Column({ name: 'new_employee', type: 'jsonb' })
  newEmployee: any;

  @Column({ name: 'created_by' })
  createdBy: number;
}
