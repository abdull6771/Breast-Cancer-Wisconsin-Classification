export interface ContributionRow {
  name: string;
  contribution: number;
}

export function sortContributions(
  featureNames: string[],
  contributions: number[],
): ContributionRow[] {
  return featureNames
    .map((name, index) => ({
      name,
      contribution: contributions[index] ?? 0,
    }))
    .sort((a, b) => a.contribution - b.contribution);
}
