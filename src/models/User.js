import { Model } from "objection";

export default class User extends Model {
  static get tableName() {
    return "users";
  }

  static jsonSchema = {
    type: "object",
    required: ["email", "password"],

    properties: {
      id: { type: "integer" },
      email: { type: "string", minLength: 1, maxLength: 255 },
      password: { type: "string", minLength: 1, maxLength: 255 },
    },
  };

  static get idColumn() {
    return "id";
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
