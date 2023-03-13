import { Router } from "express";
import { isAuth } from "../auth/auth-middleware";
import { uploadErrorHandler } from "../global/file-middleware";
import { fileUpload } from "../global/file-service";

import * as mobileAppController from "./mobile-app-controller";
export default (app) => {
  const router = Router();

  router.get("/", isAuth, mobileAppController.fetchAllApps);
  router.get("/active/build", mobileAppController.fetchPublicAppUrl);
  router.get("/details/:uid", isAuth, mobileAppController.fetchAppDetails);
  router.get("/builds/:uid", isAuth, mobileAppController.fetchAppBuilds);

  router.post("/", isAuth, mobileAppController.createApp);
  router.post(
    "/release/:uid",
    isAuth,
    fileUpload.single("app"),
    uploadErrorHandler,
    mobileAppController.releaseApp
  );

  router.patch(
    "/release/edit/:uid",
    isAuth,
    mobileAppController.updateReleaseInfo
  );

  router.patch("/edit/:uid", isAuth, mobileAppController.updateApp);

  app.use("/app", router);
};
