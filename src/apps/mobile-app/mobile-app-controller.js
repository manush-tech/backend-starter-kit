import mobileAppService from "./mobile-app-service";

export const fetchAllApps = async (req, res) => {
  const response = await mobileAppService.fetchAllApps(req.query);
  res.status(response.status).json(response);
};

export const fetchAppDetails = async (req, res) => {
  const response = await mobileAppService.fetchAppDetails(req.params.uid);
  res.status(response.status).json(response);
};

export const createApp = async (req, res) => {
  const response = await mobileAppService.createApp(req.user, req.body);
  res.status(response.status).json(response);
};

export const updateApp = async (req, res) => {
  const response = await mobileAppService.updateApp(req.params.uid, req.body);
  res.status(response.status).json(response);
};

export const releaseApp = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Must provide app release information",
    });
  }
  const appData = JSON.parse(JSON.stringify(req.body));
  const response = await mobileAppService.releaseApp({
    user: req.user,
    appUid: req.params.uid,
    filePath: req.file,
    buildInfo: appData,
  });

  res.status(response.status).json(response);
};

export const fetchAppBuilds = async (req, res) => {
  const response = await mobileAppService.fetchAppBuilds(
    req.params.uid,
    req.query
  );
  res.status(response.status).json(response);
};

export const updateReleaseInfo = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Must provide app release information",
    });
  }
  const appData = JSON.parse(JSON.stringify(req.body));

  const response = await mobileAppService.updateReleaseInfo({
    buildInfo: appData,
    releaseUid: req.params.uid,
    filePath: req.file,
  });
  res.status(response.status).json(response);
};

export const fetchPublicAppUrl = async (req, res) => {
  const response = await mobileAppService.fetchPublicAppUrl(req.query);
  res.status(response.status).json(response);
};
