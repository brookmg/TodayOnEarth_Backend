
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        {uid: 1, first_name: 'Hiwot' , last_name: 'Bogalle' , email: 'hiwotb@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'hiwotb' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 2, first_name: 'Ruth' , last_name: 'Hailu' , email: 'ruthh@gmail.com' , role: 0,
            phone_number: '+251933454588' , username: 'ruthh' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 3, first_name: 'Bamlak' , last_name: 'Betre' , email: 'bamlakbetre@gmail.com' , role: 0,
            phone_number: '+251963020177' , username: 'bamlakbetre' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 4, first_name: 'Abraham' , last_name: 'Terfie' , email: 'abrahamt@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'abrahamt' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 5, first_name: 'Sayat' , last_name: 'Seyum' , email: 'sayat_seyum@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'sayat_seyum' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 6, first_name: 'Meron' , last_name: 'Tadesse' , email: 'meront@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'meront' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 7, first_name: 'Selam' , last_name: 'Tesfaye' , email: 'selamt@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'selamt' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 8, first_name: 'Linda' , last_name: 'Habteyesus' , email: 'lindah@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'lindah' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 9, first_name: 'Gorge' , last_name: 'Buck' , email: 'gorge.buck@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'gorge.buck' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 10, first_name: 'Betel' , last_name: 'Kaleab' , email: 'betel@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'betel' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
        {uid: 11, first_name: 'Brook' , last_name: 'Mezgebu' , email: 'brookmg@gmail.com' , role: 0,
            phone_number: '+251955484866' , username: 'brookmg' , country: 'ET', password_hash: '$2b$10$18HX7alahfocfrjST6Ss.eWcR0/Odp4qM3J5rzpx9A/XUAOtVjbLi' },
      ]);
    });
};
