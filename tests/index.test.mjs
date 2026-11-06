import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('three-choice Borda', () => {
  assert.deepEqual(
    api.borda(
      ['a', 'b', 'c'],
      [
        ['a', 'b', 'c'],
        ['b', 'c', 'a'],
      ],
    ),
    [
      { candidate: 'b', score: 3 },
      { candidate: 'a', score: 2 },
      { candidate: 'c', score: 1 },
    ],
  );
});
test('reversed ballots tie', () => {
  assert.deepEqual(
    api
      .borda(
        ['b', 'a'],
        [
          ['a', 'b'],
          ['b', 'a'],
        ],
      )
      .map((x) => x.candidate),
    ['a', 'b'],
  );
});
test('point conservation', () => {
  const r = api.borda(['a', 'b', 'c'], [['c', 'a', 'b']]);
  assert.equal(
    r.reduce((s, x) => s + x.score, 0),
    3,
  );
});
test('unknown and duplicate candidates', () => {
  assert.throws(() => api.borda(['a', 'a'], [['a', 'a']]));
  assert.throws(() => api.borda(['a', 'b'], [['a', 'c']]));
});
test('missing and repeated ranks', () => {
  assert.throws(() => api.borda(['a', 'b'], [['a']]));
  assert.throws(() => api.borda(['a', 'b'], [['a', 'a']]));
});
test('empty and sparse ballot rejection', () => {
  assert.throws(() => api.borda(['a', 'b'], []));
  assert.throws(() => api.borda(['a', 'b'], [[, 'a']]));
});
