import { WithCreatedUpdatedTimestamp } from 'shared/entities/with-created-update-timestamp.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('employees')
export class Employee extends WithCreatedUpdatedTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ name: 'job_title' })
  jobTitle: string;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];
}
