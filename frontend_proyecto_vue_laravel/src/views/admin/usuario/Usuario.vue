<template>
  <div class="card">
    <Toast />

    <Button label="Nuevo Usuario" @click="visible = true" />

    <Dialog
      v-model:visible="visible"
      modal
      header="Datos de Usuario"
      :style="{ width: '30rem' }"
    >
      {{ usuario }}
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Ingrese datos del Usuario.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">Nombre Completo</label>
        <InputText
          id="username"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.name"
        />
        <Message
          v-if="errors.name"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.name }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="email" class="font-semibold w-24">Correo Electronico</label>
        <InputText
          id="email"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.email"
        />
        <Message
          v-if="errors.email"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.email }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="pass" class="font-semibold w-24">Contraseña</label>
        <InputText
          type="password"
          id="pass"
          class="flex-auto"
          autocomplete="off"
          v-model="usuario.password"
        />
        <Message
          v-if="errors.password"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.password }}</Message
        >
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="visible = false"
        ></Button>
        <Button type="button" label="Guardar" @click="funGuardar()"></Button>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="dialogPersona"
      modal
      header="Datos Personales"
      :style="{ width: '30rem' }"
    >
      {{ persona }}
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Ingrese datos Personales.</span
      >

      <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nombre Completo</label>
        <InputText
          id="nom"
          class="flex-auto"
          autocomplete="off"
          v-model="persona.nombres"
        />
        <Message
          v-if="errors.nombres"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.nombres }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Apellidos</label>
        <InputText
          id="nom"
          class="flex-auto"
          autocomplete="off"
          v-model="persona.apellidos"
        />
        <Message
          v-if="errors.apellidos"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.apellidos }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="ci" class="font-semibold w-24">CI</label>
        <InputText
          id="ci"
          class="flex-auto"
          autocomplete="off"
          v-model="persona.ci"
        />
        <Message
          v-if="errors.ci"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.ci }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="fn" class="font-semibold w-24">Fecha Nacimiento</label>
        <DatePicker v-model="persona.fecha_nacimiento" />
      </div>


      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="dialogPersona = false"
        ></Button>
        <Button type="button" label="Guardar" @click="funGuardarPersona()"></Button>
      </div>
    </Dialog>

    <DataTable :value="usuarios" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Nombre"></Column>
      <Column field="email" header="CORREO ELECTRONICO"></Column>
      <Column field="persona.nombres" header="DATOS PERSONALES">
        <template #body="slotProps">
          <span v-if="slotProps.data.persona">
            {{ `${slotProps.data.persona?.nombres} ${slotProps.data.persona?.apellidos}` }}
            <br>
            <strong>{{ slotProps.data.persona.ci }}</strong>
          </span>
        </template>
      </Column>
      <Column field="tareas" header="J.P">
        <template #body="slotProps">
          <strong>Jefe Proyecto: {{ slotProps.data.proyectos.length }}</strong>
          <hr>
          <a :href="`/admin/proyecto/${proy.id}`" v-for="proy in slotProps.data.proyectos" :key="proy.id">
            <Chip :label="proy.nombre" icon="pi pi-apple" />
            </a>
        </template>
      </Column>
      <Column field="tareas" header="Nro.TAREAS">
        <template #body="slotProps">
          {{ slotProps.data.tareas.length }}
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
              <Button icon="pi pi-user" rounded outlined severity="warn" class="mr-2" @click="formNuevoPersona(slotProps.data)" v-if="!slotProps.data.persona" />
              <Button icon="pi pi-pencil" rounded class="mr-2" @click="editarUsuario(slotProps.data)" />
              <Button icon="pi pi-trash" rounded severity="danger" @click="confirmarEliminacion(slotProps.data)" />
          </template>
      </Column>
    </DataTable>

    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>CORREO</th>
          <th>ACCION</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usuarios" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <pre>{{ usuarios }}</pre>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import usuarioService from "@/services/usuario.service.js";
import personaService from "@/services/persona.service.js";

import { useToast } from "primevue/usetoast";
const toast = useToast();
import Swal from "sweetalert2";

const usuarios = ref([]);
const visible = ref(false);
const usuario = ref({ name: "", email: "", password: "" });
const persona = ref({nombres: "", apellidos:"", ci:"", fecha_nacimiento:"", user_id: ""})
const errors = ref({});

const dialogPersona = ref(false);

onMounted(() => {
  getListaUsuarios();
});

async function getListaUsuarios() {
  const respuesta = await usuarioService.listar();
  usuarios.value = respuesta.data;
}

async function funGuardar() {
  try {
    if(!usuario.value.id){
      const respuesta = await usuarioService.guardar(usuario.value);
      visible.value = false;
      usuario.value = { name: "", email: "", password: "" };
  
      Swal.fire({
        title: "Usuario Registrado!",
        text: "continuar!",
        icon: "success",
      });
  
      toast.add({
        severity: "success",
        summary: "Usuario Registrado",
        detail: "EL Usuario se ha registrado correctamente en la Base de datos",
        life: 3000,
      });
  
      getListaUsuarios();

    }else{
      await usuarioService.modificar(usuario.value.id, usuario.value);

      visible.value = false;
      usuario.value = { name: "", email: "", password: "" };

      Swal.fire({
        title: "Usuario Actualizado!",
        text: "continuar!",
        icon: "success",
      });
  
      toast.add({
        severity: "success",
        summary: "Usuario Actualizado",
        detail: "EL Usuario se ha Actualizado correctamente en la Base de datos",
        life: 3000,
      });

    }
  } catch (error) {
    // alert("ERRRRROOOOR")
    console.log(error.response?.data?.errors);
    errors.value = error.response?.data?.errors;
  }
}

function editarUsuario(us){
  usuario.value = us;
  visible.value = true;

}

async function confirmarEliminacion(us){
  if(confirm("Está seguro de elminar al usuario?")){
    await usuarioService.eliminar(us.id)

    Swal.fire({
      title: "Usuario Eliminado!",
      text: "continuar!",
      icon: "success",
    });

    toast.add({
      severity: "success",
      summary: "Usuario Eliminado",
      detail: "EL Usuario se ha eliminado correctamente en la Base de datos",
      life: 3000,
    });

    getListaUsuarios();
  }
}

function formNuevoPersona(us){
  dialogPersona.value = true;

  persona.value.user_id = us.id;

}

async function funGuardarPersona(){
  await personaService.guardar(persona.value)
  
  persona.value = {nombres: "", apellidos:"", ci:"", fecha_nacimiento:"", user_id: ""}
  dialogPersona.value = false;
  getListaUsuarios();

  Swal.fire({
        title: "Datos Personales Actualizados!",
        text: "continuar!",
        icon: "success",
      });
  
      toast.add({
        severity: "success",
        summary: "Datos actualizados",
        detail: "Datos actualizados",
        life: 3000,
      });


}
</script>

<style></style>
