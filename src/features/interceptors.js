import api from "./api";
import { refreshToken, resetUser } from './auth/authSlice';

const setupAxiosInterceptors = (store, navigate) => {
  let user = store.getState().auth.user;
  let guestUser = store.getState().auth.guestUser;

  const updateUserToken = () => {
    user = store.getState().auth.user;
    guestUser = store.getState().auth.guestUser;
  };

  const unsubscribe = store.subscribe(updateUserToken);

  api.interceptors.request.use(
    (config) => {
      const token = user?.access;
      const guestUserId = guestUser?.id;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; // Fixed template literal syntax
      } else if (guestUserId) {
        config.headers["guestUserId"] = guestUserId;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;

      if (originalConfig && error.response && error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          // ✅ IMPORTANT : créer un Axios spécial sans interceptor pour refresh
          const refreshApi = api.create();

          const rs = await refreshApi.post(
            "/auth/refresh/",
            {},
            {
              headers: {
                "Authorization": `Bearer ${user?.access}`, // Fixed template literal syntax
              },
            }
          );

          const { data } = rs.data;
          dispatch(refreshToken(data));

          // ➡️ Rejouer l'ancienne requête avec NOUVEAU token
          originalConfig.headers["Authorization"] = `Bearer ${data.access}`; // Fixed template literal syntax
          return api(originalConfig);
        } catch (refreshError) {
          dispatch(resetUser());
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    unsubscribe();
  };
};

export default setupAxiosInterceptors;