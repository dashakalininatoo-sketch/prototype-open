const $=s=>document.querySelector(s);
const plansAssets=FIGMA_ASSETS['351-62791'], flatsAssets=FIGMA_ASSETS['351-62633'], modalAssets=FIGMA_ASSETS['351-62888'];
const state={mode:'flats',rooms:new Set([1]),openGroup:1,page:1,priceFrom:'',priceTo:'15000000',areaFrom:'34',areaTo:'',delivery:new Set(),building:'all',touched:false,all:false,favorites:new Set(),compare:new Set(),viewed:new Set()};
const fixture=LESNAYA.plans;
const modalFixture=LESNAYA.flats;
const roomGroups=[0,1,2,3,4,5].map(id=>{
 const offers=LESNAYA.flats.filter(flat=>id===5?flat.rooms>=5:flat.rooms===id);
 const area=offers.length?`${Math.min(...offers.map(flat=>flat.area)).toLocaleString('ru-RU')}–${Math.max(...offers.map(flat=>flat.area)).toLocaleString('ru-RU')} м²`:'Нет данных';
 const price=offers.length?`${(Math.min(...offers.map(flat=>flat.price))/1e6).toLocaleString('ru-RU',{maximumFractionDigits:1})}–${(Math.max(...offers.map(flat=>flat.price))/1e6).toLocaleString('ru-RU',{maximumFractionDigits:1})} млн ₽`:'Нет данных';
 return {id,title:id===0?'Студии':id===5?'5 и более комнат':id+'–комнатные',area,price,offers:offers.length};
});
const groupRows=new Map(roomGroups.map(group=>[group.id,LESNAYA.flats.filter(flat=>group.id===5?flat.rooms>=5:flat.rooms===group.id)]));
const PER_PAGE=6;
const plural=(n,one,few,many)=>{const mod10=n%10,mod100=n%100;return mod10===1&&mod100!==11?one:mod10>=2&&mod10<=4&&(mod100<10||mod100>=20)?few:many;};
const roomTitle=(row,plan=false)=>(row.rooms===0?'Студия':row.rooms+'-комнатная')+' · '+(plan?'от ':'')+row.area.toLocaleString('ru-RU',plan?{minimumFractionDigits:1,maximumFractionDigits:1}:undefined)+' м²';
const matches=row=>(!state.rooms.size||state.rooms.has(row.rooms))&&(!state.priceFrom||row.price>=Number(state.priceFrom))&&(!state.priceTo||row.price<=Number(state.priceTo))&&(!state.areaFrom||row.area>=Number(state.areaFrom))&&(!state.areaTo||row.area<=Number(state.areaTo))&&(!state.delivery.size||[...state.delivery].some(value=>matchesDelivery(row.date,value)))&&(state.building==='all'||row.building===state.building);
function matchesDelivery(rowDate,value){const year=Number(String(rowDate||'').match(/20\d{2}/)?.[0]);if(value==='sold')return Number.isFinite(year)&&year<new Date().getFullYear();if(value==='2029+')return Number.isFinite(year)&&year>=2029;return year===Number(value);}
const money=n=>n.toLocaleString('ru-RU')+' ₽';
const icon=(name,size=16)=>DS_ICONS[name+'-'+size];
const viewedBadgeHTML=()=>'<span class="badge-app badge-app--custom badge-app--primary viewed-badge"><span class="badge-app__text">Вы смотрели</span></span>';
const photo=(row,expand=false,showViewed=true)=>'<img src="'+row.image+'" alt="" aria-hidden="true">'+(showViewed&&state.viewed.has(String(row.id))?viewedBadgeHTML():'')+(expand?'<button class="expand" data-image aria-label="Увеличить изображение">'+icon('Fullscreen')+'</button>':'');
function badges(row){
 const discount=row.oldPrice&&row.oldPrice>row.price?Math.round((row.oldPrice-row.price)/row.oldPrice*100):0;
 return '<div class="badges">'+(discount?'<span class="label label-positive">Скидка '+discount+'%</span>':'')+(row.finish?'<span class="label label-neutral">'+row.finish+'</span>':'')+'</div>';
}
function actions(row){return '<div class="actions">'+['compare','favorites'].map(kind=>'<button class="icon-button '+(state[kind].has(row.id)?'active':'')+'" data-toggle="'+kind+'" data-id="'+row.id+'" aria-label="'+(kind==='compare'?'Добавить в сравнение':'Добавить в избранное')+'" aria-pressed="'+state[kind].has(row.id)+'">'+icon(kind==='compare'?(state.compare.has(row.id)?'CompareAdded':'CompareAdd'):(state.favorites.has(row.id)?'HeartOn':'HeartOff'),24)+'</button>').join('')+'</div>';}
function rowHTML(row,{modal=false}={}){
 const plan=state.mode==='plans'&&!modal;
 const viewed=state.viewed.has(String(row.id));
 return '<article class="row" tabindex="0" data-row="'+row.id+'"'+(plan?' data-plan':'')+(viewed?' data-viewed="true"':'')+'>'+
 (!modal?'<div class="photo" aria-label="Изображение квартиры">'+photo(row,!plan)+'</div>':'')+
 '<div class="title"><strong class="heading3">'+roomTitle(row,plan)+'</strong>'+badges(row)+'</div>'+
 (!plan?(!modal?'<div class="cell building-cell">'+(row.building||'Нет данных')+'</div>':'')+'<div class="cell date-cell">'+(row.date||'Нет данных')+'</div><div class="cell floor-cell">'+(row.floor?row.floor+(row.floorsTotal?' из '+row.floorsTotal:''):'Нет данных')+'</div>':'')+
 '<div class="price"><strong class="heading3">'+(plan?'от '+(row.price/1e6).toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1})+' млн ₽':money(row.price))+'</strong>'+
 (!plan&&row.oldPrice&&row.oldPrice>row.price?'<span class="old-price">'+money(row.oldPrice)+'<img src="'+(modal?modalAssets.imgLine1:flatsAssets.imgLine1)+'" alt=""></span>':'')+'</div>'+
 (plan?'<div class="plan-cta"><button class="button secondary" data-open-plan="'+row.id+'">'+row.offers+' '+plural(row.offers,'квартира','квартиры','квартир')+'</button></div>':actions(row))+'</article>';
}
function visibleRows(){
 const rows=fixture.filter(matches);
 return {rows,count:rows.length};
}
function filteredGroupRows(room){
 const source=groupRows.get(room)||[];
 const rows=source.filter(matches);
 return {rows,count:rows.length};
}
function paginationHTML(room=null,count=0){
 if(!count)return '';
 const pages=Math.max(1,Math.ceil(count/PER_PAGE));
 const label=state.mode==='plans'?count+' '+plural(count,'подходящая планировка','подходящие планировки','подходящих планировок'):count+' '+plural(count,'подходящая квартира','подходящие квартиры','подходящих квартир');
 const pageButton=n=>'<button class="page '+(state.page===n?'current':'')+'" data-page="'+n+'" '+(state.page===n?'aria-current="page" disabled':'')+'>'+n+'</button>';
 let pageItems='';
 if(pages<=6){pageItems=Array.from({length:pages},(_,i)=>pageButton(i+1)).join('');}
 else if(state.page<=6){pageItems=Array.from({length:6},(_,i)=>pageButton(i+1)).join('')+'<button class="page more" data-page="7" aria-label="Перейти к следующей скрытой странице">'+icon('More')+'</button>';}
 else{
  const start=Math.max(2,state.page-2),end=Math.min(pages,state.page+1);
  pageItems=pageButton(1)+'<button class="page more" data-page="'+Math.max(2,state.page-3)+'" aria-label="Перейти к предыдущей скрытой странице">'+icon('More')+'</button>'+
   Array.from({length:end-start+1},(_,i)=>pageButton(start+i)).join('');
 }
 return '<div class="pagination-bar"><nav aria-label="Страницы">'+
 '<button class="page" data-page="'+Math.max(1,state.page-1)+'" '+(state.page===1?'disabled':'')+'>Назад</button>'+pageItems+
 '<button class="page next" data-page="'+Math.min(pages,state.page+1)+'" '+(state.page>=pages?'disabled':'')+'>Дальше</button></nav>'+
 '<button class="button primary matching" data-matching="'+(room??'plans')+'">'+label+'</button></div>';
}
function groupHTML(group){
 const open=state.openGroup===group.id;
 const result=filteredGroupRows(group.id);
 const rows=result.rows.slice((state.page-1)*PER_PAGE,state.page*PER_PAGE);
 return '<section class="flat-group '+(open?'is-open':'')+'" data-group="'+group.id+'" aria-label="'+group.title+'">'+
 (state.rooms.size?'':'<div class="group"><strong class="heading4">'+group.title+'</strong><span class="group-area">'+group.area+'</span><span class="group-price">'+group.price+'</span><button data-collapse="'+group.id+'" aria-controls="group-content-'+group.id+'" aria-expanded="'+open+'">'+group.offers+' '+plural(group.offers,'предложение','предложения','предложений')+icon('ChevronRightSmall')+'</button></div>')+
 '<div id="group-content-'+group.id+'" class="accordion-panel '+(open?'is-open':'')+'" '+(open?'':'inert')+'><div class="group-content">'+rows.map(r=>rowHTML(r)).join('')+paginationHTML(group.id,result.count)+'</div></div></section>';
}
function toggleGroup(room){
 state.openGroup=state.openGroup===room?null:room;
 document.querySelectorAll('.flat-group').forEach(section=>{
  const open=Number(section.dataset.group)===state.openGroup;
  section.classList.toggle('is-open',open);
  const panel=section.querySelector('.accordion-panel');
  panel.classList.toggle('is-open',open);
  panel.inert=!open;
  section.querySelector('[data-collapse]').setAttribute('aria-expanded',String(open));
 });
}
function render(){
 $('.catalog').dataset.mode=state.mode;
 document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===state.mode);b.setAttribute('aria-selected',b.dataset.mode===state.mode);b.tabIndex=b.dataset.mode===state.mode?0:-1;});
 $('#results').setAttribute('aria-labelledby',state.mode==='plans'?'plans-tab':'flats-tab');
 $('#rooms').innerHTML=['Студия','1-комн.','2','3','4','5+'].map((t,i)=>'<button class="chip chip-m '+(state.rooms.has(i)?'active':'')+'" data-room="'+i+'" aria-pressed="'+state.rooms.has(i)+'">'+t+'</button>').join('');
 const result=visibleRows();const rows=result.rows.slice((state.page-1)*PER_PAGE,state.page*PER_PAGE);
 const plansContent=state.mode==='plans'?(result.count?'<div class="group-content">'+rows.map(r=>rowHTML(r)).join('')+paginationHTML(null,result.count)+'</div>':emptyStateHTML()):'';
 const visibleGroups=(state.rooms.size?roomGroups.filter(group=>state.rooms.has(group.id)):roomGroups).filter(group=>group.offers);
 const flatCount=visibleGroups.reduce((sum,group)=>sum+filteredGroupRows(group.id).count,0);
 $('#plans-tab span').textContent=LESNAYA.plans.length;$('#flats-tab span').textContent=LESNAYA.flats.length;
 document.querySelector('[data-static-count="plans"]').textContent=LESNAYA.plans.length;document.querySelector('[data-static-count="flats"]').textContent=LESNAYA.flats.length;
 $('#results').innerHTML=state.mode==='flats'?(flatCount?visibleGroups.map(groupHTML).join(''):emptyStateHTML()):plansContent;

 for(const kind of ['price','area']){
  const from=state[kind+'From'],to=state[kind+'To'];const unit=kind==='price'?' млн ₽':' м²';const val=n=>kind==='price'?new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(Number(n)/1e6):n;
  $('#'+kind+'-filter span').textContent=from&&to?val(from)+'–'+val(to)+unit:from?'От '+val(from)+unit:to?'До '+val(to)+unit:kind==='price'?'Цена':'Площадь';
  $('#'+kind+'-filter').classList.toggle('active',Boolean(from||to));
 }
 $('#delivery-filter').classList.toggle('active',state.delivery.size>0);
 $('#delivery-filter span').textContent=state.delivery.size===1?'Сдача в '+[...state.delivery][0].replace('+',' и позже'):state.delivery.size?'Срок сдачи: '+state.delivery.size:'Срок сдачи';
 $('#building-filter').classList.toggle('active',state.building!=='all');
 $('#building-filter span').textContent=state.building==='all'?'Корпус':state.building;
 renderFilterTags();
}
function emptyStateHTML(){return '<div class="empty-state" role="status"><div class="empty-state-content"><div class="empty-illustration" aria-hidden="true"><img src="assets/empty-state.png" alt=""></div><div class="empty-state-copy"><h2 class="heading2">По таким фильтрам нет квартир</h2><p>Попробуйте поменять или сбросить фильтры</p></div></div><div class="empty-state-controls"><button class="button secondary" data-clear-filters>Сбросить фильтры</button></div></div>';}
function renderFilterTags(){
 const tags=[];
 if(state.priceFrom||state.priceTo){const val=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(Number(n)/1e6);tags.push({key:'price',text:state.priceFrom&&state.priceTo?val(state.priceFrom)+'–'+val(state.priceTo)+' млн ₽':state.priceFrom?'От '+val(state.priceFrom)+' млн ₽':'До '+val(state.priceTo)+' млн ₽'});}
 if(state.areaFrom||state.areaTo)tags.push({key:'area',text:state.areaFrom&&state.areaTo?state.areaFrom+'–'+state.areaTo+' м²':state.areaFrom?'От '+state.areaFrom+' м²':'До '+state.areaTo+' м²'});
 for(const year of state.delivery)tags.push({key:'delivery',value:year,text:year==='sold'?'Уже сдан':year==='2029+'?'Сдача в 2029 году и позже':'Сдача в '+year+' году'});
 if(state.building!=='all')tags.push({key:'building',text:state.building});
 const container=$('#filter-tags');container.hidden=!tags.length;container.innerHTML=tags.map(tag=>'<button class="filter-tag" data-remove-filter="'+tag.key+'"'+(tag.value?' data-filter-value="'+tag.value+'"':'')+'>'+tag.text+icon('Close',16)+'</button>').join('')+(tags.length?'<button class="clear-filters" data-clear-filters>Очистить</button>':'');
}
function range(kind){
 const unit=kind==='price'?'₽':'м²';
 $('#'+kind+'-popover').innerHTML=['From','To'].map((suffix,i)=>'<label class="field"><input inputmode="decimal" data-range="'+kind+suffix+'" aria-label="'+(i?'Максимальная':'Минимальная')+' '+(kind==='price'?'цена':'площадь')+'" placeholder="'+(i?'до':'от')+'" value="'+state[kind+suffix]+'"><span>'+unit+'</span><button class="clear" data-clear="'+kind+suffix+'" aria-label="Очистить">'+icon('Close')+'</button></label>').join('');
}
function closePopovers(){document.querySelectorAll('.popover').forEach(p=>p.hidden=true);document.querySelectorAll('[id$="-filter"]').forEach(b=>{b.setAttribute('aria-expanded','false');b.querySelector('svg').outerHTML=icon('ChevronDownSmall');});}
function deliveries(){const options=[['sold','Уже сдан'],['2026','2026'],['2027','2027'],['2028','2028'],['2029+','2029 и позже']];$('#delivery-popover').innerHTML=options.map(([value,label])=>'<button class="delivery-option" role="checkbox" aria-checked="'+state.delivery.has(value)+'" data-delivery="'+value+'"><span>'+label+'</span><span class="checkmark">'+(state.delivery.has(value)?'✓':'')+'</span></button>').join('');}
function buildings(){$('#building-popover').innerHTML=[['all','Все корпуса',''],...LESNAYA.complex.buildings.map(value=>[value,value,LESNAYA.complex.delivery])].map(([value,title,sub])=>'<button class="building" role="radio" aria-checked="'+(state.building===value)+'" data-building="'+value+'"><span>'+title+(sub?'<small>'+sub+'</small>':'')+'</span><span class="radio"></span></button>').join('');}
let returnFocus=null,noticeTimer;
let suppressedPlanCard=null,lastPointer={x:-1,y:-1};
document.addEventListener('pointermove',e=>{lastPointer={x:e.clientX,y:e.clientY};},{passive:true});
function releasePlanHover(){if(!suppressedPlanCard)return;suppressedPlanCard.classList.remove('suppress-hover');delete suppressedPlanCard.dataset.hoverRearm;suppressedPlanCard=null;}
document.addEventListener('pointerover',e=>{const card=e.target.closest('.suppress-hover');if(card&&card===suppressedPlanCard&&!$('#plan-modal').open&&card.dataset.hoverRearm==='enter'&&!card.contains(e.relatedTarget))releasePlanHover();});
document.addEventListener('pointerout',e=>{const card=e.target.closest('.suppress-hover');if(card&&card===suppressedPlanCard&&!$('#plan-modal').open&&card.dataset.hoverRearm==='exit'&&!card.contains(e.relatedTarget))releasePlanHover();});
function notify(label){$('#notice').textContent=label+' — переход за границей прототипа блока';$('#notice').hidden=false;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('#notice').hidden=true,4000);}
function closeImagePreview(){
 const preview=$('#image-modal');
 if(preview.open)preview.close();
}
function openImagePreview(button){
 const preview=$('#image-modal');
 if(preview.open||$('#plan-modal').open)return;
 const article=button.closest('[data-row]');
 const row=[...fixture,...modalFixture].find(item=>item.id===article?.dataset.row);
 const source=button.closest('.photo');
 if(!row||!source)return;
 returnFocus=button;
 $('#image-modal-title').textContent=roomTitle(row)+(row.floor?' · '+row.floor+' этаж':'');
 $('#image-modal-price').textContent=money(row.price);
 $('#large-photo').replaceChildren(...[...source.querySelectorAll('img')].map(img=>img.cloneNode(true)));
 preview.showModal();
}
function openPlan(id,trigger){
 const row=fixture.find(r=>String(r.id)===String(id));
 if(!row)return;
 markViewed(id);
 const card=trigger?.closest('.row[data-plan]');
 if(card){card.dataset.viewed='true';const rowPhoto=card.querySelector('.photo');if(rowPhoto&&!rowPhoto.querySelector('.viewed-badge'))rowPhoto.insertAdjacentHTML('beforeend',viewedBadgeHTML());releasePlanHover();suppressedPlanCard=card;card.classList.add('suppress-hover');card.dataset.hoverRearm='exit';}
 returnFocus=document.activeElement;
 const offers=row.offerRows;
 $('#modal-photo').innerHTML=photo(row,false,false)+'<button id="expand-modal" class="expand visible" aria-label="Увеличить изображение">'+icon('Fullscreen')+'</button>';
 $('#plan-modal').dataset.plan=id;$('#modal-offers').innerHTML=offers.map(r=>rowHTML(r,{modal:true})).join('');
 $('#modal-title').textContent=row.rooms===0?'Студии':row.rooms+'-комнатные квартиры';
 $('#plan-modal .summary-info .heading2').textContent=money(Math.min(...offers.map(r=>r.price)))+' – '+money(Math.max(...offers.map(r=>r.price)));
 $('#plan-modal .secondary-text').textContent=money(Math.min(...offers.map(r=>r.pricePerM2)))+' – '+money(Math.max(...offers.map(r=>r.pricePerM2)))+'/м²';
 $('#plan-modal .areas .heading3').textContent=row.area.toLocaleString('ru-RU')+' м²';
 $('#plan-modal .areas>div:last-child .heading3').textContent=row.livingArea?row.livingArea.toLocaleString('ru-RU')+' м²':'Нет данных';
 $('#plan-modal').classList.remove('expanded');$('#plan-modal').showModal();$('#modal-offers').scrollTop=0;
}
function markViewed(id){
 const offerId=String(id);
 state.viewed.add(offerId);
}
function openOffer(row){
 if(!row)return;
 markViewed(row.id);
 const modal=$('#plan-modal');
 if(modal.open){modal.close();render();return;}
 render();
}
$('#dom-logo').src=flatsAssets.imgLogoDomRf1;$('#escrow-logo').src=flatsAssets.img40X40Escrou;$('#developer-avatar').src=LESNAYA.complex.developerLogo.local;document.querySelector('.developer strong').textContent=LESNAYA.complex.developer;document.querySelector('.developer img').alt=LESNAYA.complex.developer;
const divider=document.createElement('img');divider.src=flatsAssets.imgDivider;divider.alt='';divider.className='tabs-divider';$('.tabs').append(divider);
document.addEventListener('click',e=>{
 const button=e.target.closest('button,a');
 if(button?.dataset.mode){state.mode=button.dataset.mode;closePopovers();render();return;}
 if(button?.dataset.room!==undefined){const n=Number(button.dataset.room),wasSelected=state.rooms.has(n);state.rooms.clear();if(!wasSelected){state.rooms.add(n);state.openGroup=n;}state.page=1;render();return;}
 if(button?.id?.endsWith('-filter')){let kind=button.id.replace('-filter',''),p=$('#'+kind+'-popover'),open=p.hidden;closePopovers();if(open){kind==='building'?buildings():kind==='delivery'?deliveries():range(kind);p.hidden=false;button.setAttribute('aria-expanded','true');button.querySelector('svg').outerHTML=icon('ChevronUpSmall');}return;}
 if(button?.dataset.clear){state[button.dataset.clear]='';state.touched=true;range(button.dataset.clear.startsWith('price')?'price':'area');render();return;}
 if(button?.dataset.building){state.building=button.dataset.building;state.touched=true;state.page=1;closePopovers();render();return;}
 if(button?.dataset.delivery!==undefined){const value=button.dataset.delivery;state.delivery.has(value)?state.delivery.delete(value):state.delivery.add(value);state.touched=true;state.page=1;deliveries();render();const popover=$('#delivery-popover');popover.hidden=false;$('#delivery-filter').setAttribute('aria-expanded','true');$('#delivery-filter svg').replaceWith(document.createRange().createContextualFragment(icon('ChevronUpSmall')));return;}
 if(button?.dataset.removeFilter){const key=button.dataset.removeFilter;if(key==='price')state.priceFrom=state.priceTo='';if(key==='area')state.areaFrom=state.areaTo='';if(key==='delivery')state.delivery.delete(button.dataset.filterValue);if(key==='building')state.building='all';state.page=1;state.touched=true;render();return;}
 if(button?.hasAttribute('data-clear-filters')){state.rooms.clear();state.priceFrom=state.priceTo=state.areaFrom=state.areaTo='';state.delivery.clear();state.building='all';state.page=1;state.openGroup=null;state.touched=false;render();return;}
 if(button?.dataset.toggle){const set=state[button.dataset.toggle],id=button.dataset.id;set.has(id)?set.delete(id):set.add(id);const inModal=button.closest('#plan-modal');render();if(inModal){const plan=fixture.find(r=>String(r.id)===String($('#plan-modal').dataset.plan));if(plan){$('#modal-offers').innerHTML=plan.offerRows.map(r=>rowHTML(r,{modal:true})).join('');}}return;}
 if(button?.dataset.page){state.page=Number(button.dataset.page);render();return;}
 if(button?.dataset.collapse!==undefined){state.page=1;toggleGroup(Number(button.dataset.collapse));return;}
 if(button?.hasAttribute('data-image')){openImagePreview(button);return;}
 if(button?.id==='expand-modal'){$('#plan-modal').classList.toggle('expanded');button.setAttribute('aria-label',$('#plan-modal').classList.contains('expanded')?'Уменьшить планировку':'Увеличить планировку');button.innerHTML=$('#plan-modal').classList.contains('expanded')?icon('Close'):icon('Fullscreen');return;}
 if(button?.classList.contains('modal-close')){button.closest('dialog').close();return;}
 if(button?.dataset.openPlan){openPlan(button.dataset.openPlan,button);return;}
 if(button?.hasAttribute('data-agent-modal')){$('#agents-modal').showModal();return;}
 if(button?.hasAttribute('data-close-dialog')){button.closest('dialog')?.close();return;}
 if(button?.dataset.matching!==undefined){state.touched=true;state.page=1;render();return;}
 if(button?.dataset.boundary){e.preventDefault();notify(button.dataset.boundary);return;}
 const row=e.target.closest('.row');if(row){row.hasAttribute('data-plan')?openPlan(row.dataset.row,row):openOffer(modalFixture.find(item=>String(item.id)===String(row.dataset.row)));return;}
 if(!e.target.closest('.filter-wrap'))closePopovers();
});
document.addEventListener('input',e=>{if(!e.target.dataset.range)return;state[e.target.dataset.range]=e.target.value.replace(/[^0-9.,]/g,'').replace(',','.');state.touched=true;state.page=1;render();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeImagePreview();closePopovers();}
 if(e.key==='Enter'&&e.target.matches('[data-range]')){closePopovers();$('#'+(e.target.dataset.range.startsWith('price')?'price':'area')+'-filter').focus();}
 if(e.target.matches('[data-mode]')&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();state.mode=state.mode==='plans'?'flats':'plans';render();$('[data-mode="'+state.mode+'"]').focus();}
 if(e.target.matches('.row')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.hasAttribute('data-plan')?openPlan(e.target.dataset.row,e.target):openOffer(modalFixture.find(item=>String(item.id)===String(e.target.dataset.row)));}
});
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{if(returnFocus?.isConnected)returnFocus.focus();if(d.id==='plan-modal'){const planId=String(d.dataset.plan||'');const card=[...document.querySelectorAll('.row[data-plan]')].find(item=>item.dataset.row===planId);const photo=card?.querySelector('.photo');if(card&&state.viewed.has(planId)){card.dataset.viewed='true';if(photo&&!photo.querySelector('.viewed-badge'))photo.insertAdjacentHTML('beforeend',viewedBadgeHTML());}if(suppressedPlanCard?.isConnected){const r=suppressedPlanCard.getBoundingClientRect();suppressedPlanCard.dataset.hoverRearm=lastPointer.x>=r.left&&lastPointer.x<=r.right&&lastPointer.y>=r.top&&lastPointer.y<=r.bottom?'exit':'enter';}}});});
render();

const requestedPlan = new URLSearchParams(location.search).get('plan');
if (requestedPlan) {
 state.mode = 'plans';
 state.rooms.clear();
 state.priceFrom = state.priceTo = state.areaFrom = state.areaTo = '';
 state.delivery.clear();
 state.building = 'all';
 state.page = 1;
 render();
 openPlan(requestedPlan);
}
