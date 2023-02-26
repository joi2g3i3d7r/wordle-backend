import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_word_trace')
export default class UserWordTrace {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({
    type: "uuid",
  })
  public userId: string

  @Column()
  public wordId: number

  @Column()
  public tries: number

  @Column({
    type: "boolean",
    default: false
  })
  public guess: boolean

  @CreateDateColumn()
  public createdDate: Date

  @UpdateDateColumn()
  public updatedDate: Date
}
