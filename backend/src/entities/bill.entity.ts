import { 
    Column,
    CreateDateColumn,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";

export enum PaymentStatus{
    PAID = 'paid',
    UNPAID = 'unpaid'
}

@Entity()
export class Bill{
    @PrimaryGeneratedColumn()
    bill_id: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patient_id' })
    patient: User;

    @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment | null;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    total_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    tax_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2})
    paid_amount: number;

    @Column({ 
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID
    })
    payment_status: PaymentStatus;

    @CreateDateColumn()
    billing_date: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    payment_method: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    transaction_id: string | null;
}