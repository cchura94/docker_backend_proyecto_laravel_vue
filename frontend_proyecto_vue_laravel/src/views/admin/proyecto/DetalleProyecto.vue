<template>
  <div class="w-full mx-auto p-6 bg-white rounded-lg shadow-lg mb-8">
    <h2 class="text-3xl font-semibold text-gray-800 mb-4">Detalle Proyecto</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <p class="font-medium text-gray-600">Nombre del Proyecto</p>
        <p class="text-lg font-semibold text-gray-800">{{ proyecto.nombre }}</p>
      </div>
      <div>
        <p class="font-medium text-gray-600">Descripción</p>
        <p class="text-lg text-gray-700">{{ proyecto.descripcion }}</p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <p class="font-medium text-gray-600">Fecha Inicio</p>
        <p class="text-lg font-semibold text-gray-800">
          {{ proyecto.fecha_inicio }}
        </p>
      </div>
      <div>
        <p class="font-medium text-gray-600">Fecha Fin</p>
        <p class="text-lg text-gray-700">{{ proyecto.fecha_fin }}</p>
      </div>
    </div>
    <div class="mb-6">
      <div class="flex items-center">
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width: 65%"></div>
        </div>
        <span class="ml-4 text-lg font-semibold text-gray-800">10.00%</span>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div class="p-6 bg-white rounded-lg shadow-lg">
      <p class="font-medium text-gray-600">Tareas</p>

      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="Nueva Tarea"
            icon="pi pi-plus"
            class="mr-2"
            @click="tareaDialog = true"
          />
        </template>

        <template #end>
          <Button
            label="Exportar"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable :value="tareas" size="small">
        <Column field="nombre" header="Nombre"></Column>
        <Column field="fecha_inicio" header="F. Inicio"></Column>
        <Column field="fecha_fin" header="F. Fin"></Column>
        <Column field="estado" header="Estado"></Column>
        <Column field="prioridad" header="Prioridad"></Column>
        <Column field="porcentaje_avance" header="%"></Column>
        <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-user"
              rounded
              outlined
              severity="warn"
              class="mr-2"
              @click="formAsignarTareaUsuario(slotProps.data)"
            />
            <Button
              icon="pi pi-pencil"
              rounded
              class="mr-2"
              @click="editarUsuario(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              rounded
              severity="danger"
              @click="confirmarEliminacion(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div class="p-6 bg-white rounded-lg shadow-lg">
      <p class="font-medium text-gray-600">RECURSOS ASIGNADOS</p>

      <Toolbar class="mb-6">
        <template #start>
          <Button
            label="Asignar RECURSO"
            icon="pi pi-plus"
            class="mr-2"
            @click="recursoDialog = true"
          />
        </template>

        <template #end>
          <Button
            label="Exportar"
            icon="pi pi-upload"
            severity="secondary"
            @click="exportCSV($event)"
          />
        </template>
      </Toolbar>

      <DataTable :value="proyecto.recursos" size="small">
        <Column
          field="pivot.fecha_asignacion"
          header="FECHA ASIGNACIÓN"
        ></Column>
        <Column field="pivot.cantidad_asignada" header="CANT"></Column>
        <Column field="nombre" header="NOMBRE"></Column>
        <Column field="tipo" header="TIPO"></Column>
        <Column field="pivot.responsable_id" header="RESPONSABLE"></Column>
      </DataTable>
    </div>
  </div>

  <div class="w-full mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-3xl font-semibold text-gray-800 mb-4">Informes</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div>
        <Toolbar class="mb-6">
          <template #start>
            <Button
              label="REGISTRAR INFORME"
              icon="pi pi-plus"
              class="mr-2"
              @click="registroInformeDialog = true"
            />
          </template>
        </Toolbar>

        <p class="font-medium text-gray-600">Informes de Avance</p>
        <DataTable :value="proyecto.informes" size="small">
          <Column field="fecha" header="FECHA"></Column>
          <Column field="descripcion" header="DESCRIPCION"></Column>
          <Column field="archivo" header="ARCHIVO">
            
          </Column>
          <Column :exportable="false" style="min-width: 12rem">
          <template #body="slotProps">
            <a :href="`http://127.0.0.1:8000/${slotProps.data.archivo}`" target="_blank">DESCARGAR ARCHIVO</a>
          </template>
        </Column>
        </DataTable>
      </div>
    </div>

    <!--
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
                <p class="font-medium text-gray-600">Tareas</p>
                <p class="text-lg font-semibold text-gray-800">proyecto.No hay Tareas asignadas</p>

            </div>
            <div>
                <p class="font-medium text-gray-600">Tareas</p>
                <p class="text-lg font-semibold text-gray-800">proyecto.No hay Tareas asignadas</p>

            </div>
        </div>
    -->
    <pre>{{ proyecto }}</pre>

    <Dialog
      v-model:visible="tareaDialog"
      :style="{ width: '450px' }"
      header="Nueva tarea"
      :modal="true"
    >
      <div class="flex flex-col gap-6">
        <div>
          <label for="name" class="block font-bold mb-3">Nombre</label>
          <InputText
            id="name"
            v-model.trim="tarea.nombre"
            required="true"
            autofocus
            :invalid="submitted && !tarea.nombre"
            fluid
          />
          <small v-if="submitted && !tarea.nombre" class="text-red-500"
            >Nombre de tarea es Obligatorio.</small
          >
        </div>
        <div>
          <label for="description" class="block font-bold mb-3"
            >Descripción</label
          >
          <Textarea
            id="description"
            v-model="tarea.descripcion"
            required="true"
            rows="3"
            cols="20"
            fluid
          />
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-6">
            <label for="description" class="block font-bold mb-3"
              >Fecha INICIO</label
            >
            <DatePicker v-model="tarea.fecha_inicio" fluid />
          </div>

          <div class="col-span-6">
            <label for="description" class="block font-bold mb-3"
              >Fecha FIN</label
            >
            <DatePicker v-model="tarea.fecha_fin" fluid />
          </div>
        </div>

        <!--

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <InputNumber id="quantity" v-model="product.quantity" integeronly fluid />
                    </div>
                </div>
                -->
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" @click="guardarTarea()" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="recursoDialog"
      :style="{ width: '450px' }"
      header="ASIGNAR RECURSO"
      :modal="true"
    >
      {{ recurso_proyecto }}
      <div class="flex flex-col gap-6">
        <div>
          <Select
            v-model="recurso_proyecto.recurso_id"
            :options="recursos"
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccionar un Recurso"
            class="w-full md:w-56"
            fluid
          />
        </div>

        <div>
          <label for="cantidad_asignada" class="block font-bold mb-3"
            >cantidad_asignada</label
          >
          <InputNumber
            id="cantidad_asignada"
            v-model="recurso_proyecto.cantidad_asignada"
            integeronly
            fluid
          />
        </div>
        <div>
          <label for="cantidad_asignada" class="block font-bold mb-3"
            >Seleccionar Responsable</label
          >

          <Select
            v-model="recurso_proyecto.responsable_id"
            :options="usuarios"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar Responsable"
            class="w-full md:w-56"
            fluid
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Guardar" icon="pi pi-check" @click="asignarRecurso()" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="dialogAsignarTarea"
      :style="{ width: '450px' }"
      header="DETALLES TAREA"
      :modal="true"
    >
      <ProgressBar
        mode="indeterminate"
        style="height: 6px"
        v-if="cargandoDatos"
      ></ProgressBar>

      <div class="flex flex-col gap-6" v-else>
        <div>
          <label for="cantidad_asignada" class="block font-bold mb-3"
            >Asignar Nuevo Usuario</label
          >

          <Select
            v-model="tarea_usuario_data.user_id"
            :options="usuarios"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccionar Usuario"
            class="w-full md:w-56"
            fluid
          />
          <Button
            label="Asignar como parte de la Tarea"
            icon="pi pi-check"
            @click="asignarUsuario()"
          />
        </div>
        <div>
          <DataTable :value="tarea.users" size="small">
            <Column field="id" header="ID"></Column>
            <Column field="name" header="NOMBRE"></Column>
            <Column field="email" header="CORREO"></Column>
            <Column header="ACCION"> </Column>
          </DataTable>
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          @click="dialogAsignarTarea = false"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="registroInformeDialog"
      :style="{ width: '450px' }"
      header="REGISTRAR INFORME"
      :modal="true"
    >
      {{ informe }}
      <div class="flex flex-col gap-6">
        <div>
          <input type="file" @change="seleccionarArchivo($event)" fluid />
        </div>

        <div>
          <label for="desc" class="block font-bold mb-3">Descripcion</label>
          <Textarea v-model="informe.descripcion" rows="5" cols="30" fluid />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="registroInformeDialog=false" />
        <Button label="Guardar Informe" icon="pi pi-check" @click="guardarInforme()" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import proyectoService from "../../../services/proyecto.service";
