const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Comment",
  tableName: "comments",
  columns: {
    id: { primary: true, type: "int", generated: true },
    message: { type: "text" },
    createdAt: { type: "timestamp", createDate: true }
  },
  relations: {
    claim: {
      type: "many-to-one",
      target: "Claim",
      eager: true
    },
    user: {
      type: "many-to-one",
      target: "User",
      eager: true
    }
  }
});