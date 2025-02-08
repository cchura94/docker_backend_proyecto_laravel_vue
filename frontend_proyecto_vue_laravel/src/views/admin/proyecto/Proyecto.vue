<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="Nuevo Proyecto" icon="pi pi-plus" class="mr-2" @click="abrirDialogNuevoProyecto" />
                    <Button label="Eliminar" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProyectos || !selectedProyectos.length" />
                </template>

                <template #end>
                    
                    <Button label="EXCEL" icon="pi pi-upload" severity="secondary" @click="exportarProyectosEXCEL" />

                    <Button label="PDF" icon="pi pi-upload" severity="secondary" @click="exportarProyectosPDF" />

                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Importar" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Exportar" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProyectos"
                :value="proyectos"
                dataKey="id"
                lazy
                :paginator="true"
                :totalRecords="totalRecords"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[2, 5, 10]"
                currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} proyectos"
                @page="onPage($event)"
            >
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Gestión Proyectos</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="buscar" placeholder="Buscar..." @keyup.enter="getProyectos()"/>
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="ID" sortable style="min-width: 2rem"></Column>
                <Column field="nombre" header="Proyecto" sortable style="min-width: 16rem"></Column>
                <!--
                <Column header="Image">
                    <template #body="slotProps">
                        <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="rounded" style="width: 64px" />
                    </template>
                </Column>
                -->
                
                <Column field="fecha_inicio" header="Fecha INICIO" sortable style="min-width: 5rem"></Column>
                <Column field="fecha_fin" header="Fecha FIN" sortable style="min-width: 5rem"></Column>

                
                <Column field="estado" header="ESTADO" sortable style="min-width: 3rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.estado" :severity="getStatusLabel(slotProps.data.estado)" />
                    </template>
                </Column>
                <Column field="jefep" header="JEFE PROYECTO" sortable style="min-width: 6rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.jefe_proyecto_data.name" severity="" />
                    </template>
                </Column>
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        
                        <Button icon="pi pi-file" rounded severity="info" class="mr-2" @click="exportarProyectoPDF(slotProps.data.id)" />

                        <Button icon="pi pi-eye" rounded severity="warn" class="mr-2" @click="mostrarProyecto(slotProps.data)" />
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editarProyecto(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="proyectoDialog" :style="{ width: '450px' }" header="Nuevo Proyecto" :modal="true">
            <!--{{ proyecto }}-->
            <div class="flex flex-col gap-6">
                <!--<img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />-->
                <div>
                    <label for="name" class="block font-bold mb-3">Nombre</label>
                    <InputText id="name" v-model.trim="proyecto.nombre" required="true" autofocus :invalid="submitted && !proyecto.nombre" fluid />
                    <small v-if="submitted && !proyecto.nombre" class="text-red-500">Nombre de proyecto es Obligatorio.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Descripción</label>
                    <Textarea id="description" v-model="proyecto.descripcion" required="true" rows="3" cols="20" fluid />
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="description" class="block font-bold mb-3">Fecha INICIO</label>
                        <DatePicker v-model="proyecto.fecha_inicio" fluid />
                    </div>
    
                    <div class="col-span-6">
                        <label for="description" class="block font-bold mb-3">Fecha FIN</label>
                        <DatePicker v-model="proyecto.fecha_fin" fluid />
                    </div>

                </div>
                <div>
                    <label for="jp" class="block font-bold mb-3">Jefe Proyecto</label>
                    
                    <Select v-model="proyecto.jefe_proyecto_data" :options="usuarios" optionLabel="name" optionValue="id" placeholder="seleccionar Jefe Proyecto" class="w-full md:w-56" fluid />
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
                <Button label="Guardar" icon="pi pi-check" @click="guardarProyecto()" />
            </template>
        </Dialog>

    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import proyectoService from "./../../../services/proyecto.service"
import usuarioService from "./../../../services/usuario.service"


const selectedProyectos = ref([]);
const dt = ref();
const proyectos = ref([])
const totalRecords = ref()
const lazyParams = ref({})
const buscar = ref("")
const proyectoDialog = ref(false)
const proyecto = ref({estado: "activo"});
const submitted = ref(false);
const usuarios = ref([])

const router = useRouter()


onMounted(() => {
    getProyectos()
    getUsuarios()

    lazyParams.value = {
        first: 0,
        rows: 10,
        sortField: null,
        sortOrder: null
    }
})

const getProyectos = async () => {
    const { data } = await proyectoService.listar(lazyParams.value.page+1, lazyParams.value.rows, buscar.value)

    proyectos.value = data.data;
    totalRecords.value = data.total
}

const onPage = async (event) => {
    console.log(event)
    lazyParams.value = event
    getProyectos()
}

const exportarProyectosPDF = async () => {
    const respuesta = await proyectoService.descargarProyectosPdf();

    const url = window.URL.createObjectURL(new Blob([respuesta.data], {type: 'application/json'}));

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', 'reporte-pdf-proyectos.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const exportarProyectoPDF = async (id) => {
    const respuesta = await proyectoService.descargarPorProyectoPdf(id);

    const url = window.URL.createObjectURL(new Blob([respuesta.data], {type: 'application/pdf'}));

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', 'reporte-proyecto.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const exportarProyectosEXCEL = async () => {
    const respuesta = await proyectoService.descargarProyectosExcel();

    const url = window.URL.createObjectURL(new Blob([respuesta.data]));

    const link = document.createElement('a');
    link.href = url;

    link.setAttribute('download', 'reporte-excel-proyectos.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


const abrirDialogNuevoProyecto = () => {
    proyecto.value = {estado: "activo"}
    proyectoDialog.value = true
}

const confirmDeleteSelected = () => {

}

const exportCSV = () => {
    dt.value.exportCSV();
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'activo':
            return 'success';

        case 'completado':
            return 'warn';

        case 'cancelado':
            return 'danger';

        default:
            return null;
    }
};

const hideDialog = () => {
    proyectoDialog.value = false;
}
const guardarProyecto = async () => {

    if(proyecto.value.id){
        // modificar
        const {data} = await proyectoService.modificar(proyecto.value.id, proyecto.value)
    }else{
        // guardar
        const {data} = await proyectoService.guardar(proyecto.value)
    }
    getProyectos()
    proyectoDialog.value = false
    proyecto.value = {estado: "activo"}
}

const getUsuarios = async () => {
    const { data } = await usuarioService.listar();
    usuarios.value = data
}

const editarProyecto = (proy) => {
    proyecto.value = proy;
    proyectoDialog.value = true;
}

const mostrarProyecto = (proy) => {
    router.push(`/admin/proyecto/${proy.id}`)
}

</script>