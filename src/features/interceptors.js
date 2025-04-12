import api from "./api";
import { refreshToken, resetUser } from "../features/auth/authSlice";

const setupAxiosInterceptors = (store, navigate) => {
  let user = store.getState().auth.user;
  let guestUser = store.getState().auth.guestUser;

  // 🛡️ Chaque fois que Redux store change -> met à jour user et guestUser
  const updateUserToken = () => {
    user = store.getState().auth.user;
    guestUser = store.getState().auth.guestUser;
  };

  const unsubscribe = store.subscribe(updateUserToken);

  // ➡️ Intercepter toutes les requêtes avant l'envoi
  api.interceptors.request.use(
    (config) => {
      const token = user?.access;
      const guestUserId = guestUser?.id;

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;  // ✅ Corrigé avec backticks
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

  // ➡️ Intercepter toutes les réponses
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;

      // ⛔ Si erreur 401 (Unauthorized) et pas déjà tenté de refresh
      if (originalConfig && error.response && error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await api.post("/auth/refresh/", {
            refresh: user?.refresh,
          });

          const { data } = rs.data; // 👈 récupérer data.access
          dispatch(refreshToken(data)); // 🔁 Mettre à jour Redux

          // ➡️ Rejouer la requête d'origine avec nouveau token
          originalConfig.headers["Authorization"] = `Bearer ${data.access}`;
          return api(originalConfig);
        } catch (refreshError) {
          // ❌ Refresh échoué : on logout
          dispatch(resetUser());
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // ➡️ Cleanup : permet d'arrêter l'écoute du store si besoin
  return () => {
    unsubscribe();
  };
};

export default setupAxiosInterceptors;