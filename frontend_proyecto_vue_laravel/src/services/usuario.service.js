import Api from "./api.service";

export default {
  listar: () => {
    return Api().get("/user");
  },

  guardar: (datos) => {
    return Api().post("/user", datos);
  },

  mostrar: (id) => {
    return Api().get(`/user/${id}`);
  },

  modificar: (id, datos) => {
    return Api().put(`/user/${id}`, datos);
  },

  eliminar: (id) => {
    return Api().delete(`/user/${id}`);
  },
};
