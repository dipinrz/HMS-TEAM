import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';

@Entity()
export class Doctor {
  @PrimaryColumn()
  doctor_id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  user: User;

  @Column()
  specialization: string;

  @Column()
  qualification: string;

  @Column()
  license_number: string;

  @Column('int')
  years_of_experience: number;

  @ManyToOne(() => Department, (department) => department.doctors, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'department_id' })
  department: Department | null;
}
