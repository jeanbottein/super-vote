// The server's ranking (servers/java/.../api/Ranking.java), ported so that the
// video's results are the ones super-vote would show for the same ballots.

/** Best first, as on the ballot and in the results graph. */
export const MENTIONS = ['Excellent', 'VeryGood', 'Good', 'Fair', 'Passable', 'Inadequate', 'Bad'];
const ordinal = (mention) => MENTIONS.length - 1 - MENTIONS.indexOf(mention); // Bad 0 ... Excellent 6

export const total = (counts) => MENTIONS.reduce((sum, mention) => sum + (counts[mention] ?? 0), 0);

/** Majority mention, then GMJ's usual score (above - below) / at. */
export function judgment(counts) {
  const ballots = total(counts);
  if (ballots === 0) return { better: 0, numerator: 0, denominator: 1, majority: 'Bad' };
  let majority = 'Bad';
  let cumulative = 0;
  for (const mention of MENTIONS.slice(0, -1)) {
    cumulative += counts[mention] ?? 0;
    if (cumulative * 2 > ballots) {
      majority = mention;
      break;
    }
  }
  let above = 0;
  let below = 0;
  for (const mention of MENTIONS) {
    if (ordinal(mention) > ordinal(majority)) above += counts[mention] ?? 0;
    else if (ordinal(mention) < ordinal(majority)) below += counts[mention] ?? 0;
  }
  const at = counts[majority] ?? 0;
  return { better: ordinal(majority), numerator: above - below, denominator: at === 0 ? ballots : at, majority };
}

export const approval = (count) => ({ better: count, numerator: 0, denominator: 1 });

function compare(a, b) {
  if (a.better !== b.better) return b.better - a.better;
  return b.numerator * a.denominator - a.numerator * b.denominator;
}

/** Each option's rank, in the poll's order: 1 wins, and a shared rank is ex aequo. */
export function ranks(measures) {
  const best = measures.map((_, index) => index).sort((a, b) => compare(measures[a], measures[b]) || a - b);
  const result = new Array(measures.length);
  let rank = 1;
  best.forEach((index, i) => {
    if (i > 0 && compare(measures[best[i - 1]], measures[index]) !== 0) rank = i + 1;
    result[index] = rank;
  });
  return result;
}

/** Where each option stands in the results list: by rank, ties in the poll's order. */
export function places(rankList) {
  const order = rankList.map((_, index) => index).sort((a, b) => rankList[a] - rankList[b] || a - b);
  const result = new Array(rankList.length);
  order.forEach((index, place) => { result[index] = place; });
  return result;
}
