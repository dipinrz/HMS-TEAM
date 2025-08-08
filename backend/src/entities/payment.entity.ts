import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";
import { Bill } from "./bill.entity";

@Entity()
export class Payment {
    
    @PrimaryGeneratedColumn()
    payment_id: number;

    @ManyToOne(() => Bill, (bill) => bill.payments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bill_id' })
    bill: Bill;

    @Column()
    email: string;

    @Column()
    contact: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount_paid: number;

    @Column({ type: 'varchar', length: 100 })
    payment_method: string;

    @Column({ type: 'varchar', length: 255 })
    transaction_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    razorpay_order_id: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    razorpay_signature: string;

    @Column({ type: 'boolean', default: false })
    verified: boolean;

    @CreateDateColumn()
    payment_date: Date;
}
