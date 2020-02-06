import utils from './utils'

test('fix Non alpha-numeric strings', () => {
    expect(utils.fixNonAlphaNumeric('abc3asnd543$$%^oncsoid')).toBe('abc3asnd543oncsoid')
}, 10000);

test('remove spaces that are redundant', () => {
    expect(utils.removeRedundantWhitespace(' ansoidn aonaoins oainsdoin aon   aosndoiansdoi oia   ioansdoin     oinsd'))
    .toBe(' ansoidn aonaoins oainsdoin aon aosndoiansdoi oia ioansdoin oinsd')
}, 10000);