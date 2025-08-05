import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class MedicalReport {
  @PrimaryGeneratedColumn()
  record_id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: User;


  @Column({ type: 'text' })
  notes: string;
}
