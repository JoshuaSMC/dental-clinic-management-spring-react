# 🦷 Atelier Dental

Aplicación web para la gestión interna de una clínica odontológica.  
Permite administrar odontólogos, pacientes y turnos con **control de acceso basado en roles (RBAC)**:  
los **administradores** gestionan el equipo y los usuarios del sistema; los **recepcionistas** registran pacientes y manejan la agenda diaria.

🌐 **Demo en vivo:** [atelier-dental.netlify.app](https://atelier-dental.netlify.app)

---

## ⚙️ Tecnologías

### 🖥️ Frontend
| Librería | Uso |
|----------|-----|
| React 19 + Vite | UI y bundler |
| TypeScript | Tipado estático |
| Tailwind CSS v4 | Estilos utilitarios (CSS-first config) |
| Framer Motion | Animaciones de entrada |
| React Hook Form + Zod | Formularios con validación en cliente |
| Axios | Llamadas HTTP + interceptores JWT |
| React Router v7 | Ruteo con guards por rol |
| Sonner | Notificaciones toast |

### ☕ Backend
| Tecnología | Uso |
|------------|-----|
| Java 21 + Spring Boot 3.3 | API REST |
| Spring Security + JWT (JJWT) | Autenticación stateless + autorización por rol |
| Spring Data JPA + Hibernate | Capa de persistencia |
| Bean Validation (grupos) | Validación diferenciada create/update |
| H2 (in-memory) | Base de datos de desarrollo |
| JUnit 5 + MockMvc | Tests de servicios, controladores e integración |

---

## 🗂️ Estructura del proyecto

```
DentalClinic/
├── backend/                        # Spring Boot — API REST pura (sin archivos estáticos)
│   └── src/main/java/com/dh/DentalClinic/
│       ├── auth/                   # LoginRequest, RegisterRequest, AuthenticationService
│       ├── configuration/          # SecurityConfig, JwtService, JwtAuthFilter,
│       │                           # ApplicationConfig (CORS), DataInitializer
│       ├── controller/             # AppointmentController, DentistController,
│       │                           # PatientController, UserController
│       ├── dto/                    # AppointmentDTO, DentistDTO, PatientDTO, AddressDTO
│       ├── entity/                 # Appointment, Dentist, Patient, User, Address, Role
│       ├── exception/              # ResourceNotFoundException, GlobalExceptionHandler
│       ├── repository/             # IAppointment-, IDentist-, IPatient-, IUserRepository
│       ├── service/                # Interfaces + impl/
│       └── validation/             # ValidationGroups (OnCreate / OnUpdate)
│
└── frontend/                       # React + Vite
    └── src/
        ├── api/                    # Clientes Axios: auth, dentists, patients,
        │                           # appointments, users + instancia base con
        │                           # interceptor 401 → logout automático
        ├── components/
        │   ├── layout/             # Header, Layout
        │   └── ui/                 # Button, Input, Modal, Skeleton, Logo
        ├── context/                # AuthContext: token, user, isAdmin, logoutRef
        ├── hooks/                  # useDentists, usePatients, useAppointments, useUsers
        ├── pages/                  # Landing, Login, Dashboard, Dentists, Patients,
        │                           # Appointments, Users, NotFound
        └── types/                  # Interfaces TypeScript compartidas
```

---

## 🚀 Instalación local

### 🧩 Requisitos
- Java 21+
- Node.js 20+
- Docker (opcional, para levantar todo junto)

### 📦 Clonar el repositorio
```bash
git clone https://github.com/JoshuaSMC/dental-clinic-app.git
cd dental-clinic-app
```

---

### ☕ Backend

El backend requiere variables de entorno para arrancar:

| Variable | Obligatoria | Descripción |
|----------|:-----------:|-------------|
| `JWT_SECRET` | ✅ | Clave Base64 de mínimo 256 bits para firmar tokens JWT |
| `ADMIN_SECRET` | ✅ | Clave secreta para autorizar la creación de nuevos admins vía `POST /auth/register-admin` |
| `ADMIN_INITIAL_PASSWORD` | ❌ | Contraseña del admin de demo creado por `DataInitializer` (default: `Admin@Dental2025!`) |
| `CORS_ALLOWED_ORIGINS` | ❌ | Orígenes permitidos para CORS, separados por coma (default: `http://localhost:5173,http://localhost:3000`) |

```bash
cd backend

# Generar un JWT_SECRET seguro (solo la primera vez):
# openssl rand -base64 32

export JWT_SECRET=<tu-clave-base64-256bits>
export ADMIN_SECRET=<clave-para-registrar-admins>

./mvnw spring-boot:run
```

> API disponible en `http://localhost:8081`

**Consola H2** (solo en perfil `dev`):
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
# → http://localhost:8081/h2-console
# JDBC URL: jdbc:h2:mem:dental1  |  Usuario: sa  |  Contraseña: sa
```

---

### 🖥️ Frontend

```bash
cd frontend
npm install
npm run dev
```

> Aplicación disponible en `http://localhost:5173`

El archivo `frontend/.env` apunta al backend por defecto:
```dotenv
VITE_API_URL=http://localhost:8081
```

---

### 🐳 Docker Compose

```bash
docker compose up --build
```

| Servicio   | URL |
|------------|-----|
| Frontend   | http://localhost:3000 |
| Backend    | http://localhost:8081 |
| Swagger UI | http://localhost:8081/swagger-ui.html |

Variables de entorno para Docker (crear un `.env` en la raíz):
```dotenv
JWT_SECRET=reemplazar-con-clave-base64-256bits
ADMIN_SECRET=reemplazar-con-clave-registro-admin
# Opcional — contraseña del admin de demo (default: Admin@Dental2025!)
# ADMIN_INITIAL_PASSWORD=MiPasswordSeguro123!
# Opcional — orígenes CORS adicionales para producción
# CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://tu-frontend.netlify.app
```

---

## 👤 Credenciales de demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | `admin@dental.com` | `Admin@Dental2025!` (o el valor de `ADMIN_INITIAL_PASSWORD`) |
| **Recepcionista** | _(creado por el admin)_ | _(definida al crear desde el panel Usuarios)_ |

> Al iniciar la app, `DataInitializer` crea automáticamente el admin y carga datos de demo  
> (5 odontólogos, 5 pacientes, 5 turnos próximos).  
> La contraseña inicial del admin se lee de `ADMIN_INITIAL_PASSWORD` (default: `Admin@Dental2025!`),  
> **separada** de `ADMIN_SECRET` que es la clave para registrar nuevos admins vía API.

---

## 🔐 Roles y permisos

El sistema tiene dos roles con responsabilidades claramente diferenciadas:

- **ADMIN** — gestiona el equipo, los usuarios del sistema y tiene control total sobre todos los registros.  
- **USER (Recepcionista)** — gestiona la agenda diaria: registra pacientes, edita sus datos y administra los turnos.

### Tabla de permisos

| Recurso | Acción | ADMIN | Recepcionista |
|---------|--------|:-----:|:-------------:|
| **Odontólogos** | Ver | ✅ | ✅ |
| | Crear / Editar / Eliminar | ✅ | ❌ |
| **Pacientes** | Ver | ✅ | ✅ |
| | Registrar nuevo paciente | ✅ | ✅ |
| | Editar datos (nombre, email, dirección, etc.) | ✅ | ✅ |
| | Eliminar registro permanente | ✅ | ❌ |
| **Turnos** | Ver | ✅ | ✅ |
| | Crear / Editar (reprogramar) | ✅ | ✅ |
| | Cancelar turno | ✅ | ✅ |
| | Eliminar registro (acción administrativa) | ✅ | ❌ |
| **Usuarios del sistema** | Ver / Crear / Eliminar | ✅ | ❌ |

> **Nota sobre cancelar vs. eliminar turnos:**  
> Ambas acciones llaman al mismo endpoint `DELETE /appointments/{id}`.  
> La diferencia es de contexto y UX: la recepcionista ve el botón **"Cancelar"** con un mensaje de confirmación orientado al paciente; el admin ve **"Eliminar"** con advertencia de acción irreversible.

### Aplicación del control de acceso

El control de acceso se aplica en **dos capas independientes**:

1. **Backend — Spring Security** (`SecurityConfiguration.java`): cada endpoint valida el rol del token JWT antes de llegar al controlador.
2. **Frontend — React Router guards** (`ProtectedRoute`, `AdminRoute`) + visibilidad condicional de botones: los usuarios no-admin directamente no ven las acciones que no pueden ejecutar.

---

## 📬 API REST — Endpoints

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| `POST` | `/auth/login` | Login, devuelve JWT | Público |
| `POST` | `/auth/register` | Crear usuario recepcionista | ADMIN |
| `POST` | `/auth/register-admin` | Crear usuario admin (requiere clave secreta) | ADMIN |
| `GET` | `/api/users` | Listar usuarios del sistema | ADMIN |
| `DELETE` | `/api/users/{id}` | Eliminar usuario | ADMIN |
| `GET` | `/odontologos` | Listar odontólogos | Autenticado |
| `POST` | `/odontologos` | Crear odontólogo | ADMIN |
| `PUT` | `/odontologos` | Actualizar odontólogo _(id en el body)_ | ADMIN |
| `DELETE` | `/odontologos/{id}` | Eliminar odontólogo | ADMIN |
| `GET` | `/patients` | Listar pacientes | Autenticado |
| `GET` | `/patients/{id}` | Obtener paciente por id | Autenticado |
| `POST` | `/patients` | Crear paciente | Autenticado |
| `PUT` | `/patients` | Actualizar paciente _(id en el body)_ | Autenticado |
| `DELETE` | `/patients/{id}` | Eliminar paciente | ADMIN |
| `GET` | `/appointments` | Listar turnos | Autenticado |
| `GET` | `/appointments/{id}` | Obtener turno por id | Autenticado |
| `POST` | `/appointments` | Crear turno | Autenticado |
| `PUT` | `/appointments` | Actualizar turno _(id en el body)_ | Autenticado |
| `DELETE` | `/appointments/{id}` | Cancelar / eliminar turno | Autenticado |

> 📌 Swagger UI (local): `http://localhost:8081/swagger-ui.html`  
> 📌 Swagger UI (producción): `https://dental-clinic-app-production-9c34.up.railway.app/swagger-ui.html`

---

## 🧪 Testing

```bash
cd backend
./mvnw test
```

**54 tests — 0 fallos**

| Suite | Tests | Qué verifica |
|-------|-------|-------------|
| `SecurityIntegrationTest` | 15 | Reglas de roles con filtros reales activos: sin token → 401, USER en endpoint ADMIN → 403, accesos permitidos → 200 |
| `PatientServiceTest` | 5 | CRUD de pacientes, incluyendo que `update()` no copia `address.id` del DTO (prevención de IDOR) |
| `DentistServiceTest` | 7 | CRUD completo de odontólogos |
| `AppointmentServiceTest` | 7 | CRUD de turnos, validación de fecha `@FutureOrPresent` solo en create |
| `PatientControllerTest` | 5 | Respuestas HTTP del controlador de pacientes |
| `DentistControllerTest` | 4 | Respuestas HTTP del controlador de odontólogos |
| `AppointmentControllerTest` | 6 | Respuestas HTTP del controlador de turnos |
| `AuthControllerTest` | 4 | Login correcto e incorrecto |
| `DentalClinicApplicationTests` | 1 | Context load |

---

## 👤 Autor

- [@JoshuaSMC](https://github.com/JoshuaSMC)

---

## 📄 Licencia

MIT
