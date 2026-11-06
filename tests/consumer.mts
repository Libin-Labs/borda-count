import { borda } from '@lp-labs/borda-count';
if (borda(['a', 'b'], [['a', 'b']])[0].score !== 1) throw new Error('Borda');
// @ts-expect-error invalid argument must be rejected by declarations
borda([1, 2], [['a', 'b']]);
