import { transaction } from "objection";
import logger from "../../loaders/logger";
import App from "../../models/App";
import AppBuild from "../../models/AppBuild";
import { uuid16, uuid4 } from "../../utils/uuid";
import { validateAppCreateData } from "../../validation/app";

export default {
  fetchAllApps: async function (query) {
    try {
      const page = query.page || 1;
      const limit = query.limit || 10;

      const { results, total } = await App.query()
        .withGraphFetched("[publisher, builds]")
        .modify((builder) => {
          if (query?.name) {
            builder.where("name", "ilike", `%${query.name}%`);
          }
        })
        .orderBy("createdAt", "desc")
        .page(page - 1, limit);

      return {
        status: 200,
        data: {
          apps: results,
          total,
        },
      };
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - fetchAllApps");
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not fetch apps",
      };
    }
  },

  fetchAppDetails: async function (appUid) {
    try {
      const app = await App.query()
        .withGraphFetched("[publisher, builds]")
        .findOne({ uid: appUid });

      if (!app) {
        return {
          status: 404,
          message: "App not found",
        };
      }

      return {
        status: 200,
        data: {
          details: app,
        },
      };
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - fetchAppDetails");
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not fetch app details",
      };
    }
  },

  createApp: async function (user, appData) {
    try {
      const result = await transaction(App.knex(), async (trx) => {
        const { isValid, message } = validateAppCreateData(appData);

        if (!isValid) {
          return {
            status: 400,
            message,
          };
        }
        const { name, description, repoUrl } = appData;

        const appInsertData = {
          name,
          description,
          repoUrl,
          uid: `${name
            .replace(/\s/g, "-")
            .toLowerCase()}-${uuid4()}`.toLowerCase(),
          createdBy: user.id,
        };

        await App.query(trx).insert(appInsertData);

        const app = await App.query(trx)
          .withGraphFetched("[publisher, builds]")
          .findOne({ uid: appInsertData.uid });

        if (!app) {
          return {
            status: 400,
            message: "Sorry app was not added",
          };
        }

        return {
          status: 200,
          data: {
            details: app,
          },
        };
      });

      return result;
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - createApp");
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not create app",
      };
    }
  },

  updateApp: async function (appUid, appData) {
    try {
      const { name, description, repoUrl, publicUrl, buildName, buildNumber } =
        appData;

      const appPatchData = {
        name,
        description,
        repoUrl,
        publicUrl,
        buildName,
        buildNumber,
      };

      await App.query().patch(appPatchData).where({ uid: appUid });

      return {
        status: 200,
        message: "App updated successfully",
      };
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - updateApp");
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not update app",
      };
    }
  },

  fetchAppBuilds: async function (appUid, query) {
    try {
      const app = await App.query().findOne({ uid: appUid });

      if (!app) {
        return {
          status: 404,
          message: "App not found",
        };
      }

      const builds = await AppBuild.query()
        .modify((builder) => {
          if (query.searchKey) {
            builder.where("buildName", "ilike", `%${query.searchKey}%`);
            builder.where("buildNumber", "ilike", `%${query.searchKey}%`);
            builder.where("buildFlavor", "ilike", `%${query.searchKey}%`);
            builder.where("buildType", "ilike", `%${query.searchKey}%`);
          }
        })
        .withGraphFetched("[uploader]")
        .where({ appId: app.id })
        .orderBy("createdAt", "desc");

      return {
        status: 200,
        data: {
          builds,
        },
      };
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - fetchAppBuilds");
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not fetch app builds",
      };
    }
  },

  releaseApp: async function ({ user, appUid, filePath, buildInfo }) {
    try {
      const result = await transaction(AppBuild.knex(), async (trx) => {
        if (!filePath) {
          return {
            status: 400,
            message: "No App file found",
          };
        }
        const app = await App.query(trx).findOne({ uid: appUid });

        if (!app) {
          return {
            status: 404,
            message: "App not found",
          };
        }

        const {
          buildName,
          buildNumber,
          buildFlavor,
          buildType,
          shouldActive,
          shouldHighLight,
        } = buildInfo;

        if (!buildName || !buildNumber || !buildFlavor || !buildType) {
          return {
            status: 400,
            message: "Please provide all build info",
          };
        }

        const hasActiveBuild = await AppBuild.query(trx)
          .where({
            appId: app.id,
            isActive: true,
            buildType,
            buildFlavor,
          })
          .first();

        const buildInsertData = {
          appId: app.id,
          buildName,
          buildNumber,
          buildFlavor,
          buildType,
          display_version: `${buildName}-${buildFlavor}-${buildNumber}`,
          appUrl: filePath.location,
          uploadedBy: user.id,
          uid: uuid16(),
          isActive: !hasActiveBuild || shouldActive,
        };

        if (shouldActive) {
          await AppBuild.query(trx)
            .patch({ isActive: false })
            .where({ appId: app.id, isActive: true, buildType, buildFlavor });
        }

        await AppBuild.query(trx).insert(buildInsertData);

        if (shouldHighLight) {
          await App.query(trx)
            .patch({ buildName, buildNumber, publicUrl: filePath.location })
            .where({ id: app.id });
        }

        return {
          status: 200,
          message: "App released successfully",
        };
      });

      return result;
    } catch (error) {
      logger.error("Error in mobile-app/mobile-app-services - releaseApp");
      console.log(error);
      return {
        status: 500,
        message: "Sorry could not release app",
      };
    }
  },

  updateReleaseInfo: async function ({ buildInfo, releaseUid, filePath }) {
    try {
      const result = await transaction(AppBuild.knex(), async (trx) => {
        const appBuild = await AppBuild.query(trx).findOne({ uid: releaseUid });

        if (!appBuild) {
          return {
            status: 404,
            message: "Release not found",
          };
        }

        const {
          buildName,
          buildNumber,
          buildFlavor,
          buildType,
          shouldActive,
          shouldHighLight,
        } = buildInfo;

        const buildPatchData = {
          buildName,
          buildNumber,
          buildFlavor,
          buildType,
          buildVersion: `${buildName}-${buildFlavor}-${buildNumber}`,
          appUrl: filePath.location || appBuild.appUrl,
          isActive: shouldActive,
        };

        if (shouldActive) {
          await AppBuild.query(trx).patch({ isActive: false }).where({
            appId: appBuild.appId,
            isActive: true,
            buildType,
            buildFlavor,
          });
        }

        await AppBuild.query(trx)
          .patch(buildPatchData)
          .where({ uid: releaseUid });

        if (shouldHighLight) {
          await App.query(trx)
            .patch({ buildName, buildNumber, publicUrl: filePath.location })
            .where({ id: appBuild.appId });
        }

        return {
          status: 200,
          message: "Release updated successfully",
        };
      });
      return result;
    } catch (error) {
      logger.error(
        "Error in mobile-app/mobile-app-services - updateReleaseInfo"
      );
      console.log(error);
      return {
        status: 500,
        message: "Sorry could not update release info",
      };
    }
  },

  fetchPublicAppUrl: async function (query) {
    try {
      const { appUid, buildFlavor, buildType } = query;
      if (!appUid || !buildFlavor || !buildType) {
        return {
          status: 400,
          message: "Invalid request",
        };
      }
      const app = await App.query().findOne({ uid: appUid });

      if (!app) {
        return {
          status: 404,
          message: "App not registered with Blend App",
        };
      }

      const appBuild = await AppBuild.query().findOne({
        appId: app.id,
        buildFlavor,
        buildType,
        isActive: true,
      });

      if (!appBuild) {
        return {
          status: 404,
          message: "No active build found",
        };
      }

      return {
        status: 200,
        data: {
          release: appBuild,
        },
      };
    } catch (error) {
      logger.error(
        "Error in mobile-app/mobile-app-services - fetchPublicAppUrl"
      );
      console.error(error);
      return {
        status: 500,
        message: "Sorry could not find active build",
      };
    }
  },
};
