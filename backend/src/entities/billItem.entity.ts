// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   JoinColumn,
// } from 'typeorm';
// import { Bill } from './bill.entity';
// import { Medication } from './medication.entity';

// export enum FeeType{
//   CONSULTATION_FEE = 'consultation fee',
//   MEDICATION_FEE = 'medication fee'
// }

// @Entity()
// export class BillItem {
//   @PrimaryGeneratedColumn()
//   bill_item_id: number;

//   @ManyToOne(() => Bill, { nullable: false, onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'bill_id' })
//   bill: Bill;

//   @ManyToOne(() => Medication, { nullable: true, onDelete: 'CASCADE' })
//   @JoinColumn({ name: 'medication_id' })
//   medication: Medication;

//   @Column({
//     type: 'enum',
//     enum: FeeType,
//     default: FeeType.CONSULTATION_FEE,
//   })
//   fee_type: FeeType;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   amount: number;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bill } from './bill.entity';
import { Medication } from './medication.entity';

export enum FeeType {
  CONSULTATION_FEE = 'consultation fee',
  MEDICATION_FEE = 'medication fee'
}

@Entity()
export class BillItem {
  @PrimaryGeneratedColumn()
  bill_item_id: number;

  @ManyToOne(() => Bill, (bill) => bill.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bill_id' })
  bill: Bill;

  @ManyToOne(() => Medication, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medication_id' })
  medication: Medication | null;

  @Column({
    type: 'enum',
    enum: FeeType,
  })
  fee_type: FeeType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
}
