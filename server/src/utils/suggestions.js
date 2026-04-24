export const suggestWorkout = (distance, avgDistance) => {
  if (distance === 0) {
    return "Start with a light stamina session and focus on active recovery.";
  }
  if (distance < avgDistance) {
    return "Increase stamina training with interval runs and endurance drills.";
  }
  if (distance < avgDistance * 1.2) {
    return "Add a sprint session to build speed and maintain your progress.";
  }
  return "Great work — reinforce recovery and strength to keep your fitness growing.";
};