import recursoService from "../../../services/recurso.service";
import tareaService from "../../../services/tarea.service";
import usuarioService from "../../../services/usuario.service";

const proyecto = ref({});
const tareas = ref([]);
const route = useRoute();
const tarea = ref({});
const tareaDialog = ref(false);
const recursoDialog = ref(false);
const recurso_proyecto = ref({});
const recursos = ref([]);
const usuarios = ref([]);
const dialogAsignarTarea = ref(false);
const tarea_usuario_data = ref({});
const cargandoDatos = ref(false);
const registroInformeDialog = ref(false);
const informe = ref({});
const archvo_seleccionado = ref(null);

onMounted(() => {
  getProyecto();
  getRecursos();
  getUsuarios();
});

const getProyecto = async () => {
  const id = route.params.id;
  const { data } = await proyectoService.mostrar(id);
  proyecto.value = data;
  tareas.value = data.tareas;
};

const guardarTarea = async () => {
  tarea.value.proyecto_id = route.params.id;
  tarea.value.estado = "pendiente";
  tarea.value.prioridad = "baja";

  const { data } = await tareaService.guardar(tarea.value);
  tareaDialog.value = false;
  getProyecto();
};

const getRecursos = async () => {
  const { data } = await recursoService.listar();
  recursos.value = data;
};

