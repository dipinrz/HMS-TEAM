import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bill } from './bill.entity';
import { Medication } from './medication.entity';

@Entity()
export class BillItem {
  @PrimaryGeneratedColumn()
  bill_item_id: number;

  @ManyToOne(() => Bill, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @ManyToOne(() => Medication, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medication_id' })
  medication: Medication;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
