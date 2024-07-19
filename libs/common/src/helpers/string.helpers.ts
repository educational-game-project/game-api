export const StringHelper = {
  internalServerError: "internal_server_error",

  notFoundResponse(value: string) {
    return `${value}_not_found`;
  },

  successResponse(section: string, method: string) {
    return `${section}_${method}_success`;
  },
};
