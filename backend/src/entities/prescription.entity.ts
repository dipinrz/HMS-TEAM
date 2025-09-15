import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Appointment } from "./appointment.entity";
import { Medication } from "./medication.entity";

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  prescription_id: number;

  @ManyToOne(() => Appointment, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "appointment_id" })
  appointment: Appointment;

  @Column({ type: "text" })
  diagnosis: string;

  @CreateDateColumn({ name: "prescribed_date" })
  prescribed_date: Date;

  @OneToMany(() => Medication, (medication) => medication.prescription)
    medications: Medication[];
}
