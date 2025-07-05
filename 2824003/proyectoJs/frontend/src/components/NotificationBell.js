import { notificacionService } from '../services/apiServices.js';

export const NotificationBell = {
  container: null,
  // 1. Añadimos una propiedad para guardar el ID del temporizador
  intervalId: null,

  async init(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) return;

    this.render();
    this.addEventListeners();
    await this.updateCount();
    
    // 2. Guardamos el ID del temporizador cuando lo creamos
    this.intervalId = setInterval(() => this.updateCount(), 60000);
  },
  
  // 3. NUEVO MÉTODO para destruir el componente y limpiar el temporizador
  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.container) {
      this.container.innerHTML = ''; // Limpiamos el HTML para evitar fugas de memoria
    }
  },

  render() {
    const styles = `
      .notification-bell { position: relative; }
      .notification-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #e74c3c;
        color: white;
        border-radius: 50%;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: bold;
        display: none;
      }
      .notifications-panel {
        display: none;
        position: absolute;
        right: 0;
        top: 100%;
        width: 350px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        z-index: 1000;
        max-height: 400px;
        overflow-y: auto;
      }
      .notifications-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      .notifications-header h4 { margin: 0; }
      #mark-all-read-btn { font-size: 12px; cursor: pointer; color: #007bff; background: none; border: none; }
      .notifications-list { list-style: none; padding: 0; margin: 0; }
      .notification-item { padding: 1rem; border-bottom: 1px solid #eee; }
      .notification-item:last-child { border-bottom: none; }
      .notification-item.unread { background-color: #f9f9f9; }
      .notification-item p { margin: 0; font-size: 14px; }
      .notification-item small { font-size: 12px; color: #888; }
    `;

    this.container.innerHTML = `
      <style>${styles}</style>
      <div class="notification-bell">
        <button id="bell-icon-btn" style="position: relative; background: none; border: none; font-size: 1.5rem; cursor: pointer;">
          🔔
          <span class="notification-badge"></span>
        </button>
        <div class="notifications-panel">
          <div class="notifications-header">
            <h4>Notificaciones</h4>
            <button id="mark-all-read-btn">Marcar todas como leídas</button>
          </div>
          <ul class="notifications-list">
            <li><p style="padding: 1rem; text-align: center;">Cargando...</p></li>
          </ul>
        </div>
      </div>
    `;
  },

  addEventListeners() {
    const bellBtn = document.getElementById('bell-icon-btn');
    const panel = this.container.querySelector('.notifications-panel');

    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = panel.style.display === 'block';
      panel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) {
        this.loadNotifications();
      }
    });

    document.getElementById('mark-all-read-btn').addEventListener('click', async () => {
        await notificacionService.markAllAsRead();
        this.loadNotifications();
        this.updateCount();
    });

    document.addEventListener('click', (e) => {
      if (this.container && !this.container.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  },

  async updateCount() {
    try {
      // Añadimos una verificación para no hacer la llamada si no hay token
      if (!localStorage.getItem('token')) {
        this.destroy(); // Si no hay token, nos destruimos
        return;
      }
      const { unreadCount } = await notificacionService.getUnreadCount();
      const badge = this.container.querySelector('.notification-badge');
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    } catch (error) {
      console.error("Error al actualizar contador de notificaciones:", error);
    }
  },

  async loadNotifications() {
    try {
        const list = this.container.querySelector('.notifications-list');
        list.innerHTML = `<li><p style="padding: 1rem; text-align: center;">Cargando...</p></li>`;
        const notificaciones = await notificacionService.getAll();

        if(notificaciones.length === 0) {
            list.innerHTML = `<li><p style="padding: 1rem; text-align: center;">No tienes notificaciones.</p></li>`;
            return;
        }

        list.innerHTML = notificaciones.map(n => `
            <li class="notification-item ${n.leida ? '' : 'unread'}">
                <p>${n.mensaje}</p>
                <small>${new Date(n.fecha_creacion).toLocaleString()}</small>
            </li>
        `).join('');

    } catch (error) {
        console.error("Error al cargar notificaciones:", error);
        this.container.querySelector('.notifications-list').innerHTML = `<li><p style="padding: 1rem; text-align: center; color: red;">Error al cargar.</p></li>`;
    }
  }
};