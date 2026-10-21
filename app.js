const WHATSAPP="51953887354"; // cambia por tu número con código de país
// Precios: el combinado cuesta 12 y cada bebida 3 (en el carrito va junto: 15). Cámbialos aquí
const PRECIO_COMBINADO=12,PRECIO_BEBIDA=3;
// Tu único producto: el combinado. Al agregarlo al carrito el cliente elige la bebida.
// Formato: [nombre en el carrito, descripción, precio, favorito, foto del combinado, texto, bebida, descripción de la bebida, foto de la bebida]
// Los mismos nombres y precios van en api/_menu.js
const MENU={"Combinado":[
["Combinado Chapala con chicha morada","Ceviche de perico con tallarines al ají amarillo y chicha morada.",PRECIO_COMBINADO+PRECIO_BEBIDA,1,"img/combinado.jpg","Con chicha morada","Chicha morada","Bien helada y refrescante, para acompañar tu combinado.","img/chicha.jpg"],
["Combinado Chapala con maracuyá","Ceviche de perico con tallarines al ají amarillo y maracuyá.",PRECIO_COMBINADO+PRECIO_BEBIDA,1,"img/combinado.jpg","Con maracuyá","Maracuyá","Jugo de maracuyá, fresco y con su toque ácido.","img/maracuya.jpg"]]};
const $=s=>document.querySelector(s);
let cart={};try{cart=JSON.parse(localStorage.getItem("chapala-cart")||"{}")}catch(e){}
const save=()=>{try{localStorage.setItem("chapala-cart",JSON.stringify(cart))}catch(e){}};

/* Fondo animado */
(()=>{const bg=document.createElement("div");bg.className="bg";bg.setAttribute("aria-hidden","true");let h="";
for(let i=0;i<16;i++){const s=8+Math.random()*26;h+=`<i class="b" style="left:${Math.random()*100}%;width:${s}px;height:${s}px;--dx:${(Math.random()*80-40)|0}px;animation-duration:${9+Math.random()*12}s;animation-delay:-${Math.random()*15}s"></i>`}
["🐟","🐠","🐟","🦐","🐡"].forEach((e,i)=>h+=`<div class="f" style="top:${12+i*15}%;font-size:${26+i*6}px;animation-duration:${22+i*8}s;animation-delay:-${i*9}s"><span>${e}</span></div>`);
bg.innerHTML=h+'<div class="wave w2"></div><div class="wave"></div>';document.body.prepend(bg)})();

/* Carta por página */
const g=$("#grid");
if(g&&g.classList.contains("full")){const c=g.dataset.cats,L=MENU[c];
 g.innerHTML=`<article class="show"><img class="showpic" src="${L[0][4]}" alt="${g.dataset.title}" onerror="this.remove()"><div class="showtxt"><h1>${g.dataset.title}</h1><p>${g.dataset.desc}</p><button class="cta" id="addc">🛒 Agregar al carrito · S/ ${PRECIO_COMBINADO}</button><div><a class="back" href="#ingredientes">Ver ingredientes ↓</a></div></div></article>`;
 const dr=document.createElement("div");dr.id="dr";dr.hidden=true;
 dr.innerHTML=`<div class="drbox" role="dialog" aria-modal="true" aria-label="Elige tu bebida"><button class="drx" aria-label="Cerrar">✕</button><h3>Elige tu bebida</h3><p>El combinado cuesta S/ ${PRECIO_COMBINADO} y cada bebida S/ ${PRECIO_BEBIDA}. Elige una:</p><div class="drgrid">${L.map((d,i)=>`<button class="dropt" data-i="${i}"><img src="${d[8]}" alt="${d[6]}" onerror="this.remove()"><b>${d[6]}</b><span>${d[7]}</span><em>Elegir · + S/ ${PRECIO_BEBIDA}</em></button>`).join("")}</div></div>`;document.body.append(dr);
 const cerrar=()=>{dr.hidden=true};
 $("#addc").onclick=()=>{dr.hidden=false};
 dr.onclick=e=>{if(e.target===dr||e.target.closest(".drx"))return cerrar();const b=e.target.closest(".dropt");if(!b)return;const d=L[b.dataset.i];cart[d[0]]=cart[d[0]]||{n:0,p:d[2]};cart[d[0]].n++;save();upd();cerrar();
  toast.textContent="✔ Agregado: "+d[0];toast.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("on"),1800);bar.classList.remove("bump");void bar.offsetWidth;bar.classList.add("bump")};
 document.addEventListener("keydown",e=>{if(e.key==="Escape")cerrar()})}
