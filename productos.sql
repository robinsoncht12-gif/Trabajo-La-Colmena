-- SQLite dump by SQLite Viewer & Editor
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE productos (
                    codigo TEXT PRIMARY KEY,
                    nombre TEXT NOT NULL,
                    descripcion TEXT,
                    categoria TEXT,
                    precio REAL NOT NULL,
                    stock_disponible INTEGER NOT NULL,
                    requiere_receta INTEGER DEFAULT 0
                );
INSERT INTO "productos" ("codigo", "nombre", "descripcion", "categoria", "precio", "stock_disponible", "requiere_receta") VALUES ('CAN-001', 'Arroz 1000mg', 'Antibiótico de amplio espectro', 'Antibióticos', 25000, 50, 1);
INSERT INTO "productos" ("codigo", "nombre", "descripcion", "categoria", "precio", "stock_disponible", "requiere_receta") VALUES ('CAN-002', 'Acetaminofén 500mg', 'Analgésico y antipirético', 'Analgésicos', 4500, 150, 0);
INSERT INTO "productos" ("codigo", "nombre", "descripcion", "categoria", "precio", "stock_disponible", "requiere_receta") VALUES ('CAN-003', 'Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 'Antiinflamatorios', 7800, 80, 0);
INSERT INTO "productos" ("codigo", "nombre", "descripcion", "categoria", "precio", "stock_disponible", "requiere_receta") VALUES ('CAN-004', 'Loratadina 10mg', 'Antihistamínico para alergias', 'Antialérgicos', 12000, 60, 0);
INSERT INTO "productos" ("codigo", "nombre", "descripcion", "categoria", "precio", "stock_disponible", "requiere_receta") VALUES ('CAN-005', 'Suero Oral Electrolitos 500ml', 'Solución hidratante oral', 'Hidratación', 6500, 40, 0);
COMMIT;
