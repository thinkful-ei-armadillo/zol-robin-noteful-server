
const NotefulService = {
  getAll(knex, string) {
    return knex.select("*").from(string);
  },
  insert(knex, newNotes, string) {
    return knex
      .insert(newNotes)
      .into(string)
      .returning("*")
      .then(rows => rows[0]);
  },
  getById(knex, id, string) {
    return knex
      .from(string)
      .select("*")
      .where("id", id)
      .first();
  },
  delete(knex, id, string) {
    return knex
      .from(string)
      .where({ id })
      .delete();
  },
  update(knex, id, newNoteField, string) {
    return knex
      .from(string)
      .where({ id })
      .update(newNoteField);
  }
};
module.exports = NotefulService;