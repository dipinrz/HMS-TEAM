import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Status {
    READ = "read",
    UNREAD = 'unread'

}
enum Type {
    APPOINTMENT = "appointment",
    BILL = "bill",
    NONE = 'none'
}
@Entity()

export class Notification {

    @PrimaryGeneratedColumn()
    id: number


    @CreateDateColumn()
    createdAt: Date

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.UNREAD
    })
    status: Status

    @Column()
    title: string

    @Column({
        type: 'enum',
        enum: Type,
        default: Type.NONE
    })
    type: Type


}