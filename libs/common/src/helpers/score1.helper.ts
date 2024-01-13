class GameScorer {
  calculateScore(timeInSeconds: number, level: number, tryCount: number, lifeLeftBonus: number): number {
    // Define weights for each factor
    const timeWeight = 0.3;
    const levelWeight = 0.2;
    const tryCountWeight = 0.4;
    const lifeLeftBonusWeight = 0.1;

    // Normalize values within their respective ranges
    const normalizedTime = this.normalizeValue(timeInSeconds, 0, 300); // Assuming max time is 300 seconds
    const normalizedLevel = this.normalizeValue(level, 1, 10); // Assuming levels range from 1 to 10
    const normalizedTryCount = this.normalizeValue(tryCount, 1, 50); // Assuming maximum 50 tries
    const normalizedLifeLeftBonus = this.normalizeValue(lifeLeftBonus, 0, 10); // Assuming maximum 10 life left bonus

    // Calculate the weighted sum
    const weightedSum =
      timeWeight * normalizedTime +
      levelWeight * normalizedLevel +
      tryCountWeight * (1 / normalizedTryCount) + // Invert try count as lower tries are better
      lifeLeftBonusWeight * normalizedLifeLeftBonus;

    // Scale the weighted sum to the desired range (1 to 100)
    const scaledScore = this.scaleValue(weightedSum, 0, 1, 1, 100);

    // Ensure the final score is within the desired range
    return Math.max(1, Math.min(100, scaledScore));
  }

  normalizeValue(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }

  scaleValue(value: number, oldMin: number, oldMax: number, newMin: number, newMax: number): number {
    return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
  }
}

// Example usage
const gameScorer = new GameScorer();
const score = gameScorer.calculateScore(200, 5, 10, 5);
console.log(`Final Score: ${score}`);
