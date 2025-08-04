import { 
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Medication } from "./medication.entity";

@Entity()
export class Medicine {
    @PrimaryGeneratedColumn()
    medicine_id: number;

    @Column({ type: 'varchar', length: 255 })
    medicine_name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    cost: number;

    @OneToMany(() => Medication, (medication) => medication.medicine)
    medications: Medication[];
}