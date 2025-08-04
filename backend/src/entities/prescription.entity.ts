import { 
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
 } from "typeorm";
import { Appointment } from "./appointment.entity";


@Entity()
export class Prescription {
    @PrimaryGeneratedColumn()
    prescription_id: number;

    @ManyToOne(() => Appointment, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appointment_id' })
    appointment_id: Appointment;

    @Column({ type: 'text' })
    diagnosis: string;

    @CreateDateColumn({ name: 'prescribed_date' })
    prescribed_date: Date;
}   