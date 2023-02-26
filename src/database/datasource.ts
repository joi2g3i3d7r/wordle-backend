import { DataSource } from "typeorm";
import { Database } from "../config";
import UserWordCurrent from "../entities/user-word-current.entity";
import UserWordTrace from "../entities/user-word-trace.entity";
import Users from "../entities/user.entity";
import Words from "../entities/word.entity";

const PostgresDataSource = new DataSource({
    type: "postgres",
    host: Database.host,
    port: Database.port,
    username: Database.username,
    password: Database.password,
    database: Database.name,
    // logging: true,
    entities: [
        Users,
        Words,
        UserWordCurrent,
        UserWordTrace,
    ],
    synchronize: true,
})

export default PostgresDataSource;
