function strictText(value: string, max = 16384): void {
  if (typeof value !== 'string') throw new TypeError('Expected string');
  if (value.length > max) throw new RangeError('Text length budget exceeded');
}
function check(
  candidates: readonly string[],
  ballots: readonly (readonly string[])[],
  complete = true,
): void {
  if (
    !Array.isArray(candidates) ||
    candidates.length < 2 ||
    candidates.length > 50 ||
    !Array.isArray(ballots) ||
    !ballots.length ||
    ballots.length > 10000
  )
    throw new RangeError('Election size bounds');
  const ids = new Set<string>();
  for (const id of candidates) {
    strictText(id, 100);
    if (!id || ids.has(id)) throw new RangeError('Unique nonempty candidates');
    ids.add(id);
  }
  for (const ballot of ballots) {
    if (
      !Array.isArray(ballot) ||
      (complete && ballot.length !== candidates.length) ||
      ballot.length > candidates.length
    )
      throw new RangeError('Ballot length');
    const seen = new Set<string>();
    for (const id of ballot) {
      if (!ids.has(id) || seen.has(id)) throw new RangeError('Unknown or duplicate choice');
      seen.add(id);
    }
  }
}
function ordinal(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
export interface CandidateScore {
  candidate: string;
  score: number;
}
function scores(candidates: readonly string[], values: readonly number[]): CandidateScore[] {
  return candidates
    .map((candidate, i) => ({ candidate, score: values[i]! }))
    .sort((a, b) => b.score - a.score || ordinal(a.candidate, b.candidate));
}
export function borda(
  candidates: readonly string[],
  ballots: readonly (readonly string[])[],
): CandidateScore[] {
  check(candidates, ballots);
  const t = Array<number>(candidates.length).fill(0),
    map = new Map(candidates.map((id, i) => [id, i]));
  for (const ballot of ballots)
    for (let rank = 0; rank < ballot.length; rank++) {
      const i = map.get(ballot[rank]!)!;
      t[i] = t[i]! + ballot.length - 1 - rank;
    }
  return scores(candidates, t);
}
