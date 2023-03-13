export const validateAppCreateData = (data) => {
  const requiredFields = ["name", "description", "repoUrl"];

  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length) {
    return {
      isValid: false,
      message: `Missing fields: ${missingFields.join(", ")}`,
    };
  }

  return {
    isValid: true,
  };
};
