import { Analysis, AnalysisSchema } from './schema/analysis.schema';
import { Image, ImageSchema } from './schema/subtype/images.subtype';
import { Records, RecordsSchema } from './schema/records.schema';
import { Schools, SchoolsSchema } from './schema/schools.schema';
import { Scores, ScoresSchema } from './schema/scores.schema';
import { Users, UsersSchema } from './schema/users.schema';
import { Levels, LevelsSchema } from './schema/levels.schema';

export const MongooseModulesImport = [
  { name: Analysis.name, schema: AnalysisSchema },
  { name: Image.name, schema: ImageSchema },
  { name: Levels.name, schema: LevelsSchema },
  { name: Records.name, schema: RecordsSchema },
  { name: Schools.name, schema: SchoolsSchema },
  { name: Scores.name, schema: ScoresSchema },
  { name: Users.name, schema: UsersSchema },
];
