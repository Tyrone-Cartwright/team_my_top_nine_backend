exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        { username: "victorVUE", password: "password" },
        { username: "carolSASS", password: "password" },
        { username: "rogerREACT", password: "password" }
      ]);
    });
};
