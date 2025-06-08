import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { WithCreatedUpdatedTimestamp } from 'shared/entities/with-created-update-timestamp.entity';

@Entity('users')
export class User extends WithCreatedUpdatedTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => User, (user) => user.createdBy)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'latest_refresh_token', type: 'varchar', nullable: true })
  latestRefreshToken: string | null;
}
