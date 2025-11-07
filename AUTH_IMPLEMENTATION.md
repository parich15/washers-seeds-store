# Implementación de Sistema de Autenticación con Directus

## 📋 Resumen

Se ha implementado un sistema completo de autenticación (Login/Register) utilizando la API de Directus. Los usuarios registrados se asignan automáticamente al rol con ID: `a4769662-1a68-4285-bf32-9ce8023e2294`.

## 🏗️ Arquitectura

### Endpoints API (Server-side)

#### 1. `/api/auth/login.post.ts`
- **Descripción**: Autentica usuarios con Directus
- **Método**: POST
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "rememberMe": "boolean"
  }
  ```
- **Respuesta**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string",
        "email": "string",
        "firstName": "string",
        "lastName": "string",
        ...
      },
      "access_token": "string",
      "refresh_token": "string",
      "expires": "number"
    }
  }
  ```

#### 2. `/api/auth/register.post.ts`
- **Descripción**: Registra nuevos usuarios y los asigna al rol especificado
- **Método**: POST
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string (opcional)",
    "acceptTerms": "boolean"
  }
  ```
- **Funcionalidades**:
  - Crea usuario en Directus
  - Asigna automáticamente el rol: `a4769662-1a68-4285-bf32-9ce8023e2294`
  - Inicia sesión automáticamente después del registro

#### 3. `/api/auth/me.get.ts`
- **Descripción**: Obtiene información del usuario autenticado
- **Método**: GET
- **Headers**: `Authorization: Bearer {token}`
- **Respuesta**: Datos del usuario actual

#### 4. `/api/auth/refresh.post.ts`
- **Descripción**: Refresca el access token usando el refresh token
- **Método**: POST
- **Body**:
  ```json
  {
    "refresh_token": "string"
  }
  ```

### Store de Autenticación (`app/stores/auth.ts`)

**Estado**:
```typescript
{
  user: User | null,
  token: string | null,
  refreshToken: string | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null
}
```

**Acciones principales**:
- `login(credentials)`: Autentica usuario
- `register(data)`: Registra nuevo usuario
- `logout()`: Cierra sesión y limpia localStorage
- `checkAuth()`: Restaura sesión desde localStorage
- `verifyToken()`: Verifica validez del token
- `refreshAccessToken()`: Refresca tokens expirados
- `updateProfile(data)`: Actualiza perfil del usuario

### Composable (`app/composables/useAuth.ts`)

Proporciona una interfaz simplificada para usar el store de autenticación:

```typescript
const { 
  isAuthenticated, 
  currentUser, 
  isLoading, 
  authError,
  login, 
  register, 
  logout,
  hasRole,
  requireAuth 
} = useAuth()
```

### Middleware (`app/middleware/auth.ts`)

Protege rutas que requieren autenticación. Redirige a `/auth/login` si el usuario no está autenticado.

**Uso en páginas**:
```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 📁 Estructura de Archivos

```
app/
├── stores/
│   └── auth.ts                    # Store de Pinia para autenticación
├── composables/
│   └── useAuth.ts                 # Composable helper para auth
├── middleware/
│   └── auth.ts                    # Middleware de protección de rutas
└── pages/
    ├── auth/
    │   ├── login.vue              # Página de inicio de sesión
    │   └── register.vue           # Página de registro
    └── user/
        ├── profile.vue            # Perfil (protegido)
        └── orders.vue             # Pedidos (protegido)

server/
└── api/
    └── auth/
        ├── login.post.ts          # Endpoint de login
        ├── register.post.ts       # Endpoint de registro
        ├── me.get.ts              # Endpoint de usuario actual
        └── refresh.post.ts        # Endpoint de refresh token

types/
└── user.ts                        # Tipos TypeScript para auth
```

## 🔐 Flujo de Autenticación

### Registro de Usuario
1. Usuario completa formulario en `/auth/register`
2. Frontend valida datos
3. Se envía petición POST a `/api/auth/register`
4. Servidor crea usuario en Directus con rol asignado
5. Servidor autentica automáticamente al usuario
6. Se retornan tokens y datos de usuario
7. Store guarda tokens en localStorage
8. Usuario es redirigido a su perfil

