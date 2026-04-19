const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Claim",
  tableName: "claims",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    description: { type: "text" },
    type: { type: "varchar", default: "general" },
    documentMetadata: { type: "json", nullable: true },
    status: { type: "varchar", default: "submitted" },
    createdAt: { type: "timestamp", createDate: true },
  },
  indices: [
    { name: "IDX_CLAIM_STATUS", columns: ["status"] },
    { name: "IDX_CLAIM_TYPE", columns: ["type"] },
  ],
  relations: {
    user: { type: "many-to-one", target: "User", eager: true },
    assignedOfficer: {
      type: "many-to-one",
      target: "User",
      nullable: true,
      eager: true,
    },
  },
});
