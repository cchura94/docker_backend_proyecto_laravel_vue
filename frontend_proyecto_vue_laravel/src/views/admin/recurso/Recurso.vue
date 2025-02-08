<template>
  <div class="card">
    <Toast />

    <Button label="Nuevo Recurso" @click="visible = true" />

    <Dialog
      v-model:visible="visible"
      modal
      header="Datos de Recurso"
      :style="{ width: '30rem' }"
    >
      <span class="text-surface-500 dark:text-surface-400 block mb-8"
        >Ingrese datos del Recurso.</span
      >
      <div class="flex items-center gap-4 mb-4">
        <label for="nom" class="font-semibold w-24">Nombre</label>
        <InputText
          id="nom"
          class="flex-auto"
          autocomplete="off"
          v-model="recurso.nombre"
        />
        <Message
          v-if="errors.nombre"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.nombre }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="tipo" class="font-semibold w-24">TIPO</label>
        <InputText
          id="tipo"
          class="flex-auto"
          autocomplete="off"
          v-model="recurso.tipo"
        />
        <Message
          v-if="errors.tipo"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.tipo }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="precio" class="font-semibold w-24">PRECIO</label>
        <InputText
          id="precio"
          class="flex-auto"
          autocomplete="off"
          v-model="recurso.precio"
        />
        <Message
          v-if="errors.precio"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.precio }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="stock_disponible" class="font-semibold w-24">STOCK DISPONIBLE</label>
        <InputText
          id="stock_disponible"
          class="flex-auto"
          autocomplete="off"
          v-model="recurso.stock_disponible"
        />
        <Message
          v-if="errors.stock_disponible"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.stock_disponible }}</Message
        >
      </div>

      <div class="flex items-center gap-4 mb-8">
        <label for="unidad" class="font-semibold w-24">UNIDAD</label>
        <InputText
          id="unidad"
          class="flex-auto"
          autocomplete="off"
          v-model="recurso.unidad"
        />
        <Message
          v-if="errors.unidad"
          severity="error"
          size="small"
          variant="simple"
          >{{ errors.unidad }}</Message
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

    <DataTable :value="recursos" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="nombre" header="NOMBRE"></Column>
      <Column field="tipo" header="TIPO"></Column>
      <Column field="precio" header="PRECIO"></Column>
      <Column field="stock_disponible" header="STOCK"></Column>
      <Column field="unidad" header="UNIDAD"></Column>
      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-user"
            rounded
            outlined
            severity="warn"
            class="mr-2"
            @click="formNuevoPersona(slotProps.data)"
            v-if="!slotProps.data.persona"
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
</template>
<script setup>
import { onMounted, ref } from "vue";
import recursoService from "./../../../services/recurso.service.js";

const recursos = ref([]);
const visible = ref(false);
const recurso = ref({});
const errors = ref({});

onMounted(() => {
  getRecursos();
});

const getRecursos = async () => {
  const { data } = await recursoService.listar();
  recursos.value = data;
};

const funGuardar = async () => {
    try {
        const {data} = await recursoService.guardar(recurso.value);
        
        getRecursos();
    
        visible.value = false;
        recurso.value = {}
        
    } catch (error) {
        console.log(error);
        alert("Error al registra el recurso");
    }

}
</script>
