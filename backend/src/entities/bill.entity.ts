// import { 
//     Column,
//     CreateDateColumn,
//     Entity, 
//     JoinColumn, 
//     ManyToOne, 
//     OneToMany, 
//     PrimaryGeneratedColumn
// } from "typeorm";
// import { User } from "./user.entity";
// import { Appointment } from "./appointment.entity";
// import { Payment } from "./payment.entity";

// export enum PaymentStatus{
//     PAID = 'paid',
//     UNPAID = 'unpaid'
// }

// @Entity()
// export class Bill {
    
//     @PrimaryGeneratedColumn()
//     bill_id: number;

//     @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
//     @JoinColumn({ name: 'patient_id' })
//     patient: User;

//     @ManyToOne(() => Appointment, { nullable: true, onDelete: 'CASCADE' })
//     @JoinColumn({ name: 'appointment_id' })
//     appointment: Appointment | null;

//     @Column({ type: 'decimal', precision: 10, scale: 2 })
//     total_amount: number;

//     @Column({ type: 'decimal', precision: 10, scale: 2 })
//     tax_amount: number;

//     @Column({
//         type: 'enum',
//         enum: PaymentStatus,
//         default: PaymentStatus.UNPAID,
//     })
//     payment_status: PaymentStatus;

//     @CreateDateColumn()
//         billing_date: Date;

//     @OneToMany(() => Payment, (payment) => payment.bill)
//     payments: Payment[];
// }


import { 
    Column,
    CreateDateColumn,
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";
import { Payment } from "./payment.entity";
import { BillItem } from "./billItem.entity";

export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'unpaid'
}

export enum BillType {
    CONSULTATION = 'consultation',
    MEDICATION = 'medication'
}

@Entity()
export class Bill {
    
    @PrimaryGeneratedColumn()
    bill_id: number;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patient_id' })
    patient: User;

    @ManyToOne(() => Appointment, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appointment_id' })
    appointment: Appointment | null;

    @Column({ type: 'enum', enum: BillType,nullable:true })
    bill_type: BillType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    tax_amount: number;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
    })
    payment_status: PaymentStatus;

    @CreateDateColumn()
    billing_date: Date;

    @OneToMany(() => BillItem, (billItem) => billItem.bill, { cascade: true })
    items: BillItem[];

    @OneToMany(() => Payment, (payment) => payment.bill)
    payments: Payment[];
}
