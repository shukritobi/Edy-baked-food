const PRODUCTS = [
  {
    id:'rastali-original',
    name:'Kek Pisang Rastali',
    subtitle:'Moist, wangi pisang dan rasa klasik orang lama.',
    price:38,
    badge:'BEST SELLER',
    image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=82'
  },
  {
    id:'rastali-walnut',
    name:'Pisang Coklat Walnut',
    subtitle:'Pisang Rastali, coklat dan roasted walnut untuk rasa lebih kaya.',
    price:45,
    badge:'SIGNATURE',
    image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=82'
  },
  {
    id:'suji-almond',
    name:'Kek Suji Almond',
    subtitle:'Kek suji lembut dengan rasa badam yang klasik.',
    price:38,
    badge:'ORANG LAMA',
    image:'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=82'
  },
  {
    id:'kek-buah',
    name:'Kek Buah',
    subtitle:'Padat dengan buah, sesuai untuk hadiah dan minum petang.',
    price:42,
    badge:'CLASSIC',
    image:'https://apicms.mstar.com.my/uploads/images/2021/07/15/1215779.jpg'
  },
  {
    id:'lobak-merah',
    name:'Kek Lobak Merah',
    subtitle:'Spiced carrot loaf dengan tekstur moist dan rasa seimbang.',
    price:42,
    badge:'FAVOURITE',
    image:'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=82'
  },
  {
    id:'kombo',
    name:'Kombo Dua Loaf',
    subtitle:'Dua signature loaf dalam satu order. Sesuai untuk hadiah.',
    price:79,
    badge:'VALUE SET',
    image:'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=82'
  }
];

let cart = JSON.parse(localStorage.getItem('edy-cart') || '[]');

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const money = n => `RM${Number(n).toFixed(2)}`;

function saveCart(){
  localStorage.setItem('edy-cart', JSON.stringify(cart));
  renderCart();
}

function addToCart(id){
  const item = cart.find(x => x.id === id);
  if(item) item.qty += 1;
  else cart.push({id, qty:1});
  saveCart();
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  cart = cart.filter(x => x.qty > 0);
  saveCart();
}

function removeItem(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function cartTotal(){
  return cart.reduce((sum,item)=>{
    const p = PRODUCTS.find(x=>x.id===item.id);
    return sum + (p ? p.price * item.qty : 0);
  },0);
}

function renderProducts(){
  const grid = $('#productGrid');
  grid.innerHTML = PRODUCTS.map(p=>`
    <article class="product-card reveal">
      <div class="product-visual">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="product-badge">${p.badge}</span>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.subtitle}</p>
        <div class="product-row">
          <strong>${money(p.price)}</strong>
          <button class="add-button" data-add="${p.id}" aria-label="Tambah ${p.name} ke cart">+</button>
        </div>
      </div>
    </article>
  `).join('');
  $$('[data-add]').forEach(btn=>btn.addEventListener('click',()=>addToCart(btn.dataset.add)));
}

function renderCart(){
  const items = $('#cartItems');
  const count = cart.reduce((s,x)=>s+x.qty,0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = money(cartTotal());
  $('#cartEmpty').style.display = cart.length ? 'none':'block';
  $('#cartFooter').style.display = cart.length ? 'block':'none';
  items.innerHTML = cart.map(item=>{
    const p = PRODUCTS.find(x=>x.id===item.id);
    if(!p) return '';
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}" />
      <div>
        <h4>${p.name}</h4><small>${money(p.price)} each</small>
        <div class="qty"><button data-dec="${p.id}">−</button><b>${item.qty}</b><button data-inc="${p.id}">+</button></div>
      </div>
      <div><b>${money(p.price*item.qty)}</b><button class="remove" data-remove="${p.id}">Remove</button></div>
    </div>`;
  }).join('');
  $$('[data-dec]').forEach(b=>b.onclick=()=>changeQty(b.dataset.dec,-1));
  $$('[data-inc]').forEach(b=>b.onclick=()=>changeQty(b.dataset.inc,1));
  $$('[data-remove]').forEach(b=>b.onclick=()=>removeItem(b.dataset.remove));
}

function openCart(){
  $('#cartDrawer').classList.add('open');
  $('#cartDrawer').setAttribute('aria-hidden','false');
  $('#overlay').classList.add('open');
}
function closeCart(){
  $('#cartDrawer').classList.remove('open');
  $('#cartDrawer').setAttribute('aria-hidden','true');
  $('#overlay').classList.remove('open');
}

function renderCheckout(){
  $('#checkoutItems').innerHTML = cart.map(item=>{
    const p = PRODUCTS.find(x=>x.id===item.id);
    return p ? `<div class="summary-product"><span>${item.qty} × ${p.name}</span><b>${money(p.price*item.qty)}</b></div>` : '';
  }).join('');
  $('#checkoutSubtotal').textContent = money(cartTotal());
  $('#checkoutTotal').textContent = money(cartTotal());
}

function openCheckout(){
  if(!cart.length) return;
  closeCart();
  renderCheckout();
  const modal = $('#checkoutModal');
  if(typeof modal.showModal === 'function') modal.showModal();
}

function initFulfilment(){
  $$('input[name="fulfilment"]').forEach(radio=>{
    radio.addEventListener('change',()=>{
      const isPickup = $('input[name="fulfilment"]:checked').value === 'pickup';
      $('.address-field').style.display = isPickup ? 'none':'flex';
      $('#checkoutShipping').textContent = isPickup ? 'Pickup: RM0.00':'Calculated next';
    });
  });
}

function setMinDates(){
  const d = new Date();
  d.setDate(d.getDate()+2);
  const iso = d.toISOString().slice(0,10);
  $$('input[type="date"]').forEach(i=>i.min=iso);
}

function initEvents(){
  $('#openCart').onclick = openCart;
  $('#closeCart').onclick = closeCart;
  $('#overlay').onclick = closeCart;
  $('#checkoutButton').onclick = openCheckout;
  $('#closeCheckout').onclick = ()=>$('#checkoutModal').close();
  $('#bulkButton').onclick = ()=>$('#bulkModal').showModal();
  $('#closeBulk').onclick = ()=>$('#bulkModal').close();
  $('#successClose').onclick = ()=>$('#successModal').close();
  $$('[data-action="shop"]').forEach(btn=>btn.onclick=()=>$('#shop').scrollIntoView({behavior:'smooth'}));

  $('#checkoutForm').addEventListener('submit',e=>{
    e.preventDefault();
    $('#checkoutModal').close();
    $('#successModal').showModal();
  });
  $('#bulkForm').addEventListener('submit',e=>{
    e.preventDefault();
    $('#bulkModal').close();
    alert('Preview: permintaan quotation akan dihantar terus ke dashboard merchant / WhatsApp apabila sistem live.');
  });
}

renderProducts();
renderCart();
initFulfilment();
setMinDates();
initEvents();
