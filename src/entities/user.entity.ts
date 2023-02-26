import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export default class Users {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public username: string

  @Column()
  public grant: string

  @CreateDateColumn()
  public createdDate: Date

  @UpdateDateColumn()
  public updatedDate: Date
}
