import { Model } from "objection";
import User from "./User";

export default class AppBuild extends Model {
  static get tableName() {
    return "app_builds";
  }

  static get idColumn() {
    return "id";
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static get relationMappings() {
    return {
      uploader: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "app_builds.uploaded_by",
          to: "users.id",
        },
      },
    };
  }
}
