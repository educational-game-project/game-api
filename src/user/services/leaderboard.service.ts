import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Score } from '@app/common/model/schema/scores.schema';
import { StringHelper } from '@app/common/helpers/string.helpers';
import { User } from '@app/common/model/schema/users.schema';
import { ResponseService } from '@app/common/response/response.service';
import { Record } from '@app/common/model/schema/records.schema';
import { ByGameIdDTO } from '@app/common/dto/game.dto';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(Record.name) private recordModel: Model<Record>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(ResponseService) private readonly responseService: ResponseService,
  ) { }

  private readonly logger = new Logger(LeaderboardService.name);

  async getLeaderboard(body: ByGameIdDTO, req: any): Promise<any> {
    const users: User = <User>req.user;
    try {
      // Calculate the start and end of the day
      const startDate = new Date();
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setUTCHours(23, 59, 59, 999);

      // Fetch scores for the specified game and day
      const scores = await this.scoreModel.find({
        game: new Types.ObjectId(body.gameId),
        createdAt: { $gte: startDate, $lte: endDate },
        "user.school": new Types.ObjectId(users.school.toString())
      })
        .populate('user');

      // Group scores by user
      const userScoresMap = new Map<string, number[]>();

      scores.forEach((score) => {
        const userId = score.user._id.toString();
        const levelScore = score.level || 0;
        const userScores = userScoresMap.get(userId) || [];
        userScores.push(levelScore);
        userScoresMap.set(userId, userScores);
      });

      // Calculate the final score (average of levels) for each user
      const leaderboard = [];
      userScoresMap.forEach((scores, userId) => {
        const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        leaderboard.push({ userId, averageScore });
      });

      // Sort the leaderboard based on the final score in descending order
      leaderboard.sort((a, b) => b.averageScore - a.averageScore);

      return this.responseService.success(true, StringHelper.successResponse('leaderboard', 'get_service'), leaderboard);
    } catch (error) {
      this.logger.error(this.getLeaderboard.name);
      console.log(error?.message);
      return this.responseService.error(HttpStatus.INTERNAL_SERVER_ERROR, StringHelper.internalServerError, { value: error, constraint: "", property: "" });
    }
  }
}
