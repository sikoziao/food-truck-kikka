import React, { useState } from 'react';

// Menú demostrativo estilo Street Food para Food Truck Kikka (Arturo Prat, Temuco)
const MENU_ITEMS = [
  {
    id: 1,
    nombre: 'Burger Kikka Doble Smash',
    categoria: 'Burgers & Sándwiches',
    precio: 7500,
    descripcion:
      'Doble carne a la plancha, doble queso cheddar fundido, tocino crocante, cebolla caramelizada y salsa especial Kikka en pan brioche.',
    imagen:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    destacado: true,
    personalizable: true,
  },
  {
    id: 2,
    nombre: 'Churrasco Italiano XL',
    categoria: 'Burgers & Sándwiches',
    precio: 6500,
    descripcion:
      'Abundante carne de vacuno a la plancha en pan amasado/frica caliente, palta recién molida, tomate en rodajas y mayonesa.',
    imagen:
      'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    destacado: true,
    personalizable: true,
  },
  {
    id: 3,
    nombre: 'Mechada Queso Caliente',
    categoria: 'Burgers & Sándwiches',
    precio: 6800,
    descripcion:
      'Carne mechada casera en su jugo con doble lámina de queso mantecoso fundido a la plancha.',
    imagen:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    destacado: false,
    personalizable: true,
  },
  {
    id: 4,
    nombre: 'Completo Italiano Gigante',
    categoria: 'Completos & Ass',
    precio: 3200,
    descripcion:
      'Vienesa premium o carne (As) en pan suave al vapor con tomate en cubitos, palta hass y mayonesa a elección.',
    imagen:
      'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=80',
    destacado: true,
    personalizable: true,
  },
  {
    id: 5,
    nombre: 'As Luco / Dinámico',
    categoria: 'Completos & Ass',
    precio: 4200,
    descripcion:
      'Carne de vacuno picada a la plancha en pan de completo con queso fundido o versión dinámico completo.',
    imagen:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
    destacado: false,
    personalizable: true,
  },
  {
    id: 6,
    nombre: 'Papas Supremas Kikka (Para 2)',
    categoria: 'Papas & Combos',
    precio: 6500,
    descripcion:
      'Bandeja grande de papas fritas crujientes con salsa de queso cheddar, tocino picado y cebollín fresco.',
    imagen:
      'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    destacado: true,
    personalizable: false,
  },
  {
    id: 7,
    nombre: 'Salchipapas Clásica',
    categoria: 'Papas & Combos',
    precio: 4000,
    descripcion:
      'Porción individual abundante de papas fritas recién salidas con vienesas doradas a la plancha.',
    imagen:
      'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=80',
    destacado: false,
    personalizable: false,
  },
  {
    id: 8,
    nombre: 'Bebida Lata 350ml (Bien Helada)',
    categoria: 'Bebidas',
    precio: 1500,
    descripcion:
      'Coca-Cola Original, Coca-Cola Zero, Fanta o Sprite en lata de 350ml.',
    imagen:
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    destacado: false,
    personalizable: false,
  },
];

const CATEGORIAS = [
  'Todos',
  'Burgers & Sándwiches',
  'Completos & Ass',
  'Papas & Combos',
  'Bebidas',
];

