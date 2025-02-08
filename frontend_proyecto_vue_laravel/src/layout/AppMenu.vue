<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'ADMIN',
        items: [
            { label: 'Administrador', icon: 'pi pi-fw pi-home', to: '/admin' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil' }
        ]
    },
    {
        label: 'SEGURIDAD',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/admin/usuario' },
            { label: 'Roles', icon: 'pi pi-fw pi-check-square', to: '/admin/roles' },
           
        ]
    },
    {
        label: 'Proyectos',
        icon: 'pi pi-fw pi-briefcase',
        to: '/proyecto',
        items: [
            {
                label: 'Proyecto',
                icon: 'pi pi-fw pi-globe',
                to: '/admin/proyecto'
            }
        ]
    },
    {
        label: 'GESTIÓN RECURSOS',
        items: [
            {
                label: 'Recursos',
                icon: 'pi pi-fw pi-globe',
                to: '/admin/recurso'
            }
        ]
    },
    {
        label: 'Get Started',
        items: [
            {
                label: 'Documentation',
                icon: 'pi pi-fw pi-book',
                to: '/documentation'
            },
            {
                label: 'View Source',
                icon: 'pi pi-fw pi-github',
                url: 'https://github.com/primefaces/sakai-vue',
                target: '_blank'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
