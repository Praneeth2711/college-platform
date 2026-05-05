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
  acceptedExams: string[]; // exams to filter colleges by
}

// Rule-based mapping: exam + rank range → college filters
export const predictionRules: PredictionRule[] = [
  // JEE Advanced - Top Ranks
  { exam: "JEE Advanced", minRank: 1, maxRank: 500, collegeTypes: ["Government"], minRating: 4.8, acceptedExams: ["JEE Advanced"] },
  { exam: "JEE Advanced", minRank: 501, maxRank: 2000, collegeTypes: ["Government"], minRating: 4.6, acceptedExams: ["JEE Advanced"] },
  { exam: "JEE Advanced", minRank: 2001, maxRank: 5000, collegeTypes: ["Government"], minRating: 4.4, acceptedExams: ["JEE Advanced"] },
  { exam: "JEE Advanced", minRank: 5001, maxRank: 10000, collegeTypes: ["Government"], minRating: 4.2, acceptedExams: ["JEE Advanced"] },
  { exam: "JEE Advanced", minRank: 10001, maxRank: 50000, collegeTypes: ["Government", "Private"], minRating: 3.5, acceptedExams: ["JEE Advanced", "JEE Main"] },

  // JEE Main
  { exam: "JEE Main", minRank: 1, maxRank: 1000, collegeTypes: ["Government"], minRating: 4.5, acceptedExams: ["JEE Main"] },
  { exam: "JEE Main", minRank: 1001, maxRank: 5000, collegeTypes: ["Government"], minRating: 4.3, acceptedExams: ["JEE Main"] },
  { exam: "JEE Main", minRank: 5001, maxRank: 15000, collegeTypes: ["Government"], minRating: 4.0, acceptedExams: ["JEE Main"] },
  { exam: "JEE Main", minRank: 15001, maxRank: 50000, collegeTypes: ["Government", "Private"], minRating: 3.8, acceptedExams: ["JEE Main"] },
  { exam: "JEE Main", minRank: 50001, maxRank: 200000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["JEE Main", "State CET"] },

  // BITSAT
  { exam: "BITSAT", minRank: 1, maxRank: 1000, collegeTypes: ["Private"], minRating: 4.5, acceptedExams: ["BITSAT"] },
  { exam: "BITSAT", minRank: 1001, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.0, acceptedExams: ["BITSAT"] },
  { exam: "BITSAT", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["BITSAT"] },

  // VITEEE
  { exam: "VITEEE", minRank: 1, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.3, acceptedExams: ["VITEEE"] },
  { exam: "VITEEE", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 4.0, acceptedExams: ["VITEEE"] },
  { exam: "VITEEE", minRank: 20001, maxRank: 100000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["VITEEE"] },

  // SRMJEE
  { exam: "SRMJEE", minRank: 1, maxRank: 5000, collegeTypes: ["Private"], minRating: 4.0, acceptedExams: ["SRMJEE"] },
  { exam: "SRMJEE", minRank: 5001, maxRank: 30000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["SRMJEE"] },

  // State CET
  { exam: "State CET", minRank: 1, maxRank: 1000, collegeTypes: ["Government", "Private"], minRating: 4.3, acceptedExams: ["State CET", "JEE Main"] },
  { exam: "State CET", minRank: 1001, maxRank: 5000, collegeTypes: ["Government", "Private"], minRating: 4.0, acceptedExams: ["State CET", "JEE Main"] },
  { exam: "State CET", minRank: 5001, maxRank: 20000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["State CET"] },

  // NEET (Medical)
  { exam: "NEET", minRank: 1, maxRank: 100, collegeTypes: ["Government"], minRating: 4.8, acceptedExams: ["NEET"] },
  { exam: "NEET", minRank: 101, maxRank: 1000, collegeTypes: ["Government"], minRating: 4.5, acceptedExams: ["NEET"] },
  { exam: "NEET", minRank: 1001, maxRank: 5000, collegeTypes: ["Government"], minRating: 4.3, acceptedExams: ["NEET"] },
  { exam: "NEET", minRank: 5001, maxRank: 20000, collegeTypes: ["Government", "Private"], minRating: 4.0, acceptedExams: ["NEET"] },
  { exam: "NEET", minRank: 20001, maxRank: 100000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["NEET"] },

  // CAT (Management)
  { exam: "CAT", minRank: 1, maxRank: 100, collegeTypes: ["Government"], minRating: 4.8, acceptedExams: ["CAT"] },
  { exam: "CAT", minRank: 101, maxRank: 500, collegeTypes: ["Government"], minRating: 4.6, acceptedExams: ["CAT"] },
  { exam: "CAT", minRank: 501, maxRank: 2000, collegeTypes: ["Government", "Private"], minRating: 4.4, acceptedExams: ["CAT"] },
  { exam: "CAT", minRank: 2001, maxRank: 10000, collegeTypes: ["Government", "Private"], minRating: 4.0, acceptedExams: ["CAT"] },
  { exam: "CAT", minRank: 10001, maxRank: 50000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["CAT"] },

  // CUET (Degree / General)
  { exam: "CUET", minRank: 1, maxRank: 1000, collegeTypes: ["Government"], minRating: 4.4, acceptedExams: ["CUET"] },
  { exam: "CUET", minRank: 1001, maxRank: 5000, collegeTypes: ["Government", "Private"], minRating: 4.2, acceptedExams: ["CUET"] },
  { exam: "CUET", minRank: 5001, maxRank: 20000, collegeTypes: ["Government", "Private"], minRating: 4.0, acceptedExams: ["CUET"] },
  { exam: "CUET", minRank: 20001, maxRank: 100000, collegeTypes: ["Private"], minRating: 3.5, acceptedExams: ["CUET"] },
];

// 🔍 Find matching rule
export function findMatchingRule(exam: string, rank: number): PredictionRule | null {
  return (
    predictionRules.find(
      (rule) => rule.exam === exam && rank >= rule.minRank && rank <= rule.maxRank
    ) || null
  );
}

/////////////////////////////////////////////////////////
// 🚀 MATCH STRENGTH (BEST / GOOD / REACH)
/////////////////////////////////////////////////////////

export function getMatchType(rank: number, rule: PredictionRule) {
  const rangeSize = rule.maxRank - rule.minRank;
  const position = rank - rule.minRank;

  const ratio = position / rangeSize;

  if (ratio <= 0.3) return "best";   // top 30% of range
  if (ratio <= 0.7) return "good";   // mid range
  return "reach";                   // lower edge
}

/////////////////////////////////////////////////////////
// 🧠 RECOMMENDATION REASON
/////////////////////////////////////////////////////////

export function getRecommendationReason(
  exam: string,
  rank: number,
  college: any,
  rule: PredictionRule
) {
  const matchType = getMatchType(rank, rule);

  if (matchType === "best") {
    return `🔥 Strong match: Your rank (${rank}) is in the top range for ${exam}, aligning with high placement (${college.placementPercentage}%) and top ratings.`;
  }

  if (matchType === "good") {
    return `⭐ Good fit: Your rank (${rank}) comfortably falls within this college's admission range with solid placement outcomes.`;
  }

  return `⚠️ Reach option: Slightly competitive for your rank (${rank}), but possible based on trends and preferences.`;
}

/////////////////////////////////////////////////////////
// ⭐ LABEL FOR UI BADGE
/////////////////////////////////////////////////////////

export function getMatchLabel(rank: number, rule: PredictionRule) {
  const type = getMatchType(rank, rule);

  if (type === "best") return "⭐ Best Match";
  if (type === "good") return "👍 Good Fit";
  return "⚠️ Reach";
}