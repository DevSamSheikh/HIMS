import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { ModuleEntity } from "../../modules/entities/module.entity";

@Entity("user_subscriptions")
export class UserSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  moduleId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: false })
  isTrial: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  promoCode: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => ModuleEntity, (module) => module.subscriptions)
  @JoinColumn({ name: "moduleId" })
  module: ModuleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