else if(g){g.innerHTML=g.dataset.cats.split(",").map(c=>(g.dataset.cats.includes(",")?`<h2 class="sub" style="grid-column:1/-1">${c}</h2>`:"")+MENU[c].map((d,i)=>`<article class="card prod${d[3]?" hot":""}"><img class="pic" src="${d[4]}" alt="${d[0]}" loading="lazy" onerror="this.remove()"><div class="pbody"><h3>${d[0]}</h3><p>${d[1]}</p><button class="add buy" data-c="${c}" data-i="${i}" aria-label="Agregar ${d[0]} al carrito, S/ ${d[2]}">🛒 Agregar · S/ ${d[2]}</button></div></article>`).join("")).join("");
g.onclick=e=>{const b=e.target.closest(".add");if(!b)return;const d=MENU[b.dataset.c][b.dataset.i];cart[d[0]]=cart[d[0]]||{n:0,p:d[2]};cart[d[0]].n++;save();upd()}}

/* Pedido */
const bar=document.createElement("div");bar.id="cart";bar.setAttribute("role","status");
bar.innerHTML='<div id="clist" hidden></div><div class="crow"><button id="arrow" aria-expanded="false" aria-label="Ver mi carrito">▲</button><span id="ctext"></span><div><button class="clr" id="clr">Vaciar</button> <button id="send">Pedir</button></div></div>';document.body.append(bar);
let open=false;
function upd(){const k=Object.keys(cart),n=k.reduce((a,x)=>a+cart[x].n,0),t=k.reduce((a,x)=>a+cart[x].n*cart[x].p,0);
 if(!n)open=false;bar.classList.toggle("on",n>0);$("#ctext").textContent=`Pedido (${n}) · S/ ${t}`;
 $("#arrow").setAttribute("aria-expanded",open);$("#arrow").setAttribute("aria-label",open?"Ocultar mi carrito":"Ver mi carrito");$("#clist").hidden=!open;
 $("#clist").innerHTML=k.map(x=>`<div class="ci"><span>${x}</span><span><button class="q" data-x="${x}" data-d="-1" aria-label="Quitar uno de ${x}">−</button> ${cart[x].n} <button class="q" data-x="${x}" data-d="1" aria-label="Agregar uno de ${x}">+</button></span><span>S/ ${cart[x].n*cart[x].p}</span></div>`).join("")}
$("#arrow").onclick=()=>{open=!open;upd()};
$("#clist").onclick=e=>{const b=e.target.closest(".q");if(!b)return;const x=b.dataset.x;cart[x].n+=+b.dataset.d;if(cart[x].n<=0)delete cart[x];save();upd()};
$("#clr").onclick=()=>{cart={};save();upd()};
$("#send").onclick=()=>{const k=Object.keys(cart),t=k.reduce((a,x)=>a+cart[x].n*cart[x].p,0);const txt="Hola Combinados Chapala, quiero pedir:\n"+k.map(x=>`- ${cart[x].n} x ${x}`).join("\n")+`\nTotal: S/ ${t}`;window.open(`https://wa.me/953887354?text=${encodeURIComponent(txt)}`,"_blank")};
const wa=$("#wa");if(wa)wa.href=`https://wa.me/953887354`;upd();

