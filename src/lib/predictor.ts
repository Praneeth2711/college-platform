// Predictor logic - rule-based college suggestions from exam + rank
export interface PredictionInput {
  exam: string;
  rank: number;
}

export interface PredictionRule {
  exam: string;
  minRank: number;
  maxRank: number;
  collegeTypes: string[];
  minRating: number;
  maxFees?: number;
}

// Rule-based mapping: exam + rank range → college filters
export const predictionRules: PredictionRule[] = [
  // JEE Advanced - Top Ranks
  { exam: "JEE Advanced", minRank: 1, maxRank: 500, collegeTypes: ["Government"], minRating: 4.8 },
  { exam: "JEE Advanced", minRank: 501, maxRank: 2000, collegeTypes: ["Government"], minRating: 4.6 },
  { exam: "JEE Advanced", minRank: 2001, maxRank: 5000, collegeTypes: ["Government"], minRating: 4.4 },
  { exam: "JEE Advanced", minRank: 5001, maxRank: 10000, collegeTypes: ["Government"], minRating: 4.2 },
  { exam: "JEE Advanced", minRank: 10001, maxRank: 50000, collegeTypes: ["Government", "Private"], minRating: 3.5 },

  // JEE Main
  { exam: "JEE Main", minRank: 1, maxRank: 1000, collegeTypes: ["Government"], minRating: 4.5 },
  { exam: "JEE Main", minRank: 1001, maxRank: 5000, collegeTypes: ["Government"], minRating: 4.3 },
  { exam: "JEE Main", minRank: 5001, maxRank: 15000, collegeTypes: ["Government"], minRating: 4.0 },
  { exam: "JEE Main", minRank: 15001, maxRank: 50000, collegeTypes: ["Government", "Private"], minRating: 3.8 },
  { exam: "JEE Main", minRank: 50001, maxRank: 200000, collegeTypes: ["Private"], minRating: 3.5 },

  // BITSAT
  { exam: "BITSAT", minRank: 1, maxRank: 1000, collegeTypes: ["Private"], minRating: 4.5 },
  { exam: "BITSAT", minRank: 1001, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.0 },
  { exam: "BITSAT", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 3.5 },

  // VITEEE
  { exam: "VITEEE", minRank: 1, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.3 },
  { exam: "VITEEE", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 4.0 },
  { exam: "VITEEE", minRank: 20001, maxRank: 100000, collegeTypes: ["Private"], minRating: 3.5 },

  // SRMJEE
  { exam: "SRMJEE", minRank: 1, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.0 },
  { exam: "SRMJEE", minRank: 5001, maxRank: 30000, collegeTypes: ["Private"], minRating: 3.5 },

  // State CET
  { exam: "State CET", minRank: 1, maxRank: 1000, collegeTypes: ["Government", "Private"], minRating: 4.3 },
  { exam: "State CET", minRank: 1001, maxRank: 5000, collegeTypes: ["Government", "Private"], minRating: 4.0 },
  { exam: "State CET", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 3.5 },
];

export function findMatchingRule(exam: string, rank: number): PredictionRule | null {
  return predictionRules.find(
    (rule) => rule.exam === exam && rank >= rule.minRank && rank <= rule.maxRank
  ) || null;
}
