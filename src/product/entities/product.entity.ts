import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({type: 'text'})
    description: string;

    @Column({type: 'numeric'})
    price: number;

    @Column()
    stock: number;

    @Column({type: 'bytea'})
    image: Buffer;

    @Column({name: 'is_active', default: true})
    isActive: boolean;

    @CreateDateColumn({name: "created_at"})
    createdAt: string;

    @UpdateDateColumn({name:"updated_at"})
    updatedAt: string;

    @DeleteDateColumn({name: "deleted_at"})
    deletedAt: string;
}
