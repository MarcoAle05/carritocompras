const conferencias = [
    { id: 1, carrera: 'IME', nombre: 'La Mecánica de Fluidos en los Procesos Químicos y Biológicos', ponente: 'Dr. David Israel Posadas Navarro', lugar: 'Auditorio CTA', dia: 'Martes 22 de septiembre', horario: '12:00 PM – 1:30 PM', costo: 100, img: 'img/curso1.jpg' },
    { id: 2, carrera: 'ICO', nombre: 'CLUB LINDA & IMEF: Conoce nuestros proyectos', ponente: 'CLUB LIMA & IMEF', lugar: 'Auditorio A9', dia: 'Martes 22 de septiembre', horario: '1:30 PM – 2:30 PM', costo: 80, img: 'img/curso2.jpg' },
    { id: 3, carrera: 'IEE', nombre: 'Origen y desarrollo del Sistema Eléctrico Nacional: de Porfirio Díaz a AMLO', ponente: 'Ing. Marco Antonio Calderón', lugar: 'Auditorio Vasconcelos', dia: 'Miércoles 23 de septiembre', horario: '11:00 AM – 1:00 PM', costo: 120, img: 'img/curso3.jpg' },
    { id: 4, carrera: 'ICO', nombre: 'Alimentación, estudio y emociones', ponente: 'QFB. Paula Reyes', lugar: 'Auditorio DUACyD', dia: 'Miércoles 23 de septiembre', horario: '1:30 PM – 2:30 PM', costo: 80, img: 'img/curso4.jpg' },
    { id: 5, carrera: 'ICI', nombre: 'Tiempo extra · Taller FIBRACONCRET (presencial)', ponente: 'Ing. David Alejandro Torres Montaño; Ing. Mayra Alejandra Trejo Duval; Ing. Javier Chavarria Torres', lugar: 'L-4', dia: 'Jueves 24 de septiembre', horario: '11:00 AM – 1:00 PM', costo: 150, img: 'img/curso5.jpg' }
];

const $ = id => document.getElementById(id);
const dinero = n => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let carrito = []; // [{ id, cantidad }]

const total = () => carrito.reduce((t, i) => t + conferencias.find(c => c.id === i.id).costo * i.cantidad, 0);

function pintarConferencias() {
    $('conferencias').innerHTML = conferencias.map(c => `
        <div class="card">
            <img src="${c.img}" alt="${esc(c.nombre)}">
            <div class="info-card">
                <p class="semana">${c.carrera} · ${c.dia}</p>
                <h4>${esc(c.nombre)}</h4>
                <p class="dato"><strong>Ponente:</strong> ${esc(c.ponente)}</p>
                <p class="dato"><strong>Lugar:</strong> ${c.lugar}</p>
                <p class="dato"><strong>Horario:</strong> ${c.horario}</p>
                <p class="costo">${dinero(c.costo)}</p>
                <a href="#" class="button-primary button input agregar-carrito" data-id="${c.id}">Agregar al carrito</a>
            </div>
        </div>`).join('');
}

function pintarCarrito() {
    $('lista-carrito').querySelector('tbody').innerHTML = carrito.map(i => {
        const c = conferencias.find(x => x.id === i.id);
        return `<tr>
            <td>${esc(c.nombre)}</td>
            <td>${i.cantidad}</td>
            <td>${dinero(c.costo * i.cantidad)}</td>
            <td><a href="#" class="borrar-curso" data-id="${c.id}" title="Quitar">X</a></td>
        </tr>`;
    }).join('');
    const vacio = carrito.length === 0;
    $('vacio').style.display = vacio ? '' : 'none';
    $('lista-carrito').style.display = vacio ? 'none' : '';
    const t = dinero(total());
    $('total-carrito').textContent = t;
    $('total-header').textContent = t;
}

$('conferencias').addEventListener('click', e => {
    const btn = e.target.closest('.agregar-carrito');
    if (!btn) return;
    e.preventDefault();
    const id = Number(btn.dataset.id);
    const item = carrito.find(i => i.id === id);
    item ? item.cantidad++ : carrito.push({ id, cantidad: 1 });
    pintarCarrito();
});

$('lista-carrito').addEventListener('click', e => {
    const btn = e.target.closest('.borrar-curso');
    if (!btn) return;
    e.preventDefault();
    carrito = carrito.filter(i => i.id !== Number(btn.dataset.id));
    pintarCarrito();
});

$('vaciar-carrito').addEventListener('click', e => {
    e.preventDefault();
    carrito = [];
    pintarCarrito();
});

// Pago
const modal = $('modal-pago');
const cerrarModal = () => modal.classList.remove('abierto');

$('pagar').addEventListener('click', e => {
    e.preventDefault();
    if (!carrito.length) { alert('Agrega al menos una conferencia al carrito.'); return; }
    $('total-pago').textContent = dinero(total());
    $('error-pago').textContent = '';
    document.querySelectorAll('input[name="tarjeta"]').forEach(r => r.checked = false);
    $('paso-pago').hidden = false;
    $('paso-confirmacion').hidden = true;
    modal.classList.add('abierto');
});

$('cancelar-pago').addEventListener('click', cerrarModal);

$('confirmar-pago').addEventListener('click', () => {
    const tarjeta = document.querySelector('input[name="tarjeta"]:checked');
    if (!tarjeta) { $('error-pago').textContent = 'Selecciona una tarjeta para continuar.'; return; }
    const boletos = carrito.reduce((n, i) => n + i.cantidad, 0);
    $('msg-confirmacion').textContent =
        `Se cobraron ${dinero(total())} a tu tarjeta ${tarjeta.value} por ${boletos} boleto(s). ¡Gracias por tu compra!`;
    carrito = [];
    pintarCarrito();
    $('paso-pago').hidden = true;
    $('paso-confirmacion').hidden = false;
});

$('cerrar-confirmacion').addEventListener('click', cerrarModal);

pintarConferencias();
pintarCarrito();
