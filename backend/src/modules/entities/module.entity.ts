import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserSubscription } from "../../subscriptions/entities/user-subscription.entity";

@Entity("modules")
export class ModuleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column("simple-json")
  features: { name: string; included: boolean }[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => UserSubscription, (subscription) => subscription.module)
  subscriptions: UserSubscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