export default function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // Modal de personalización para Food Truck (Salsas y agregados)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [salsa, setSalsa] = useState('Mayo Casera');
  const [toqueExtra, setToqueExtra] = useState('Normal (Con todo)');

  // Datos del cliente (Solo retiro / servir en el lugar)
  const [nombreCliente, setNombreCliente] = useState('');
  const [modalidad, setModalidad] = useState('Para llevar (Retiro)');
  const [horaRetiro, setHoraRetiro] = useState('En 15 minutos');
  const [notas, setNotas] = useState('');

  // Lógica de Horario de Atención
  const verificarHorario = () => {
    const ahora = new Date();
    const horaActual = ahora.getHours() + ahora.getMinutes() / 60;
    return horaActual >= 12 && horaActual < 23.5;
  };

  const estaAbierto = verificarHorario();

  const formatoCLP = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(valor);
  };

  const productosFiltrados = MENU_ITEMS.filter((item) => {
    const coincideCategoria =
      categoriaActiva === 'Todos' || item.categoria === categoriaActiva;
    const coincideBusqueda =
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const manejarClickAgregar = (producto) => {
    if (producto.personalizable) {
      setProductoSeleccionado(producto);
      setSalsa('Mayo Casera');
      setToqueExtra('Normal (Con todo)');
    } else {
      agregarAlCarrito(producto, null, null);
    }
  };

  const agregarAlCarrito = (producto, opSalsa, opExtra) => {
    const claveUnica = `${producto.id}-${opSalsa || 'base'}-${
      opExtra || 'base'
    }`;

    setCarrito((prev) => {
      const existe = prev.find((item) => item.claveUnica === claveUnica);
      if (existe) {
        return prev.map((item) =>
          item.claveUnica === claveUnica
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...producto,
          claveUnica,
          salsa: opSalsa,
          toqueExtra: opExtra,
          cantidad: 1,
        },
      ];
    });
    setProductoSeleccionado(null);
  };

  const cambiarCantidad = (claveUnica, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.claveUnica === claveUnica) {
            return { ...item, cantidad: item.cantidad + delta };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const totalCarrito = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  // Enviar pedido a WhatsApp (Solo retiro / servir acá)
  const enviarPedidoWhatsApp = () => {
    // Número oficial de Food Truck Kikka: 56926393375
    const telefonoWhatsApp = '56926393375';

    const lineas = [
      `*NUEVO PEDIDO - FOOD TRUCK KIKKA*`,
      `----------------------------------`,
      `*Cliente:* ${nombreCliente || 'Sin especificar'}`,
      `*Modalidad:* ${modalidad}`,
      `*Paso a retirar:* ${horaRetiro}`,
      `----------------------------------`,
      `*DETALLE DEL PEDIDO:*`,
      ...carrito.map((item) => {
        const opciones = item.salsa
          ? ` (${item.salsa}, ${item.toqueExtra})`
          : '';
        return `- ${item.cantidad}x ${item.nombre}${opciones} - ${formatoCLP(
          item.precio * item.cantidad
        )}`;
      }),
      ...(notas ? [`\n*Notas:* ${notas}`] : []),
      `----------------------------------`,
      `*TOTAL A PAGAR: ${formatoCLP(totalCarrito)}*`,
    ];

    const mensaje = lineas.join('\n');
    const url = `https://api.whatsapp.com/send?phone=${telefonoWhatsApp}&text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-28 font-sans text-left">
      {/* HEADER HERO */}
      <header className="relative bg-gradient-to-b from-orange-950/80 via-stone-900 to-stone-950 border-b border-stone-800 pt-6 pb-5 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div>
              {estaAbierto ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Abierto • Pide y retira sin fila
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Cerrado ahora • Pide por WhatsApp
                </span>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                🚚 Food Truck Kikka
              </h1>
              <p className="text-stone-400 text-sm mt-1">
                Street Food & Sándwiches • Arturo Prat, Temuco ⭐ 5.0
              </p>
            </div>
            <a
              href="https://api.whatsapp.com/send?phone=56926393375"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-end bg-stone-800/90 hover:bg-stone-700 border border-stone-700 px-3 py-2 rounded-xl text-xs transition shrink-0"
            >
              <span className="text-stone-400">WhatsApp Directo</span>
              <span className="font-bold text-orange-400 text-sm">
                +56 9 2639 3375
              </span>
            </a>
          </div>

          {/* BUSCADOR */}
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar burger, churrasco, completo, papas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-stone-900/90 border border-stone-700/80 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-orange-500 transition"
            />
            <svg
              className="w-4 h-4 text-stone-400 absolute left-3.5 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* CATEGORÍAS */}
      <nav className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                categoriaActiva === cat
                  ? 'bg-orange-500 text-stone-950 shadow-md shadow-orange-500/20'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* GRILLA DE PRODUCTOS */}
      <main className="max-w-3xl mx-auto px-4 pt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden flex flex-row md:flex-col justify-between hover:border-stone-700 transition"
            >
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {producto.destacado && (
                      <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                        🔥 Más Pedido
                      </span>
                    )}
                    <span className="text-xs text-stone-400">
                      {producto.categoria}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white leading-snug">
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {producto.descripcion}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-orange-400">
                    {formatoCLP(producto.precio)}
                  </span>
                  <button
                    onClick={() => manejarClickAgregar(producto)}
                    className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 shadow-sm"
                  >
                    <span>+ Agregar</span>
                  </button>
                </div>
              </div>

              <div className="w-28 sm:w-36 md:w-full md:h-40 relative shrink-0">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL PARA ELEGIR SALSAS Y PREFERENCIAS */}
      {productoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {productoSeleccionado.nombre}
                </h3>
                <p className="text-xs text-stone-400">
                  Elige tus salsas y preferencias
                </p>
              </div>
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="text-stone-400 hover:text-white text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="my-4">
              <label className="block text-xs font-bold uppercase text-stone-300 mb-2">
                1. Elige tu Mayo / Salsa:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Mayo Casera',
                  'Mayo al Ajo',
                  'Mayo + Ketchup/Mostaza',
                  'Sin Mayo',
                ].map((op) => (
                  <button
                    key={op}
                    onClick={() => setSalsa(op)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                      salsa === op
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : 'bg-stone-800 border-stone-700 text-stone-300'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-4">
              <label className="block text-xs font-bold uppercase text-stone-300 mb-2">
                2. Toque extra:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Normal (Con todo)', 'Toque de Ají', 'Salsa Verde'].map(
                  (op) => (
                    <button
                      key={op}
                      onClick={() => setToqueExtra(op)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border text-center transition ${
                        toqueExtra === op
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                          : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                    >
                      {op}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              onClick={() =>
                agregarAlCarrito(productoSeleccionado, salsa, toqueExtra)
              }
              className="w-full mt-2 bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold py-3 rounded-xl shadow-lg transition"
            >
              Confirmar y Agregar • {formatoCLP(productoSeleccionado.precio)}
            </button>
          </div>
        </div>
      )}

      {/* BARRA FLOTANTE DEL CARRITO */}
      {carrito.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-gradient-to-t from-stone-950 via-stone-950/95 to-transparent">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setCarritoAbierto(true)}
              className="w-full bg-orange-500 hover:bg-orange-400 text-stone-950 font-extrabold py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5">
                <span className="bg-stone-950 text-orange-400 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  {totalItems}
                </span>
                <span className="text-sm sm:text-base">Ver mi pedido</span>
              </div>
              <span className="text-base sm:text-lg font-black">
                {formatoCLP(totalCarrito)}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL DEL CARRITO Y CHECKOUT (SOLO RETIRO EN LOCAL) */}
      {carritoAbierto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-stone-900 w-full max-w-md h-full flex flex-col justify-between overflow-hidden">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                🛒 Tu Pedido en Food Truck Kikka
              </h2>
              <button
                onClick={() => setCarritoAbierto(false)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 w-8 h-8 rounded-full font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-2.5">
                {carrito.map((item) => (
                  <div
                    key={item.claveUnica}
                    className="bg-stone-800/80 border border-stone-700/70 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="pr-2">
                      <h4 className="font-bold text-sm text-white">
                        {item.nombre}
                      </h4>
                      {item.salsa && (
                        <p className="text-xs text-orange-400 font-medium">
                          {item.salsa} • {item.toqueExtra}
                        </p>
                      )}
                      <span className="text-xs text-stone-300 font-semibold">
                        {formatoCLP(item.precio * item.cantidad)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-lg border border-stone-700">
                      <button
                        onClick={() => cambiarCantidad(item.claveUnica, -1)}
                        className="text-stone-300 hover:text-white font-bold px-1.5"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => cambiarCantidad(item.claveUnica, 1)}
                        className="text-orange-400 hover:text-orange-300 font-bold px-1.5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Datos para retirar en el Food Truck
                </h3>

                <input
                  type="text"
                  placeholder="Tu nombre (Para llamarte cuando esté listo)"
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-orange-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  {['Para llevar (Retiro)', 'Servir acá'].map((tipo) => (
                    <button
                      key={tipo}
                      onClick={() => setModalidad(tipo)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                        modalidad === tipo
                          ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                          : 'bg-stone-800 border-stone-700 text-stone-400'
                      }`}
                    >
                      {tipo === 'Para llevar (Retiro)'
                        ? '🛍️ Para llevar'
                        : '🍔 Servir acá'}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1.5">
                    ¿En cuánto pasas por el Food Truck (Arturo Prat)?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Estoy acá afuera', 'En 15 minutos', 'En 30 minutos'].map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setHoraRetiro(t)}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                            horaRetiro === t
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-stone-800 border-stone-700 text-stone-400'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <textarea
                  rows="2"
                  placeholder="Notas adicionales (Ej: sin tomate, pago con transferencia...)"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="p-4 border-t border-stone-800 bg-stone-950 space-y-2.5">
              <div className="flex justify-between items-center text-base font-extrabold">
                <span className="text-stone-300">Total a Pagar:</span>
                <span className="text-xl text-orange-400">
                  {formatoCLP(totalCarrito)}
                </span>
              </div>

              <button
                onClick={enviarPedidoWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <span>📲 Enviar Pedido al WhatsApp de Kikka</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
