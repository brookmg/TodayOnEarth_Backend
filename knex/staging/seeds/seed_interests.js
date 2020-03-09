
exports.seed = function(knex) {
  return knex('interest').del()
    .then(function () {
      return knex('interest').insert([
          {interest_id: 1, interest: 'Love' , score: 0.69, uid: 1},
          {interest_id: 2, interest: 'Ethiopia' , score: 0.42, uid: 1},
          {interest_id: 3, interest: 'God' , score: 0.849, uid: 1},
          {interest_id: 4, interest: 'COVID19' , score: -0.29, uid: 1},

          {interest_id: 5, interest: 'Love' , score: 0.89, uid: 2},
          {interest_id: 6, interest: 'Ethiopia' , score: 0.72, uid: 2},
          {interest_id: 7, interest: 'MUtd' , score: 0.665, uid: 2},
          {interest_id: 8, interest: 'God' , score: -0.29, uid: 2},

          {interest_id: 9, interest: 'MortalCompat' , score: 0.22, uid: 3},
          {interest_id: 10, interest: 'Seige' , score: 0.32, uid: 3},
          {interest_id: 11, interest: 'Game' , score: 0.722, uid: 3},
          {interest_id: 12, interest: 'Country' , score: -0.12, uid: 3},

          {interest_id: 13, interest: 'Physics' , score: 0.49, uid: 11},
          {interest_id: 14, interest: 'Tech' , score: 0.61, uid: 11},
          {interest_id: 15, interest: 'Steve' , score: 0.35, uid: 11},
          {interest_id: 16, interest: 'Nokia' , score: 0.29, uid: 11},
      ]);
    });
};
