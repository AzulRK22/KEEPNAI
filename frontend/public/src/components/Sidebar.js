import React from 'react';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const router = useRouter();

  // Función para verificar si la ruta está activa
  const isActive = (pathname) => router.pathname === pathname;

  // Función para manejar la navegación
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/images/logo2.png" alt="Fire Eye Logo" />
      </div>
      <ul className={styles.nav}>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-inicio-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-inicio-e')}
          >
            <img src="/icons/Home.svg" alt="Home Icon" className={styles.icon} />
            <span className={styles.navText}>Inicio</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-incidentes-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-incidentes-e')}
          >
            <img src="/icons/incidentes.svg" alt="Alert Icon" className={styles.icon} />
            <span className={styles.navText}>Incidentes</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-recursos-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-recursos-e')}
          >
            <img src="/icons/recursos.svg" alt="Resources Icon" className={styles.icon} />
            <span className={styles.navText}>Recursos</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-monitoreo-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-monitoreo-e')}
          >
            <img src="/icons/monitoreo.svg" alt="Monitoring Icon" className={styles.icon} />
            <span className={styles.navText}>Monitoreo</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-reportes-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-reportes-e')}
          >
            <img src="/icons/Folder.svg" alt="Reports Icon" className={styles.icon} />
            <span className={styles.navText}>Reportes</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/dashboard-confi-e') ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard-confi-e')}
          >
            <img src="/icons/Setting.svg" alt="Settings Icon" className={styles.icon} />
            <span className={styles.navText}>Configuración</span>
          </button>
        </li>
        <li>
          <button 
            className={`${styles.navItem} ${isActive('/logout') ? styles.active : ''}`}
            onClick={() => router.push('/')}
          >
            <img src="/icons/salir.svg" alt="Logout Icon" className={styles.icon} />
            <span className={styles.navText}>Salir</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;





