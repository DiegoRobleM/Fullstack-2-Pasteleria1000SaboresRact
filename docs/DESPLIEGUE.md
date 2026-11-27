# Despliegue en AWS EC2

Front y backend de Pastelería 1000 Sabores corren en una misma instancia EC2 (Ubuntu, t3.micro).

## Arquitectura

| Parte | Dónde | Puerto |
|---|---|---|
| Front (React, build estático) | Nginx en EC2, `/var/www/pasteleria` | 80 |
| Backend (Spring Boot, `app.jar`) | Servicio systemd `pasteleria` en EC2 | 8080 |
| Base de datos | AWS RDS MySQL (`fullstack2`) | 3306 |

Nginx entrega el front y reenvía las rutas `/api` al backend (`127.0.0.1:8080`). Para el navegador todo es un solo origen, por lo que el front pide `/api` en forma relativa.

## Security Group

Entrada: 22 (SSH), 80 (web) y 8080 (API directa, útil para pruebas con Swagger).

## Backend

- `app.jar` en `/home/ubuntu`, ejecutado con perfil `rds`.
- Variables de entorno en `/etc/pasteleria.env` (permisos 600): `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `ADMIN_PASSWORD`. No se suben al repositorio.
- Servicio `pasteleria` (systemd) con reinicio automático.

```bash
sudo systemctl status pasteleria
sudo systemctl restart pasteleria
sudo journalctl -u pasteleria -n 30 --no-pager
```

## Publicar o actualizar el front

En PowerShell, dentro de `FrontPasteleria`:

```powershell
$env:VITE_URL_API="/api"
npm run build
$key="$env:USERPROFILE\Downloads\PASSWORD.pem"
$srv="ubuntu@<IP_PUBLICA>"
ssh -i $key $srv "mkdir -p ~/dist"
scp -i $key -r dist\* "${srv}:~/dist/"
ssh -i $key $srv "sudo rm -rf /var/www/pasteleria && sudo mkdir -p /var/www/pasteleria && sudo cp -r ~/dist/* /var/www/pasteleria/"
```

## Configuración de Nginx

Archivo `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80 default_server;
    root /var/www/pasteleria;
    index index.html;
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
    location / {
        try_files $uri /index.html;
    }
}
```

Verificar y recargar: `sudo nginx -t && sudo systemctl restart nginx`.

## Desarrollo local

Copiar `FrontPasteleria/.env.example` como `.env`, poner la IP pública vigente y ejecutar `npm run dev`. En este modo el front corre en `localhost:5173` y llama directo al puerto 8080, por lo que actúa `CorsConfig`.

## Nota sobre la IP

La IP pública cambia si el laboratorio de AWS se reinicia. El front publicado no necesita reconstruirse (usa `/api`), pero hay que abrir la IP nueva y actualizar el `.env` local y la documentación.
