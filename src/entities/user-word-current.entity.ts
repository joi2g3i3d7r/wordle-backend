import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_word_current')
export default class UserWordCurrent {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @Column({
    type: "uuid",
  })
  public userId: string

  @Column()
  public wordId: number

  @CreateDateColumn()
  public createdDate: Date

  @UpdateDateColumn()
  public updatedDate: Date
}
