(() => {
  'use strict';
  const groups=window.PLAN_DEMO_GROUPS;
  const carousel=document.querySelector('#carousel');
  const scrollArea=document.querySelector('#scrollArea');
  const nav=document.querySelector('#nav');
  const dots=document.querySelector('#dots');
  const summary=document.querySelector('#summary');
  const offers=document.querySelector('#offers');
  const favorites=new Set();
  const assets={more:'assets/more.svg',heartOff:'assets/heart-off.svg',heartOn:'assets/heart-on.svg'};
  const formatNumber=n=>Number(n).toLocaleString('ru-RU');
  const room=n=>n===0?'Студия':`${n}-комн.`;
  const count=n=>`${n} ${n%100>=11&&n%100<=14?'квартир':n%10===1?'квартира':n%10>=2&&n%10<=4?'квартиры':'квартир'}`;
  const area=n=>Number(n).toLocaleString('ru-RU',{maximumFractionDigits:1});
  let activeIndex=0,scrollFrame=0,settleTimer=0;

  carousel.innerHTML=groups.map((group,index)=>`<div class="plan-card${index===0?' is-active':''}" data-index="${index}"><img src="${group.image}" alt="Планировка ${room(group.rooms)}, ${area(group.flats[0].areaM2)} м²"><span class="tour-badge" aria-hidden="true"><img src="assets/tour.svg" alt=""></span></div>`).join('');
  const cards=[...carousel.querySelectorAll('.plan-card')];

  function renderDots(){
    const first=Math.max(0,Math.min(activeIndex-3,groups.length-8));
    dots.innerHTML=groups.slice(first,first+8).map((_,offset)=>`<button type="button" data-index="${first+offset}" class="${first+offset===activeIndex?'is-active':''}" aria-label="Планировка ${first+offset+1} из ${groups.length}" aria-current="${first+offset===activeIndex}"></button>`).join('');
  }
  function offerMarkup(flat){
    const id=String(flat.id),isFavorite=favorites.has(id);
    return `<article class="offer" data-offer-id="${id}"><div class="offer-copy"><p class="offer-date">Сдача: ${flat.delivery}</p><div class="offer-price"><b>${formatNumber(flat.priceRub)} ₽</b>${flat.oldPriceRub?`<s>${formatNumber(flat.oldPriceRub)} ₽</s>`:''}</div><p class="offer-facts">${room(flat.rooms)}${flat.rooms?' кв.':''} · ${area(flat.areaM2)} м² · ${flat.floor}/${flat.floorsTotal} этаж</p></div><div class="offer-actions"><span class="offer-action offer-action-placeholder" aria-hidden="true"><img src="${assets.more}" alt=""></span><button type="button" class="offer-action" data-action="favorite" data-id="${id}" aria-pressed="${isFavorite}" aria-label="${isFavorite?'Убрать из избранного':'Добавить в избранное'}"><img src="${isFavorite?assets.heartOn:assets.heartOff}" alt=""></button></div></article>`;
  }
  function renderDetails(direction=0){
    const group=groups[activeIndex],areas=group.flats.map(flat=>Number(flat.areaM2)),min=Math.min(...areas),max=Math.max(...areas);
    summary.innerHTML=`<span>${room(group.rooms)} ${area(min)}${min===max?'':` – ${area(max)}`} м²</span><span>${count(group.flats.length)}</span>`;
    offers.innerHTML=group.flats.map(offerMarkup).join('');
    offers.classList.remove('is-next','is-prev');
    if(direction){void offers.offsetWidth;offers.classList.add(direction>0?'is-next':'is-prev');}
    renderDots();
  }
  function updateScale(){
    scrollFrame=0;
    const position=carousel.scrollLeft/343;
    cards.forEach((card,index)=>{
      const offset=index-position,closeness=1-Math.min(1,Math.abs(offset));
      const progress=closeness;
      const eased=progress*progress*(3-2*progress);
      card.style.transformOrigin=offset<-.001?'right center':offset>.001?'left center':'center';
      card.style.transform=`scale(${.94+.06*eased})`;
    });
  }
  function settle(){
    const index=Math.max(0,Math.min(groups.length-1,Math.round(carousel.scrollLeft/343)));
    if(index===activeIndex)return;
    const direction=index-activeIndex;
    activeIndex=index;
    cards.forEach((card,i)=>card.classList.toggle('is-active',i===index));
    renderDetails(direction);
  }
  scrollArea.addEventListener('scroll',()=>nav.classList.toggle('is-scrolled',scrollArea.scrollTop>1),{passive:true});
  carousel.addEventListener('scroll',()=>{
    if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScale);
    clearTimeout(settleTimer);settleTimer=setTimeout(settle,100);
  },{passive:true});
  carousel.addEventListener('scrollend',settle,{passive:true});
  dots.addEventListener('click',event=>{
    const button=event.target.closest('button[data-index]');if(!button)return;
    carousel.scrollTo({left:Number(button.dataset.index)*343,behavior:'smooth'});
  });
  offers.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action="favorite"]');if(!button)return;
    const id=button.dataset.id;
    const added=!favorites.has(id);added?favorites.add(id):favorites.delete(id);
    button.setAttribute('aria-pressed',String(added));
    button.setAttribute('aria-label',added?'Убрать из избранного':'Добавить в избранное');
    button.querySelector('img').src=added?assets.heartOn:assets.heartOff;
  });
  renderDetails();updateScale();
})();
