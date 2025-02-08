<template>
	<!--
  <h1>Mi Perfil</h1>
  <div v-if="perfil.name">
    <h3>NOMBRE: {{ perfil.name }}</h3>
    <h3>CORREO: {{ perfil.email }}</h3>
    <h3>CONTRASEÑA: {{ perfil.password }}</h3>
    <button @click="obtenerDatos()">Obtener Datos</button>
    {{ perfil }}
    <br />
    <button @click="funSalir()">SALIR (LOGOUT)</button>
  </div>
-->

  <div v-if="perfil.name"
    class="max-w-4xl flex items-center flex-wrap mx-auto"
  >
    <!--Main Col-->
    <div
      id="profile"
      class="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0"
    >
      <div class="p-4 md:p-12 text-center lg:text-left">
        <!-- Image for mobile view-->
        <div
          class="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
          style="
            background-image: url('https://source.unsplash.com/MP0IUfwrn0A');
          "
        ></div>

        <h1 class="text-3xl font-bold pt-8 lg:pt-0">{{ perfil.name }}</h1>
        <div
          class="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"
        ></div>
        <p
          class="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"
        >
          <svg
            class="h-4 fill-current text-green-700 pr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z"
            />
          </svg>
          {{ perfil.email }}
        </p>
        <p
          class="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start"
        >
          <svg
            class="h-4 fill-current text-green-700 pr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z"
            />
          </svg>
          {{perfil.persona?.nombres}} {{perfil.persona?.apellidos}}
        </p>
		<br>
		<span>CI: {{perfil.persona?.ci}}</span>

        <div class="pt-12 pb-8">
          <button @click="funSalir()"
            class="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full"
          >
            SALIR
          </button>
        </div>
		

        <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->
      </div>
    </div>

	<div class="card">
		<h5>JEFE DE PROYECTOS EN:</h5>
        <DataTable :value="perfil.proyectos" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="descripcion" header="DESCRIPCION"></Column>
            <Column field="fecha_inicio" header="F.INI"></Column>
			<Column field="fecha_fin" header="F.FIN"></Column>
        </DataTable>
    </div>

	<div class="card">
		<h5>TAREAS</h5>
        <DataTable :value="perfil.tareas" tableStyle="min-width: 50rem">
            <Column field="id" header="ID"></Column>
            <Column field="nombre" header="NOMBRE"></Column>
            <Column field="descripcion" header="DESCRIPCION"></Column>
			<Column field="estado" header="ESTADO"></Column>
			<Column field="porcentaje_avance" header="%"></Column>
            <Column field="fecha_inicio" header="F.INI"></Column>
			<Column field="fecha_fin" header="F.FIN"></Column>
			<Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                    
                        <Button icon="pi pi-lock" rounded severity="warn" class="mr-2" @click="mostrarTareaDialog(slotProps.data)" />
                     </template>
                </Column>
        </DataTable>
    </div>
	

    

    <!-- Pin to top right corner -->
    <div class="absolute top-0 right-0 h-12 w-18 p-4">
      <button class="js-change-theme focus:outline-none">🌙</button>
    </div>
  </div>
  <div v-else>
    <h1>Cargando...</h1>
  </div>


<Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">COMPLETAR TAREAS.</span>
    <div class="flex items-center gap-4 mb-4">
        <label for="username" class="font-semibold w-24">ESTADO</label>
        <Select v-model="tarea_estado.estado" :options="estados" optionLabel="name" optionValue="name" placeholder="Seleccionar Estado" class="w-full md:w-56" />
    </div>
    
    <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Cambiar Estado" @click="funCambioEstadoTarea()"></Button>
    </div>
</Dialog>

</template>

<script setup>
import { onMounted, ref } from "vue";
import authService from "../../../services/auth.service";
import { useRouter } from "vue-router";
import tareaService from "../../../services/tarea.service";

const visible = ref(false)

const perfil = ref({});
const tarea = ref()
const tarea_estado = ref({})

const estados = ref([
    { name: 'pendiente', code: 'pendiente' },
    { name: 'en progreso', code: 'en progreso' },
    { name: 'completado', code: 'completado' }
]);

const router = useRouter();

onMounted(() => {
  getPerfil();
});

const getPerfil = async () => {
  const { data } = await authService.profile();
  perfil.value = data;
};

function obtenerDatos() {
  console.log(perfil.value.name);
  console.log(perfil.value.email);
}

const funSalir = async function () {
  await authService.logout();
  localStorage.removeItem("access_token");

  router.push({ name: "Login" });
};

const mostrarTareaDialog = (data) => {
	visible.value = true
	tarea.value = data.id
}

const funCambioEstadoTarea =async  () => {
	await tareaService.actualizarEstadoTarea(tarea.value, tarea_estado.value);
	visible.value = false;
	getPerfil();
}
</script>
