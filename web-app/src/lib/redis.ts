// Light mock of Redis for local development without Docker
export const redis = {
  get: async () => null,
  set: async () => "OK",
  del: async () => 1,
  on: () => {},
};
