
document.addEventListener('DOMContentLoaded',()=>{
  const button=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#primary-nav');
  if(button&&nav){
    button.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      button.setAttribute('aria-expanded',open?'true':'false');
      const label=button.querySelector('span');
      if(label)label.textContent=open?'Close':'Menu';
    });
  }

  const toast=document.createElement('div');
  toast.className='site-toast';
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  let toastTimer;
  function showToast(message){
    toast.textContent=message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
  }

  document.querySelectorAll('.demo-cart').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const name=btn.dataset.product||'Demo item';
      const count=Number(localStorage.getItem('brandforgeDemoCart')||0)+1;
      localStorage.setItem('brandforgeDemoCart',String(count));
      showToast(name+' added to demo cart · '+count+' item'+(count===1?'':'s'));
    });
  });

  document.querySelectorAll('[data-demo-form]').forEach(form=>{
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const status=form.querySelector('.form-status');
      if(status)status.textContent='Demo only — no information was sent.';
      showToast('Demo form complete — nothing was transmitted.');
      form.reset();
    });
  });

  const search=document.querySelector('.catalog-search');
  const filter=document.querySelector('.catalog-filter');
  const cards=[...document.querySelectorAll('.filterable-catalog .searchable-card')];
  const empty=document.querySelector('.catalog-empty');
  function applyCatalog(){
    if(!cards.length)return;
    const q=(search?.value||'').trim().toLowerCase();
    const category=filter?.value||'all';
    let visible=0;
    cards.forEach(card=>{
      const text=(card.dataset.search||'').toLowerCase();
      const cat=card.dataset.category||'';
      const show=(!q||text.includes(q))&&(category==='all'||cat===category);
      card.hidden=!show;
      if(show)visible++;
    });
    if(empty)empty.hidden=visible!==0;
  }
  search?.addEventListener('input',applyCatalog);
  filter?.addEventListener('change',applyCatalog);

  const supportInput=document.querySelector('.support-search-input');
  const supportCards=[...document.querySelectorAll('.support-topic.searchable-card')];
  supportInput?.addEventListener('input',()=>{
    const q=supportInput.value.trim().toLowerCase();
    supportCards.forEach(card=>card.hidden=Boolean(q)&&!(card.dataset.search||'').includes(q));
  });

  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
    nav?.classList.remove('open');
    button?.setAttribute('aria-expanded','false');
  }));

  const observer=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08}):null;

  document.querySelectorAll('main > section').forEach(section=>{
    section.classList.add('reveal-section');
    observer?.observe(section);
  });
});