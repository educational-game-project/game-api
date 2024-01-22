import { Injectable } from "@nestjs/common";

@Injectable()
export class ScoreCalculate {
  // Define weights for each factor
  private readonly timeWeight = 0.4;
  private readonly levelWeight = 0.3;
  private readonly tryCountWeight = 0.2;
  private readonly lifeLeftBonusWeight = 0.1;

  public calculateScore(timeInSeconds: number, level: number, tryCount: number, lifeLeftBonus: number): number {
    // Normalize values within their respective ranges using a custom normalization function
    const normalizedTime = this.customNormalize(timeInSeconds, 0, 600); // Assuming max time is 600 seconds
    const normalizedLevel = this.customNormalize(level, 1, 3); // Assuming levels range from 1 to 3
    const normalizedTryCount = this.customNormalize(tryCount, 1, 3); // Assuming maximum 3 tries
    const normalizedLifeLeftBonus = this.customNormalize(lifeLeftBonus, 0, 3); // Assuming maximum 3 life left bonus

    // Calculate the weighted sum
    const weightedSum =
      (1 - this.timeWeight * normalizedTime) +
      this.levelWeight * normalizedLevel +
      this.tryCountWeight * (1 / (normalizedTryCount + 1)) + // Invert and add 1 to try count for better weight distribution
      this.lifeLeftBonusWeight * normalizedLifeLeftBonus;

    // Scale the weighted sum to the desired range (1 to 100)
    const scaledScore = this.scaleValue(weightedSum, 0, 1, 1, 100);

    // Ensure the final score is within the desired range
    return Math.max(1, Math.min(100, scaledScore));
  }

  private customNormalize(value: number, min: number, max: number): number {
    // Custom normalization to handle non-linear scaling
    return Math.pow((value - min) / (max - min), 2);
  }

  private scaleValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }
}
