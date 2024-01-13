class GameScorer2 {
  calculateScore(timeInSeconds: number, level: number, tryCount: number, lifeLeftBonus: number): number {
    // Define weights for each factor
    const timeWeight = 0.4;
    const levelWeight = 0.3;
    const tryCountWeight = 0.2;
    const lifeLeftBonusWeight = 0.1;

    // Normalize values within their respective ranges using a custom normalization function
    const normalizedTime = this.customNormalize(timeInSeconds, 0, 600); // Assuming max time is 600 seconds
    const normalizedLevel = this.customNormalize(level, 1, 15); // Assuming levels range from 1 to 15
    const normalizedTryCount = this.customNormalize(tryCount, 1, 30); // Assuming maximum 30 tries
    const normalizedLifeLeftBonus = this.customNormalize(lifeLeftBonus, 0, 5); // Assuming maximum 5 life left bonus

    // Calculate the weighted sum
    const weightedSum =
      (1 - timeWeight * normalizedTime) +
      levelWeight * normalizedLevel +
      tryCountWeight * (1 / (normalizedTryCount + 1)) + // Invert and add 1 to try count for better weight distribution
      lifeLeftBonusWeight * normalizedLifeLeftBonus;

    // Scale the weighted sum to the desired range (1 to 100)
    const scaledScore = this.scaleValue(weightedSum, 0, 1, 1, 100);

    // Ensure the final score is within the desired range
    return Math.max(1, Math.min(100, scaledScore));
  }

  customNormalize(value: number, min: number, max: number): number {
    // Custom normalization to handle non-linear scaling
    return Math.pow((value - min) / (max - min), 2);
  }

  scaleValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }
}

// Example usage
const gameScorer2 = new GameScorer();
const score2 = gameScorer.calculateScore(300, 8, 20, 3);
console.log(`Final Score: ${score2}`);