const getUsuarios = async () => {
  const { data } = await usuarioService.listar();
  usuarios.value = data;
};

const asignarRecurso = async () => {
  recurso_proyecto.value.proyecto_id = route.params.id;

  const { data } = await proyectoService.asignarRecurso(
    route.params.id,
    recurso_proyecto.value
  );

  recursoDialog.value = false;
  recurso_proyecto.value = {};
  getProyecto();
};

const formAsignarTareaUsuario = async (dataTarea) => {
  dialogAsignarTarea.value = true;
  mostrarTarea(dataTarea.id);
};

const asignarUsuario = async () => {
  cargandoDatos.value = true;
  const { data } = await tareaService.asignarUsuario(
    tarea.value.id,
    tarea_usuario_data.value
  );
  mostrarTarea(tarea.value.id);
  cargandoDatos.value = false;
};

const mostrarTarea = async (id) => {
  cargandoDatos.value = true;
  const { data } = await tareaService.mostrar(id);
  tarea.value = data;

  cargandoDatos.value = false;
};

const seleccionarArchivo = (event) => {
  archvo_seleccionado.value = event.target.files[0];
}

const guardarInforme = async () =>{

  const formData = new FormData();
  formData.append('archivo', archvo_seleccionado.value);
  formData.append('descripcion', informe.value.descripcion);

  const {data} = await proyectoService.asignarInforme(route.params.id, formData);

  registroInformeDialog.value = false;
  getProyecto()

}
</script>
