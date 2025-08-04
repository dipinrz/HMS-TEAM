import { 
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Prescription } from "./prescription.entity";
import { Medicine } from "./medicine.entity";

@Entity()
export class Medication {
    @PrimaryGeneratedColumn()
    medication_id: number;

    @ManyToOne(() => Prescription, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'prescription_id' })
    prescription: Prescription;

    @ManyToOne(() => Medicine, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'medicine_id' })
    medicine: Medicine;

    @Column({ type: 'varchar', length: 100 })
    dosage: string;

    @Column({ type: 'varchar', length: 100 })
    frequency: string;

    @Column({ type: 'varchar', length: 100 })
    duration: string;

    @Column({ type: 'text', nullable: true })
    instructions: string;
}