import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, } from "mongoose";
import { Game } from "../model/schema/game.schema";

@Injectable()
export class ScoreCalculateHelper {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
  ) { }

  // Define weights for each factor
  private readonly timeWeight = 0.4;
  private readonly levelWeight = 0.3;
  private readonly tryCountWeight = 0.2;
  private readonly lifeLeftBonusWeight = 0.1;

  public async calculateScore(gameId: any, data: { timeInSeconds: number, level: number, tryCount: number, lifeLeftBonus: number }): Promise<number> {
    let game = await this.gameModel.findOne({ _id: gameId });
    if (!game) return -1;

    // Normalize values within their respective ranges using a custom normalization function
    const normalizedTime = this.customNormalize(data.timeInSeconds, 0, game?.maxTime ?? 60); // Assuming max time is 600 seconds
    const normalizedLevel = this.customNormalize(data.level, 1, game?.maxLevel ?? 3); // Assuming levels range from 1 to 3
    const normalizedTryCount = this.customNormalize(data.tryCount, 1, game?.maxRetry ?? 3); // Assuming maximum 3 tries
    const normalizedLifeLeftBonus = this.customNormalize(data.lifeLeftBonus, 0, game?.maxRetry ?? 3); // Assuming maximum 3 life left bonus

    // Calculate the weighted sum
    const weightedSum =
      (1 - this.timeWeight * normalizedTime) +
      this.levelWeight * normalizedLevel +
      this.tryCountWeight * (1 / (normalizedTryCount + 1)) + // Invert and add 1 to try count for better weight distribution
      this.lifeLeftBonusWeight * normalizedLifeLeftBonus;

    // Scale the weighted sum to the desired range (1 to 100)
    const scaledScore = this.scaleValue(weightedSum, 0, 1, 1, 100);

    // Ensure the final score is within the desired range
    return Math.max(0, Math.min(100, scaledScore));
  }

  private customNormalize(value: number, min: number, max: number): number {
    // Custom normalization to handle non-linear scaling
    return Math.pow((value - min) / (max - min), 2);
  }

  private scaleValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }
}
