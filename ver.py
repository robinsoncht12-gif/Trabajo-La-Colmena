import sqlite3
import os
print("Estoy en:", os.getcwd())
con = sqlite3.connect('LaColmena.db')
cur = con.cursor()
cur.execute("SELECT * FROM productos")
rows = cur.fetchall()
print("TOTAL productos:", len(rows))
for r in rows:
    print(r)