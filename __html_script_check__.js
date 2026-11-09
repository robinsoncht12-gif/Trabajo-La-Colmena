
        const CLAVE_USUARIOS = 'lacolmena.usuarios';

        function obtenerUsuarios() {
            let guardados = localStorage.getItem(CLAVE_USUARIOS);
            if (!guardados) return [];

            let usuarios = JSON.parse(guardados);
            if (!Array.isArray(usuarios)) {
                throw new Error('Los datos de usuarios guardados no tienen un formato válido.');
            }
            return usuarios;
        }

        function guardarUsuarios(usuarios) {
            localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        }

        function codificarBase64(bytes) {
            return btoa(String.fromCharCode(...bytes));
        }

        function decodificarBase64(valor) {
            return Uint8Array.from(atob(valor), caracter => caracter.charCodeAt(0));
        }

        async function crearHash(clave, sal) {
            if (!crypto.subtle) {
                throw new Error('El registro requiere abrir la aplicación desde http://localhost, no como archivo local.');
            }
            let material = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(clave),
                'PBKDF2',
                false,
                ['deriveBits']
            );
            let bits = await crypto.subtle.deriveBits({
                name: 'PBKDF2',
                salt: decodificarBase64(sal),
                iterations: 120000,
                hash: 'SHA-256'
            }, material, 256);
            return codificarBase64(new Uint8Array(bits));
        }

        function iniciales(nombre) {
            return nombre.trim().split(/\s+/).slice(0, 2).map(parte => parte[0]).join('').toUpperCase();
        }

        function iniciarSesion(nombre, rol) {
            document.getElementById('usuario-nombre').textContent = nombre;
            document.getElementById('usuario-rol').textContent = rol;
            document.getElementById('usuario-iniciales').textContent = iniciales(nombre);
            document.getElementById('login').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            mostrar('resumen');
        }

        async function entrar() {
            let correo = document.getElementById('correo').value.trim().toLowerCase();
            let clave = document.getElementById('clave').value;
            if (correo === 'demo@lacolmena.co' && clave === 'demo123') {
                iniciarSesion('Ana Martínez', 'Administradora');
                return;
            }

            try {
                let usuario = obtenerUsuarios().find(item => item.correo === correo);
                if (!usuario || await crearHash(clave, usuario.sal) !== usuario.hash) {
                    alert('Correo o contraseña incorrectos.');
                    return;
                }
                iniciarSesion(usuario.nombre, 'Usuario');
            } catch (error) {
                console.error('No se pudo iniciar sesión:', error);
                alert(error.message || 'No se pudieron leer las cuentas registradas.');
            }
        }

        async function registrarUsuario(evento) {
            evento.preventDefault();
            let nombre = document.getElementById('registro-nombre').value.trim();
            let correo = document.getElementById('registro-correo').value.trim().toLowerCase();
            let clave = document.getElementById('registro-clave').value;
            let confirmar = document.getElementById('registro-confirmar').value;
            let mensaje = document.getElementById('registro-mensaje');
            mensaje.textContent = '';

            if (!nombre) {
                mensaje.textContent = 'Escribe tu nombre.';
                return;
            }
            if (clave.length < 8) {
                mensaje.textContent = 'La contraseña debe tener al menos 8 caracteres.';
                return;
            }
            if (clave !== confirmar) {
                mensaje.textContent = 'Las contraseñas no coinciden.';
                return;
            }
            if (correo === 'demo@lacolmena.co') {
                mensaje.textContent = 'Ese correo está reservado para la cuenta de demostración.';
                return;
            }

            try {
                let usuarios = obtenerUsuarios();
                if (usuarios.some(usuario => usuario.correo === correo)) {
                    mensaje.textContent = 'Ya existe una cuenta con ese correo.';
                    return;
                }

                let salAleatoria = crypto.getRandomValues(new Uint8Array(16));
                let sal = codificarBase64(salAleatoria);
                usuarios.push({
                    nombre,
                    correo,
                    sal,
                    hash: await crearHash(clave, sal)
                });
                guardarUsuarios(usuarios);

                document.getElementById('correo').value = correo;
                document.getElementById('clave').value = '';
                document.getElementById('registro-form').reset();
                mostrarLogin();
                alert('Usuario registrado. Ya puedes iniciar sesión con tu correo y contraseña.');
            } catch (error) {
                console.error('No se pudo registrar el usuario:', error);
                mensaje.textContent = error.message || 'No se pudo guardar el usuario en este navegador.';
            }
        }

        function mostrarRegistro() {
            document.getElementById('login-form').hidden = true;
            document.getElementById('demo-acceso').hidden = true;
            document.getElementById('crear-cuenta').hidden = true;
            document.getElementById('registro-panel').hidden = false;
            document.getElementById('registro-nombre').focus();
        }

        function mostrarLogin() {
            document.getElementById('registro-panel').hidden = true;
            document.getElementById('login-form').hidden = false;
            document.getElementById('demo-acceso').hidden = false;
            document.getElementById('crear-cuenta').hidden = false;
            document.getElementById('registro-mensaje').textContent = '';
        }
        function salir() {
            document.getElementById('dashboard').style.display = 'none';
            document.getElementById('login').style.display = 'flex';
            document.getElementById('usuario-nombre').textContent = 'Ana Martínez';
            document.getElementById('usuario-rol').textContent = 'Administradora';
            document.getElementById('usuario-iniciales').textContent = 'AM';
        }
        function mostrar(sec) {
            const secciones = {
                resumen: ['Resumen', 'As\u00ed se mueve tu operaci\u00f3n hoy.'],
                portafolio: ['Portafolio', 'Consulta y administra tus productos.'],
                inventario: ['Inventario', 'Revisa existencias y alertas de stock.'],
                ventas: ['Ventas', 'Consulta y registra las ventas del negocio.'],
                pedidos: ['Pedidos', 'Da seguimiento a los pedidos abiertos.'],
                reportes: ['Reportes', 'Indicadores de la operaci\u00f3n comercial.'],
                usuarios: ['Usuarios', 'Administra los usuarios del sistema.']
            };
            if (!Object.prototype.hasOwnProperty.call(secciones, sec)) return;
            Object.keys(secciones).forEach(s => {
                document.getElementById('sec-' + s).classList.toggle('activa', s === sec);
                document.getElementById('b-' + s).classList.toggle('activo', s === sec);
            });
            document.getElementById('titulo-seccion').textContent = secciones[sec][0];
            document.getElementById('subtitulo-seccion').textContent = secciones[sec][1];
        }
        function agregar() {
            let n = document.getElementById('nombre').value.trim();
            let pr = Number(document.getElementById('precio').value);
            if (!n || !Number.isFinite(pr) || pr <= 0 || !Number.isInteger(pr)) {
                alert('Escribe un nombre y un precio entero mayor que cero');
                return;
            }
            let fila = document.createElement('tr');
            let nombre = document.createElement('td');
            let precio = document.createElement('td');
            nombre.textContent = n;
            precio.textContent = '$' + pr.toLocaleString('es-CO');
            fila.append(nombre, precio);
            document.getElementById('lista').appendChild(fila);
            document.getElementById('nombre').value = ''; document.getElementById('precio').value = '';
            alert('Producto agregado ✅');
        }
    