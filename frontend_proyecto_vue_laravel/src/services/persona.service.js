import Api from "./api.service";

export default {
  listar: () => {
    return Api().get("/persona");
  },

  guardar: (datos) => {
    return Api().post("/persona", datos);
  },

  mostrar: (id) => {
    return Api().get(`/persona/${id}`);
  },

  modificar: (id, datos) => {
    return Api().put(`/persona/${id}`, datos);
  },

  eliminar: (id) => {
    return Api().delete(`/persona/${id}`);
  },
};
