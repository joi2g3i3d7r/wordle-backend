import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('words')
export default class Word {
  @PrimaryGeneratedColumn("increment")
  public id!: number;

  @Index()
  @Column()
  public word: string

  @CreateDateColumn()
  public createdDate!: Date

  @UpdateDateColumn()
  public updatedDate!: Date
}