### Inicio de Sesión
1. Usuario completa formulario en `/auth/login`
2. Frontend valida credenciales
3. Se envía petición POST a `/api/auth/login`
4. Servidor verifica credenciales con Directus
5. Se retornan tokens y datos de usuario
6. Store guarda tokens en localStorage
7. Usuario es redirigido a su perfil

### Verificación de Sesión
1. Al cargar la aplicación, el store verifica localStorage
2. Si existen tokens, restaura la sesión
3. Verifica validez del token con `/api/auth/me`
4. Si el token expiró, intenta refrescarlo automáticamente
5. Si no puede refrescar, cierra la sesión

### Protección de Rutas
1. Páginas protegidas usan `middleware: 'auth'`
2. Al acceder, el middleware verifica autenticación
3. Si no está autenticado, redirige a `/auth/login`
4. Si está autenticado, permite el acceso

## 🔧 Configuración de Directus

**URL de Directus**: `http://161.35.46.209:8055`

**Rol asignado a nuevos usuarios**: `a4769662-1a68-4285-bf32-9ce8023e2294`

### Campos requeridos en la colección `directus_users`:
- `email` (string, único)
- `password` (hash)
- `first_name` (string)
- `last_name` (string)
- `role` (UUID del rol)
- `phone` (string, opcional)

## 🚀 Uso

### Login en componentes
```vue
<script setup>
const { login, isLoading, authError } = useAuth()

const handleLogin = async () => {
  const result = await login(email, password, rememberMe)
  if (result.success) {
    // Login exitoso
  }
}
</script>
```

### Registro en componentes
```vue
<script setup>
const { register, isLoading, authError } = useAuth()

const handleRegister = async () => {
  const result = await register({
    email,
    password,
    firstName,
    lastName,
    phone,
    acceptTerms
  })
  if (result.success) {
    // Registro exitoso
  }
}
</script>
```

### Proteger rutas
```vue
<script setup>
// Automáticamente redirige a login si no está autenticado
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Verificar autenticación
```vue
<script setup>
const { isAuthenticated, currentUser } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    Bienvenido {{ currentUser.firstName }}
  </div>
  <div v-else>
    Por favor inicia sesión
  </div>
</template>
```

## 📝 Notas Importantes

1. **Seguridad**: Los tokens se almacenan en localStorage. Para producción, considera usar httpOnly cookies.

2. **Refresh de Tokens**: El sistema intenta automáticamente refrescar tokens expirados antes de cerrar sesión.

3. **Validación**: Tanto el frontend como el backend validan los datos de entrada.

4. **Errores**: Los errores de Directus se capturan y se presentan de forma amigable al usuario.

5. **SSR**: El middleware está configurado para evitar errores en server-side rendering.

## 🔄 Próximas Mejoras

- [ ] Implementar "Olvidé mi contraseña"
- [ ] Agregar autenticación de dos factores (2FA)
- [ ] Implementar verificación de email
- [ ] Agregar OAuth (Google, Facebook)
- [ ] Mejorar manejo de errores de red
- [ ] Implementar logout desde el servidor
- [ ] Agregar logs de auditoría

## 🐛 Troubleshooting

### Error: "Invalid credentials"
- Verificar que el usuario existe en Directus
- Verificar que la contraseña es correcta
- Verificar que el usuario tiene un rol asignado

### Error: "Token expired"
- El sistema debería refrescar automáticamente
- Si persiste, verificar que el refresh token es válido
- Cerrar sesión y volver a iniciar

### Error: "Role not found"
- Verificar que el rol `a4769662-1a68-4285-bf32-9ce8023e2294` existe en Directus
- Verificar permisos del rol

### Usuario no puede acceder después del registro
- Verificar que el rol asignado tiene permisos de lectura
- Verificar que la autenticación se completó correctamente
- Revisar logs del servidor

## 📞 Contacto y Soporte

Para problemas o preguntas sobre la implementación, contactar al equipo de desarrollo.