/* Pantalla de carga (solo inicio, una vez por visita) */
const L=$("#loader");
if(L){let seen=false;try{seen=sessionStorage.getItem("chapala-in")}catch(e){}
const open=()=>{L.classList.add("out");document.body.classList.remove("lock");try{sessionStorage.setItem("chapala-in","1")}catch(e){}};
if(seen){L.remove();document.body.classList.remove("lock")}else{
const TIPS=["Un buen combinado se comparte entre dos.","Pide por WhatsApp y evita la cola.","El pescado se elige fresco cada mañana.","¿Eres de picante? Pide tu leche de tigre extra."];
const f=$("#fill"),p=$("#pct"),t=$("#tip"),m=$("#msg");let v=0,i=0;t.textContent=TIPS[0];const ti=setInterval(()=>t.textContent=TIPS[++i%TIPS.length],1600);
const iv=setInterval(()=>{v=Math.min(100,v+Math.random()*7+2);f.style.width=v+"%";p.textContent=Math.floor(v)+"%";if(v>=100){clearInterval(iv);m.textContent="¡Todo listo!";L.classList.add("ready")}},120);
const go=()=>{if(L.classList.contains("ready")){clearInterval(ti);open()}};
L.addEventListener("click",go);L.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")go()});L.focus()}}

/* ===== Extras ===== */
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
// emojis en los platos
const EM=[["leche","🥛"],["ceviche","🐟"],["jalea","🍤"],["chicharr","🍤"],["chicha","🍇"],["limon","🍋"],["gaseosa","🥤"],["","🍽️"]];
document.querySelectorAll("#grid .card:not(.prod) h3").forEach(h=>{const t=h.textContent.toLowerCase();const e=EM.find(x=>t.includes(x[0]))[1];h.insertAdjacentHTML("afterbegin",`<span class="dem" aria-hidden="true">${e}</span>`)});
// aviso al agregar
const toast=document.createElement("div");toast.id="toast";toast.setAttribute("role","status");document.body.append(toast);let tt;
if(g)g.addEventListener("click",e=>{const b=e.target.closest(".add");if(!b)return;
 toast.textContent="✔ Agregado: "+MENU[b.dataset.c][b.dataset.i][0];toast.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove("on"),1600);
 bar.classList.remove("bump");void bar.offsetWidth;bar.classList.add("bump")});
// botón flotante de WhatsApp
const fab=document.createElement("a");fab.className="wafab";fab.target="_blank";fab.rel="noopener";fab.setAttribute("aria-label","Escribir por WhatsApp");fab.href=`https://wa.me/953887354`;fab.textContent="💬";document.body.append(fab);
// abierto / cerrado (hora de Lima, 11:00 a 17:00)
const op=$("#open");if(op){const hr=+new Date().toLocaleString("en-US",{timeZone:"America/Lima",hour:"numeric",hour12:false})%24;
 if(hr>=11&&hr<17)op.textContent="Abierto ahora · hasta las 5:00 pm";else{op.textContent="Cerrado · abrimos a las 11:00 am";op.classList.add("off")}}
// aparecer al hacer scroll
const els=document.querySelectorAll(".card,.box,.stat,.title");
if(reduce||!("IntersectionObserver" in window))els.forEach(x=>x.classList.add("in"));
else{const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
 els.forEach((x,i)=>{x.classList.add("rv");x.style.transitionDelay=(i%4)*70+"ms";io.observe(x)})}

// Dirección de tu servidor en Vercel, sin "/" al final. Ejemplo: "https://combinados-chapala.vercel.app"
// Si la web y el servidor están en el mismo sitio, déjalo vacío: ""
const API_BASE="";
// Pon true cuando Culqi apruebe tu cuenta y el servidor esté listo. Mientras sea false, solo se muestra Yape.
const PAGO_EFECTIVO=false;
const YAPE_NUMBER="953887354",YAPE_NAME=""; // cambia por tu número y nombre de Yape
function yape(j,txt){cart={};save();upd();cf.innerHTML=`<h3>Paga con Yape</h3><p>${j.numero?`Pedido <b>${j.numero}</b> · `:""}Total <b>S/ ${j.total}</b></p><img class="yqr" src="yape-qr.png" alt="Código QR de Yape de Combinados Chapala"><p id="ynum"></p><p>Escanea el QR, paga el monto exacto y toca el botón para enviarnos tu pedido y la captura del pago por WhatsApp.</p><a class="btn" id="ywa" target="_blank" rel="noopener">Enviar pedido y captura por WhatsApp</a><button type="button" class="btn red" onclick="location.reload()">Listo</button>`;
 $("#ynum").textContent=(YAPE_NAME||YAPE_NUMBER)?`Yape: ${[YAPE_NAME,YAPE_NUMBER].filter(Boolean).join(" · ")}`:"";
 $("#ywa").href=`https://wa.me/953887354?text=`+encodeURIComponent(`Hola, ya pagué por Yape${j.numero?" el pedido "+j.numero:""}.\n`+txt+`\nTe envío la captura.`)}
/* ===== Checkout: datos del cliente, PagoEfectivo y aviso al dueño ===== */
const co=document.createElement("div");co.id="co";co.hidden=true;
co.innerHTML=`<form class="cobox" id="coform"><h3>Tu pedido</h3><div id="cosum"></div>
<label>Nombre<input name="nombre" required maxlength="60" autocomplete="name"></label>
<label>Celular<input name="telefono" required inputmode="tel" pattern="[0-9 +]{9,15}" autocomplete="tel"></label>
<label>Correo (solo para PagoEfectivo)<input name="email" type="email" required autocomplete="email"></label>
<label>Entrega<select name="entrega"><option value="recojo">Recojo en el local</option><option value="delivery">Delivery</option></select></label>
<label id="dirl" hidden>Dirección<input name="direccion" maxlength="120"></label>
<label>Forma de pago<select name="metodo"><option value="pagoefectivo">PagoEfectivo (código CIP)</option><option value="yape">Yape (escaneas el QR)</option></select></label>
<p id="comsg" role="alert"></p>
<div class="coact"><button type="button" class="btn" id="cocancel">Volver</button><button class="btn red" id="cook">Confirmar pedido</button></div></form>`;
document.body.append(co);
const cf=$("#coform"),cmsg=$("#comsg");
if(!PAGO_EFECTIVO){cf.metodo.querySelector('option[value="pagoefectivo"]').remove();cf.metodo.value="yape";cf.metodo.closest("label").hidden=true;cf.email.closest("label").hidden=true;cf.email.required=false}
$("#send").onclick=()=>{const k=Object.keys(cart);$("#cosum").textContent=k.map(x=>`${cart[x].n} x ${x}`).join(" · ")+" — Total S/ "+k.reduce((a,x)=>a+cart[x].n*cart[x].p,0);cmsg.textContent="";co.hidden=false;cf.nombre.focus()};
$("#cocancel").onclick=()=>co.hidden=true;
cf.entrega.onchange=()=>{$("#dirl").hidden=cf.entrega.value!=="delivery";cf.direccion.required=!$("#dirl").hidden};
cf.metodo.onchange=()=>{cf.email.required=cf.metodo.value==="pagoefectivo"};
function listo(t){cart={};save();upd();cf.innerHTML='<h3>¡Gracias!</h3><p id="cot"></p><button type="button" class="btn" onclick="location.reload()">Cerrar</button>';$("#cot").textContent=t}
function pagar(j){const go=()=>{Culqi.publicKey=j.publicKey;
 Culqi.settings({title:"Combinados Chapala",currency:"PEN",amount:Math.round(j.total*100),order:j.orderId});
 Culqi.options({lang:"auto",modal:true,paymentMethods:{tarjeta:false,yape:false,bancaMovil:true,agente:true,billetera:true,cuotealo:false}});
 window.culqi=()=>{if(Culqi.order){const c=Culqi.order.paymentCode||Culqi.order.payment_code||"";Culqi.close();
  listo(`Pedido ${j.numero} registrado. ${c?"Tu código de pago (CIP) es "+c+". ":""}Págalo por banca móvil, agente o bodega antes de 24 horas y nos llegará el aviso.`)}
  else if(Culqi.error){cmsg.textContent=Culqi.error.user_message||"No se pudo generar el código"}};
 Culqi.open()};
 if(window.Culqi)return go();const s=document.createElement("script");s.src="https://js.culqi.com/checkout-js";s.onload=go;s.onerror=()=>cmsg.textContent="No se pudo cargar el pago. Intenta de nuevo.";document.head.append(s)}
cf.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(cf));
 d.items=Object.keys(cart).map(x=>({nombre:x,n:cart[x].n}));cmsg.textContent="Enviando…";$("#cook").disabled=true;
 const k=Object.keys(cart),t=k.reduce((a,y)=>a+cart[y].n*cart[y].p,0);
 const txt=`Soy ${d.nombre} (${d.telefono}). Mi pedido:\n`+k.map(y=>`- ${cart[y].n} x ${y}`).join("\n")+`\nTotal: S/ ${t}\n${d.entrega==="delivery"?"Delivery: "+d.direccion:"Recojo en local"}`;
 try{const r=await fetch(API_BASE+"/api/crear-pedido",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok){if(r.status===400){cmsg.textContent=j.error||"Revisa tus datos";return}throw 0}
  if(d.metodo==="pagoefectivo")pagar(j);else yape(j,txt)}
 catch(x){if(d.metodo==="yape")yape({numero:"",total:t},txt);
  else cmsg.textContent="No pudimos procesar el pago ahora. Intenta de nuevo o elige pagar con Yape."}
 finally{$("#cook").disabled=false}};
