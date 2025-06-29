import { salaService, authService } from '../../services/apiServices.js';
import { router } from '../../router/index.js';

// --- Helper Function (Función de Ayuda) ---
// Para crear elementos de forma más limpia.
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}

export const SalasListPage = async (app) => {
    // Protección de la ruta en el frontend
    const token = localStorage.getItem('token');
    if (!token) {
        router.navigate('login');
        return;
    }

    const user = authService.getCurrentUser();

    // Limpiamos el contenido previo de la app
    app.innerHTML = '';

    // --- Creación de Elementos del DOM ---
    const mainContainer = createElement('div');

    const title = createElement('h1', {}, ['Salas Disponibles']);
    const welcomeText = createElement('p', {}, [`Bienvenido, ${user ? user.nombre : 'Invitado'}! (Rol: ${user ? user.rol : 'N/A'})`]);
    const logoutButton = createElement('button', { id: 'logout-button' }, ['Cerrar Sesión']);
    const hr1 = createElement('hr');
    
    // Añadimos los elementos iniciales al contenedor principal
    mainContainer.appendChild(title);
    mainContainer.appendChild(welcomeText);
    mainContainer.appendChild(logoutButton);
    mainContainer.appendChild(hr1);

    // --- Lógica del Formulario de Administrador ---
    if (user && user.rol === 'admin') {
        const adminFormContainer = createElement('div', { id: 'admin-form-container' });
        
        const formTitle = createElement('h3', {}, ['Crear Nueva Sala']);
        
        const inputNombre = createElement('input', { type: 'text', id: 'nombre', placeholder: 'Nombre de la sala', required: '' });
        const inputCapacidad = createElement('input', { type: 'number', id: 'capacidad', placeholder: 'Capacidad', required: '' });
        const inputUbicacion = createElement('input', { type: 'text', id: 'ubicacion', placeholder: 'Ubicación', required: '' });
        const submitButton = createElement('button', { type: 'submit' }, ['Crear Sala']);
        
        const createRoomForm = createElement('form', { id: 'create-room-form' }, [
            inputNombre, inputCapacidad, inputUbicacion, submitButton
        ]);

        const formMessage = createElement('p', { id: 'form-message' });
        const hr2 = createElement('hr');

        adminFormContainer.appendChild(formTitle);
        adminFormContainer.appendChild(createRoomForm);
        adminFormContainer.appendChild(formMessage);
        
        mainContainer.appendChild(adminFormContainer);
        mainContainer.appendChild(hr2);
    }
    
    // --- Contenedores para la lista y errores ---
    const listTitle = createElement('h2', {}, ['Lista de Salas']);
    const roomsListContainer = createElement('div', { id: 'rooms-list' });
    const roomsError = createElement('p', { id: 'rooms-error', class: 'error-message' });

    mainContainer.appendChild(listTitle);
    mainContainer.appendChild(roomsListContainer);
    mainContainer.appendChild(roomsError);
    
    // Añadimos el contenedor principal al div 'app'
    app.appendChild(mainContainer);


    // --- Función para cargar y renderizar las salas ---
    const loadRooms = async () => {
        roomsListContainer.innerHTML = 'Cargando...'; // Mantenemos esto para feedback al usuario
        roomsError.textContent = '';
        try {
            const salas = await salaService.getAll();
            roomsListContainer.innerHTML = ''; // Limpiamos antes de añadir la lista
            
            if (salas && salas.mensaje) {
                roomsListContainer.appendChild(createElement('p', {}, [salas.mensaje]));
            } else if (salas.length > 0) {
                const ul = createElement('ul');
                salas.forEach(sala => {
                    const li = createElement('li', {}, [`${sala.nombre} (Capacidad: ${sala.capacidad})`]);
                    ul.appendChild(li);
                });
                roomsListContainer.appendChild(ul);
            } else {
                 roomsListContainer.appendChild(createElement('p', {}, ['No se encontraron salas.']));
            }
        } catch(error) {
            roomsListContainer.innerHTML = '';
            roomsError.textContent = 'Error al cargar las salas.';
            console.error(error);
        }
    };
    
    // Cargar las salas al iniciar la página
    loadRooms();

    // --- Lógica de Eventos ---
    if (user && user.rol === 'admin') {
        const createForm = document.getElementById('create-room-form');
        const formMessage = document.getElementById('form-message');

        if (!salaService.create) { // Añadir el método de servicio si no existe
            salaService.create = async (salaData) => {
                const res = await fetch('http://localhost:3001/api/salas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(salaData)
                });
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.message || 'No se pudo crear la sala');
                }
                return res.json();
            };
        }

        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const salaData = {
                nombre: document.getElementById('nombre').value,
                capacidad: parseInt(document.getElementById('capacidad').value),
                ubicacion: document.getElementById('ubicacion').value
            };
            try {
                const result = await salaService.create(salaData);
                formMessage.textContent = result.mensaje;
                formMessage.setAttribute('style', 'color: green;');
                createForm.reset();
                loadRooms();
            } catch (error) {
                formMessage.textContent = error.message;
                formMessage.setAttribute('style', 'color: red;');
            }
        });
    }

    document.getElementById('logout-button').addEventListener('click', () => {
        authService.logout();
        router.navigate('login');
    });
};
