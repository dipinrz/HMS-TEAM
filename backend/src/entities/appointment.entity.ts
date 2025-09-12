import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Department } from './department.entity';
import { MedicalReport } from './medicalReport.entity';
import { boolean } from 'joi';

export enum AppointmentStatus {
  INITIATED = 'initiated', 
  SCHEDULED = 'scheduled',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: User;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: User;

  @ManyToOne(() => Department, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'timestamp' })
  appointment_date: Date;

  @ManyToOne(() => MedicalReport, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_report_id' })
  medical_report_id: MedicalReport

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.INITIATED,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  reason_for_visit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({type:'boolean',default:false})
  reminder_send:boolean;
}
