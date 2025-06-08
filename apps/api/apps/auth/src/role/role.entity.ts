import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { WithCreatedUpdatedTimestamp } from 'shared/entities/with-created-update-timestamp.entity';

@Entity('roles')
export class Role extends WithCreatedUpdatedTimestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  key: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
