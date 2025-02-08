import Api from "./api.service";

export default {
  listar: () => {
    return Api().get("/recurso");
  },

  guardar: (datos) => {
    return Api().post("/recurso", datos);
  },

  mostrar: (id) => {
    return Api().get(`/recurso/${id}`);
  },

  modificar: (id, datos) => {
    return Api().put(`/recurso/${id}`, datos);
  },

  eliminar: (id) => {
    return Api().delete(`/recurso/${id}`);
  },
};
