#!/usr/bin/env python3
"""Genera le icone PNG dell'app.

    python3 tools/genera-icone.py

Disegna un piatto stilizzato con una foglia su sfondo verde sfumato, e scrive
icons/icona-180.png, icona-192.png, icona-512.png e icona-maskable-512.png.

Niente dipendenze esterne: il PNG è scritto a mano con zlib, e l'antialiasing si
ottiene calcolando l'immagine a risoluzione tripla e mediando i campioni. Basta
rilanciare lo script se si cambia il disegno.
"""

import math
import struct
import zlib
from pathlib import Path

RADICE = Path(__file__).resolve().parent.parent
CARTELLA = RADICE / "icons"

SUPERCAMPIONAMENTO = 3

# Sfumatura di sfondo, dall'angolo in alto a sinistra a quello in basso a destra.
VERDE_CHIARO = (0x1D, 0xB0, 0x84)
VERDE_SCURO = (0x0A, 0x60, 0x47)


def misto(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def dentro_quadrato_arrotondato(x, y, raggio):
    """True se (x, y), in coordinate 0..1, sta dentro il quadrato arrotondato."""
    dx = max(raggio - x, x - (1 - raggio), 0)
    dy = max(raggio - y, y - (1 - raggio), 0)
    return dx * dx + dy * dy <= raggio * raggio


def dentro_foglia(x, y, cx, cy, lunghezza, larghezza, angolo):
    """Foglia = lente fra due cerchi uguali, ruotata di `angolo` radianti."""
    dx, dy = x - cx, y - cy
    rx = dx * math.cos(-angolo) - dy * math.sin(-angolo)
    ry = dx * math.sin(-angolo) + dy * math.cos(-angolo)

    # Raggio e distanza dei due cerchi che, intersecandosi, danno la lente.
    r = (lunghezza * lunghezza / 4 + larghezza * larghezza / 4) / larghezza
    scostamento = r - larghezza / 2
    return (
        (rx * rx + (ry + scostamento) ** 2 <= r * r)
        and (rx * rx + (ry - scostamento) ** 2 <= r * r)
    )


def dentro_capsula(x, y, x0, y0, x1, y1, spessore):
    """Segmento con estremi arrotondati: distanza dal segmento entro mezzo spessore."""
    vx, vy = x1 - x0, y1 - y0
    lunghezza2 = vx * vx + vy * vy
    t = 0.0 if lunghezza2 == 0 else ((x - x0) * vx + (y - y0) * vy) / lunghezza2
    t = min(max(t, 0.0), 1.0)
    dx, dy = x - (x0 + t * vx), y - (y0 + t * vy)
    return dx * dx + dy * dy <= (spessore / 2) ** 2


def campiona(x, y, maskable):
    """Colore RGBA del punto (x, y), con x e y in 0..1."""
    if maskable:
        # Le icone maskable vengono ritagliate dal sistema: sfondo a tutta area
        # e disegno rimpicciolito dentro la zona sicura centrale.
        opaco = True
        scala = 0.72
    else:
        opaco = dentro_quadrato_arrotondato(x, y, 0.22)
        scala = 1.0

    if not opaco:
        return (0, 0, 0, 0)

    sfondo = misto(VERDE_CHIARO, VERDE_SCURO, max(0.0, min(1.0, (x + y) / 2)))

    # Coordinate del disegno, riportate al centro e scalate per la zona sicura.
    dx = (x - 0.5) / scala
    dy = (y - 0.5) / scala
    distanza = math.hypot(dx, dy)

    # Piatto: anello bianco.
    if 0.315 <= distanza <= 0.365:
        return (255, 255, 255, 255)

    # Foglia inclinata di 45° dentro il piatto, con il suo stelo.
    if dentro_foglia(dx, dy, -0.02, -0.03, 0.40, 0.20, -math.pi / 4):
        return (255, 255, 255, 255)
    if dentro_capsula(dx, dy, -0.16, 0.11, -0.235, 0.185, 0.038):
        return (255, 255, 255, 255)

    return (*sfondo, 255)


def disegna(lato, maskable):
    ss = SUPERCAMPIONAMENTO
    grande = lato * ss
    righe = []

    for py in range(lato):
        riga = bytearray()
        for px in range(lato):
            r = g = b = a = 0
            for sy in range(ss):
                for sx in range(ss):
                    x = (px * ss + sx + 0.5) / grande
                    y = (py * ss + sy + 0.5) / grande
                    cr, cg, cb, ca = campiona(x, y, maskable)
                    # Premoltiplico per non sporcare i bordi trasparenti.
                    r += cr * ca
                    g += cg * ca
                    b += cb * ca
                    a += ca
            n = ss * ss
            if a == 0:
                riga += bytes(4)
            else:
                riga += bytes((round(r / a), round(g / a), round(b / a), round(a / n)))
        righe.append(bytes(riga))
    return righe


def scrivi_png(percorso, lato, righe):
    grezzo = b"".join(b"\x00" + riga for riga in righe)

    def blocco(tipo, dati):
        return (
            struct.pack(">I", len(dati))
            + tipo
            + dati
            + struct.pack(">I", zlib.crc32(tipo + dati) & 0xFFFFFFFF)
        )

    png = (
        b"\x89PNG\r\n\x1a\n"
        + blocco(b"IHDR", struct.pack(">IIBBBBB", lato, lato, 8, 6, 0, 0, 0))
        + blocco(b"IDAT", zlib.compress(grezzo, 9))
        + blocco(b"IEND", b"")
    )
    percorso.write_bytes(png)


def main():
    CARTELLA.mkdir(exist_ok=True)
    for nome, lato, maskable in [
        ("icona-180.png", 180, False),
        ("icona-192.png", 192, False),
        ("icona-512.png", 512, False),
        ("icona-maskable-512.png", 512, True),
    ]:
        scrivi_png(CARTELLA / nome, lato, disegna(lato, maskable))
        print(f"scritta icons/{nome}")


if __name__ == "__main__":
    main()
