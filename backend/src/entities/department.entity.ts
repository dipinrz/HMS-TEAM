import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  department_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consultation_fee: number;

  @OneToOne(() => Doctor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'head_doctor_id' })
  head_doctor: Doctor;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Doctor, (doctor) => doctor.department)
  doctors: Doctor[];
}
