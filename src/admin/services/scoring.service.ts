import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { User } from "@app/common/model/schema/users.schema";
import { ResponseService } from "@app/common/response/response.service";
import { StringHelper } from "@app/common/helpers/string.helpers";
import { IScore, Score } from "@app/common/model/schema/scores.schema";
import { Game } from "@app/common/model/schema/game.schema";
import { leaderboardPipeline } from "@app/common/pipeline/leaderboard.pipeline";
import { School } from "@app/common/model/schema/schools.schema";
import { scorePipeline } from "@app/common/pipeline/score.pipeline";
import { LogsService } from "./log.service";
import { TargetLogEnum } from "@app/common/enums/log.enum";

@Injectable()
export class ScoreAdminService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(School.name) private schoolModel: Model<School>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
    @Inject(LogsService) private readonly logsService: LogsService,
  ) { }

  private readonly logger = new Logger(ScoreAdminService.name);

  async getScores(userId: string, req: any) {
    const users: User = <User>req.user;
    try {
      const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
      if (!user) throw new HttpException(StringHelper.notFoundResponse('user'), HttpStatus.BAD_REQUEST);

      let result = await this.scoreModel.aggregate(scorePipeline(user._id));

      if (result.length) result.map((item) => {
        item.game = item._id;
        delete item._id;
        return item;
      })

      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} success get score data of ${user?.name}`,
        success: true,
        summary: userId,
      })

      return this.responseService.success(true, StringHelper.successResponse('get', 'score'), result);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} failed get score data`,
        success: false,
        summary: userId,
      })
      this.logger.error(this.getScores.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLeaderboard(gameId: string, req: any) {
    const users: User = <User>req.user;
    try {
      let game = await this.gameModel.findOne({ _id: new Types.ObjectId(gameId) });
      if (!game) throw new HttpException(StringHelper.notFoundResponse('game'), HttpStatus.BAD_REQUEST);

      let scores = await this.scoreModel.aggregate(leaderboardPipeline(game._id))

      let leaderboard = [];
      let result: any = {}
      if (scores?.length) {
        if (users?.school) {
          scores = scores.filter(i => i?._id?.toString() == users?.school?.toString());
          leaderboard = scores[0].scores;

          result = {
            game,
            leaderboard
          }
        } else {
          result = await Promise.all(scores.map(async (item) => {
            let school = await this.schoolModel.findOne({ _id: item?._id }).populate("images")

            return {
              game,
              school,
              leaderboard: item.scores
            }
          }))
        }
      };

      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} success get leaderboard data of game ${game?.name}`,
        success: true,
        summary: gameId,
      })

      return this.responseService.success(true, StringHelper.successResponse("score", 'get'), result);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} failed get leaderboard data of game `,
        success: false,
        summary: gameId,
      })
      this.logger.error(this.getLeaderboard.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getScoresChartData(userId: string, gameId: string, req: any) {
    const users: User = <User>req.user;
    try {
      const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });
      if (!user) throw new HttpException(StringHelper.notFoundResponse('user'), HttpStatus.BAD_REQUEST);

      let result: any = await this.scoreModel.aggregate(scorePipeline(user._id));

      result = result.filter(i => i?._id?._id?.toString() === gameId)[0]
      if (!result) return this.responseService.success(true, StringHelper.successResponse('get', 'score'), []);

      result.game = result?._id;
      delete result?._id;

      result.scores = this.groupScoresByGamePlayed(result.scores);
      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} success get scores chart data of user ${user?.name}`,
        success: true,
        summary: gameId,
      })

      return this.responseService.success(true, StringHelper.successResponse('get', 'score'), result);
    } catch (error) {
      await this.logsService.logging({
        target: TargetLogEnum.SCORE,
        description: `${users?.name} failed get scores chart data of user`,
        success: false,
        summary: gameId,
      })
      this.logger.error(this.getLeaderboard.name);
      console.log(error?.message);
      throw new HttpException(error?.response ?? error?.message ?? error, error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private groupScoresByGamePlayed(scores: IScore[]): IScore[][] {
    const groupedScores: IScore[][] = [];

    const scoresMap = new Map<number, IScore[]>();

    scores.forEach(score => {
      const gamePlayed = score.gamePlayed;

      if (!scoresMap.has(gamePlayed)) {
        scoresMap.set(gamePlayed, []);
      }

      scoresMap.get(gamePlayed)?.push(score);
    });

    scoresMap.forEach((scoresForGamePlayed) => {
      groupedScores.push(scoresForGamePlayed);
    });

    return groupedScores;
  }
}
