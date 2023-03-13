import { Model } from "objection";
import AppBuild from "./AppBuild";
import User from "./User";

export default class App extends Model {
  static get tableName() {
    return "apps";
  }

  static get idColumn() {
    return "id";
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      builds: {
        relation: Model.HasManyRelation,
        modelClass: AppBuild,
        filter: (query) => query.where("is_active", true),
        join: {
          from: "apps.id",
          to: "app_builds.appId",
        },
      },

      publisher: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        filter: (query) => query.select("id", "name", "email"),
        join: {
          from: "apps.createdBy",
          to: "users.id",
        },
      },
    };
  }
}
