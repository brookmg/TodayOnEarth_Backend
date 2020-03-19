
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('keyword').del()
    .then(function () {
      // Inserts seed entries
      return knex('keyword').insert( [
   {  keyword: 'Relax', post_id: 21 },
   {  keyword: 'and', post_id: 21 },
   {  keyword: 'unwind', post_id: 21 },
   {  keyword: 'Image', post_id: 21 },
   {  keyword: 'may', post_id: 21 },
   {  keyword: 'contain', post_id: 21 },
   {  keyword: '2', post_id: 21 },
   {  keyword: 'people', post_id: 21 },
   {  keyword: 'people', post_id: 21 },
   {  keyword: 'standing', post_id: 21 },
   {  keyword: 'and', post_id: 21 },
   {  keyword: 'indoor', post_id: 21 },
   {  keyword: 'Stay', post_id: 22 },
   {  keyword: 'Living', post_id: 23 },
   {  keyword: 'far', post_id: 22 },
   {  keyword: 'life', post_id: 23 },
   {  keyword: 'from', post_id: 22 },
   {  keyword: 'for', post_id: 23 },
   {  keyword: 'timidonly', post_id: 22 },
   {  keyword: 'the', post_id: 23 },
   {  keyword: 'make', post_id: 22 },
   {  keyword: 'feeling', post_id: 23 },
   {  keyword: 'moves', post_id: 22 },
   {  keyword: 'Image', post_id: 23 },
   {  keyword: 'when', post_id: 22 },
   {  keyword: 'may', post_id: 23 },
   {  keyword: 'your', post_id: 22 },
   {  keyword: 'contain', post_id: 23 },
   {  keyword: 'hearts', post_id: 22 },
   {  keyword: '1', post_id: 23 },
   {  keyword: 'in', post_id: 22 },
   {  keyword: 'person', post_id: 23 },
   {  keyword: 'it.', post_id: 22 },
   {  keyword: 'standing', post_id: 23 },
   {  keyword: 'Image', post_id: 22 },
   {  keyword: 'may', post_id: 22 },
   {  keyword: 'contain', post_id: 22 },
   {  keyword: '1', post_id: 22 },
   {  keyword: 'person', post_id: 22 },
   {  keyword: 'sunglasses', post_id: 22 },
   {  keyword: '@bk_photography_et', post_id: 24 },
   {  keyword: 'Image', post_id: 24 },
   {  keyword: 'may', post_id: 24 },
   {  keyword: 'contain', post_id: 24 },
   {  keyword: '1', post_id: 24 },
   {  keyword: 'person', post_id: 24 },
   {  keyword: 'sitting', post_id: 24 },
   {  keyword: 'and', post_id: 24 },
   {  keyword: 'indoor', post_id: 24 },
   {  keyword: 'Make', post_id: 25 },
   {  keyword: 'my', post_id: 25 },
   {  keyword: 'soul', post_id: 25 },
   {  keyword: 'smile', post_id: 25 },
   {  keyword: 'Image', post_id: 25 },
   {  keyword: 'may', post_id: 25 },
   {  keyword: 'contain', post_id: 25 },
   {  keyword: '1', post_id: 25 },
   {  keyword: 'person', post_id: 25 },
   {  keyword: 'Blessed', post_id: 26 },
   {  keyword: 'beyond', post_id: 26 },
   {  keyword: 'measures', post_id: 26 },
   {  keyword: 'Image', post_id: 26 },
   {  keyword: 'may', post_id: 26 },
   {  keyword: 'contain', post_id: 26 },
   {  keyword: '1', post_id: 26 },
   {  keyword: 'person', post_id: 26 },
   {  keyword: 'sitting', post_id: 26 },
   {  keyword: 'Image', post_id: 28 },
   {  keyword: 'Maybe', post_id: 27 },
   {  keyword: 'may', post_id: 28 },
   {  keyword: 'contain', post_id: 28 },
   {  keyword: 'shes', post_id: 27 },
   {  keyword: 'one', post_id: 28 },
   {  keyword: 'born', post_id: 27 },
   {  keyword: 'or', post_id: 28 },
   {  keyword: 'with', post_id: 27 },
   {  keyword: 'more', post_id: 28 },
   {  keyword: 'it', post_id: 27 },
   {  keyword: 'people', post_id: 28 },
   {  keyword: 'Top', post_id: 27 },
   {  keyword: '@miss.t.cal', post_id: 27 },
   {  keyword: 'Image', post_id: 27 },
   {  keyword: 'may', post_id: 27 },
   {  keyword: 'contain', post_id: 27 },
   {  keyword: '1', post_id: 27 },
   {  keyword: 'person', post_id: 27 },
   {  keyword: 'tennis', post_id: 27 },
   {  keyword: 'and', post_id: 27 },
   {  keyword: 'outdoor', post_id: 27 },
   {  keyword: '@bk_photography_et', post_id: 29 },
   {  keyword: 'Image', post_id: 29 },
   {  keyword: 'may', post_id: 29 },
   {  keyword: 'contain', post_id: 29 },
   {  keyword: 'one', post_id: 29 },
   {  keyword: 'or', post_id: 29 },
   {  keyword: 'more', post_id: 29 },
   {  keyword: 'people', post_id: 29 },
   {  keyword: 'Minding', post_id: 30 },
   {  keyword: 'my', post_id: 30 },
   {  keyword: 'biz.', post_id: 30 },
] );
    });
};
