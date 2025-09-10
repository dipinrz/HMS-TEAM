import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    READ = "read",
    UNREAD = "unread",
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    senderId: number; // patient who booked

    @Column()
    receiverId: number; // doctor who receives notification

    @CreateDateColumn()
    createdAt: Date;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.UNREAD,
    })
    status: Status;

    @Column()
    title: string; // e.g. "New Appointment Scheduled"

    @Column({ nullable: true })
    message: string; // e.g. "Reason: Fever, Date: 10 Sep 2025, Time: 1:30 PM"

    @Column({ nullable: true })
    appointmentId: number; // link to the appointment
}
