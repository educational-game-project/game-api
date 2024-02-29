import { Image, ImageSchema } from "./schema/subtype/images.subtype";
import { Record, RecordSchema } from "./schema/records.schema";
import { School, SchoolSchema } from "./schema/schools.schema";
import { Score, ScoreSchema } from "./schema/scores.schema";
import { User, UserSchema } from "./schema/users.schema";
import { Level, LevelSchema } from "./schema/levels.schema";
import { Game, GameSchema } from "./schema/game.schema";

export const MongooseModulesImport = [
  { name: Game.name, schema: GameSchema },
  { name: Image.name, schema: ImageSchema },
  { name: Level.name, schema: LevelSchema },
  { name: Record.name, schema: RecordSchema },
  { name: School.name, schema: SchoolSchema },
  { name: Score.name, schema: ScoreSchema },
  { name: User.name, schema: UserSchema },
];
