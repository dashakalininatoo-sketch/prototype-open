{
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=rng(27112026);const pick=a=>a[Math.floor(R()*a.length)];const rint=(a,b)=>a+Math.floor(R()*(b-a+1));
function wpick(o){const e=Object.entries(o);let s=e.reduce((a,[,w])=>a+w,0),x=R()*s;for(const[k,w]of e){if((x-=w)<=0)return k}return e[0][0]}
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/[ ,]/g,' ');
const kf=n=>n>=1000?(n/1000).toFixed(1)+' тыс':String(n);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function plural(n,a,b,c){n=Math.abs(n)%100;const m=n%10;if(n>10&&n<20)return c;if(m>1&&m<5)return b;if(m===1)return a;return c}
/* ---------- иконки ---------- */
const I={
eye:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3C4.4 3 1.7 5.6.6 7.6a.8.8 0 0 0 0 .8C1.7 10.4 4.4 13 8 13s6.3-2.6 7.4-4.6a.8.8 0 0 0 0-.8C14.3 5.6 11.6 3 8 3Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-1.6a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Z"/></svg>',
heart:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 14.2 6.9 13.2C3.2 9.9 1 7.9 1 5.4 1 3.4 2.6 1.8 4.6 1.8c1.1 0 2.2.5 2.9 1.4h1C9.2 2.3 10.3 1.8 11.4 1.8c2 0 3.6 1.6 3.6 3.6 0 2.5-2.2 4.5-5.9 7.8L8 14.2Z"/></svg>',
share:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10V2M5 4.8 8 1.8l3 3M4.5 7H3.5v7h9V7h-1"/></svg>',
chat:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5C4.1 1.5 1 4.1 1 7.3c0 1.6.8 3.1 2.1 4.1L2.6 14.5l3.2-1.6c.7.2 1.4.3 2.2.3 3.9 0 7-2.6 7-5.9S11.9 1.5 8 1.5Z"/><circle cx="5" cy="7.3" r="1" fill="#f3f5f8"/><circle cx="8" cy="7.3" r="1" fill="#f3f5f8"/><circle cx="11" cy="7.3" r="1" fill="#f3f5f8"/></svg>',
phone:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M14.6 11.3 12.4 9.8a1.2 1.2 0 0 0-1.5.1l-.9.9a9.3 9.3 0 0 1-4.8-4.8l.9-.9a1.2 1.2 0 0 0 .1-1.5L4.7 1.4A1.2 1.2 0 0 0 2.9 1.2L1.6 2.5C.9 3.2.7 4.3 1.1 5.3a15.6 15.6 0 0 0 9.6 9.6c1 .4 2.1.2 2.8-.5l1.3-1.3a1.2 1.2 0 0 0-.2-1.8Z"/></svg>',
up:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 10V2M2.5 5.5 6 2l3.5 3.5"/></svg>',
down:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2v8M2.5 6.5 6 10l3.5-3.5"/></svg>',
pause:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 2.8v6.4M8 2.8v6.4"/></svg>',
clock:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6" cy="6" r="4.8"/><path d="M6 3.6V6l1.6 1"/></svg>',
info:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><circle cx="6" cy="6" r="5.2"/><path d="M6 5.4v3M6 3.6v.1"/></svg>',
check12:'<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2.5 6.2 2.3 2.3 4.7-5"/></svg>',
lock12:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5 5V3.8a2.5 2.5 0 0 1 5 0V5h.4c.6 0 1.1.5 1.1 1.1v3.8c0 .6-.5 1.1-1.1 1.1H3.1C2.5 11 2 10.5 2 9.9V6.1C2 5.5 2.5 5 3.1 5h.4Zm1.3 0h2.4V3.8a1.2 1.2 0 0 0-2.4 0V5Z"/></svg>',
arrowBold:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1 11 6.5H7.8V11H4.2V6.5H1L6 1Z"/></svg>',
img12:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M2 1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Zm2 2.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM2.5 9.5h7L7.2 6.4 5.5 8.5l-1-1-2 2Z"/></svg>',
edit12:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M8.3 1.3a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4L4.4 10H2V7.6l6.3-6.3Z"/></svg>',
cal12:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3.5.5h1v1h3v-1h1v1h1A1.5 1.5 0 0 1 11 3v6.5A1.5 1.5 0 0 1 9.5 11h-7A1.5 1.5 0 0 1 1 9.5V3a1.5 1.5 0 0 1 1.5-1.5h1v-1ZM2.5 4.5v5h7v-5h-7Z"/></svg>',
sort:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#014adf" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2v12M2 5l3-3 3 3M11 14V2M14 11l-3 3-3-3"/></svg>',
chev:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 4 4 4-4"/></svg>',
search:'<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="8" cy="8" r="5.5"/><path d="m12 12 4 4" stroke-linecap="round"/></svg>',
more:'<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.7"/><circle cx="8" cy="8" r="1.7"/><circle cx="13" cy="8" r="1.7"/></svg>',
pen:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M10.8 2.5 13.5 5.2 5.5 13.2H2.8V10.5l8-8Z"/></svg>',
calendar:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke-linecap="round"/></svg>',
stats:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 13V8M8 13V3M13 13V6"/></svg>',
rocket:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 14V2M3.5 6.5 8 2l4.5 4.5"/></svg>',
star:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m8 1.8 1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6L8 1.8Z"/></svg>',
send:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M14 2 7 9M14 2l-4.5 12L7 9 2 6.5 14 2Z"/></svg>',
eyeoff:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M2 2l12 12M6.5 4.2A7 7 0 0 1 8 4c3.2 0 5.5 2.3 6.5 4-.4.7-1 1.5-1.8 2.2M10.5 11.5A6.6 6.6 0 0 1 8 12C4.8 12 2.5 9.7 1.5 8c.5-.9 1.3-1.9 2.4-2.7"/></svg>',
archive:'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="2" y="2.5" width="12" height="3.5" rx="1"/><path d="M3 6v7.5h10V6M6.5 9h3" stroke-linecap="round"/></svg>',
eyeK:'<svg width="20" height="20" viewBox="0 0 16 16" fill="#fff"><path d="M8 3C4.4 3 1.7 5.6.6 7.6a.8.8 0 0 0 0 .8C1.7 10.4 4.4 13 8 13s6.3-2.6 7.4-4.6a.8.8 0 0 0 0-.8C14.3 5.6 11.6 3 8 3Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>',
chatK:'<svg width="20" height="20" viewBox="0 0 16 16" fill="#fff"><path d="M8 1.5C4.1 1.5 1 4.1 1 7.3c0 1.6.8 3.1 2.1 4.1L2.6 14.5l3.2-1.6c.7.2 1.4.3 2.2.3 3.9 0 7-2.6 7-5.9S11.9 1.5 8 1.5Z"/></svg>',
okK:'<svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.3 3 3 6-6.3"/></svg>'};
const RAY='<svg class="ray" viewBox="0 0 34 34"><path d="M34 0v34H0Z" fill="#fff"/><path d="M34 7 7 34h7l20-20Z" fill="#f1af12"/><path d="M34 16 16 34h7l11-11Z" fill="#f5631a"/><path d="M34 25 25 34h9Z" fill="#006cfd"/></svg>';
/* ---------- качество ---------- */
const QG={4:[['#5bd66e','#4ac35e'],['#4ac35e','#39b04e'],['#39b04e','#289d3e'],['#289d3e','#178a2e']],3:[['#7edb8a','#6cce79'],['#6cce79','#59c168'],['#59c168','#47b556'],null],2:[['#ffd65c','#fbca4b'],['#fbca4b','#f7bf3a'],null,null],1:[['#ff8a8a','#f57277'],null,null,null]};
const QBG={4:'#ddf2e0',3:'#e2f3e4',2:'#f6ecd9',1:'#fbe3e5'};
const QN=['','Низкое','Среднее','Хорошее','Отличное'];
const seg=(q,i)=>QG[q][i]?`background:linear-gradient(90deg,${QG[q][i][0]},${QG[q][i][1]})`:`background:${QBG[q]}`;
function checklist(kind,q){const D=kind==='daily';const items=D?[['photo','Фото: от 10',20],['desc','Описание от 300 знаков',15],['rules','Правила дома и заселения',15],['amen','Удобства отмечены',10],['cal','Календарь обновлён за 7 дней',15],['chat','Отвечаете в чате быстрее 1 часа',15],['instant','Мгновенное бронирование',10]]:[['photo','Фото: от 10',20],['plan','Планировка',10],['desc','Описание от 300 знаков',15],['docs',kind==='sale'?'Проверено в Росреестре':'Документы собственника',20],['price','Цена в рынке',15],['calls','Отвечаете на звонки',20]];
 const miss=q===4?0:q===3?1:q===2?2:4;const ks=items.map(i=>i[0]).filter(k=>k!=='photo').sort(()=>R()-.5);if(q<=2)ks.unshift('photo');const want=ks.slice(0,miss);
 return items.map(([k,t,w])=>({k,t,w,done:!want.includes(k),cur:k==='photo'?(want.includes(k)?rint(q===1?3:5,7):rint(10,18)):null}))}
const score=L=>{const t=L.checks.reduce((a,i)=>a+i.w,0),d=L.checks.filter(i=>i.done).reduce((a,i)=>a+i.w,0);return Math.round(d/t*100)};
const level=L=>{const s=score(L);if(s>=95)return 4;if(s>=78)return 3;if(s>=55)return 2;return 1};
/* ---------- данные ---------- */
const STREETS={'Москва':['ул. Складочная, 6, стр. 1','ул. Бутырская, 46','ул. Новодмитровская, 2','ул. Марьиной Рощи, 8','ул. Большая Татарская, 24','Ленинградский пр., 37','ш. Энтузиастов, 1к2','ул. Электрозаводская, 21','ул. Мантулинская, 9','ул. Профсоюзная, 92','ул. Тверская, 18к1','Кутузовский пр., 30','ул. Пятницкая, 41','ул. Остоженка, 12','ул. Сретенка, 7','ул. Шаболовка, 23','пр. Мира, 102','ул. Арбат, 35','ул. Лесная, 9','ул. Покровка, 17'],'Санкт-Петербург':['Невский пр., 88','ул. Рубинштейна, 15','Лиговский пр., 50','наб. Фонтанки, 64','ул. Марата, 9'],'Сочи':['ул. Навагинская, 9','Курортный пр., 75','ул. Войкова, 1'],'Казань':['ул. Баумана, 44','ул. Пушкина, 26']};
const PC={};
function photoFor(scene,kind){const P=POOLS;let key,pool;if(scene==='building'){key='b';pool=P.bld}else if(scene==='house'){key='h';pool=P.house}else{key='i';pool=P.int.filter(i=>i!==4&&i!==19&&!(kind==='daily'&&(i===7||i===8)))}const n=pool.length;let st=7;while(n%st===0)st++;const k=PC[key]=(PC[key]||0)+1;return {ph:pool[(k*st)%n],v:Math.floor((k-1)/n)%4}}
const FLIP=['','transform:scaleX(-1)','transform:scale(1.3);transform-origin:20% 40%','transform:scaleX(-1) scale(1.3);transform-origin:30% 60%'];
const DAILY={promo:30,ready:16,upto:12,blocked:9,review:5,pause:12,below:7};
const SALE={top:18,prem:16,std:14,none:36,topNo:9,ending:7};
let SEQ=0;
function mk(kind,st){const L={id:'L'+(++SEQ),kind,state:'active'};const city=kind==='daily'?wpick({'Москва':62,'Санкт-Петербург':18,'Сочи':12,'Казань':8}):wpick({'Москва':82,'Санкт-Петербург':12,'Казань':6});L.city=city;L.addr=city+', '+pick(STREETS[city]);
 const rooms=+wpick({0:22,1:34,2:26,3:13,4:5});const area=rooms===0?rint(20,32):rooms===1?rint(32,46):rooms===2?rint(44,68):rooms===3?rint(64,98):rint(90,150);
 L.title=kind==='daily'?(rooms===0?(R()<.15?'Апартаменты':R()<.1?'Лофт':'Студия'):`${rooms}-комн. квартира`)+`, ${area} м²`:(rooms===0?'Студия':`${rooms}-комн. кв.`)+`, ${area} м²`;
 L.scene=kind==='sale'&&R()<.45?'building':'int';Object.assign(L,photoFor(L.scene,kind));
 if(kind==='daily'){L.price=Math.round((1800+area*55+R()*2500)*(city==='Москва'?1.2:city==='Сочи'?1.4:1)/100)*100;L.sub='за сутки'}
 else if(kind==='long'){L.price=Math.round((20000+area*900+R()*20000)*(city==='Москва'?1.3:1)/1000)*1000;L.sub='в месяц'}
 else{const ppm=(city==='Москва'?260000:170000)*(.7+R()*.9);L.price=Math.round(area*ppm/10000)*10000;L.sub=fmt(Math.round(L.price/area/100)*100)+' ₽ за м²'}
 L.status=st||(kind==='daily'?wpick(DAILY):wpick(SALE));
 const q={promo:pick([4,4,3]),ready:3,upto:2,blocked:1,review:pick([3,4]),pause:pick([4,3]),below:pick([4,3]),top:pick([4,4,3]),prem:pick([4,3]),std:pick([3,2,4]),none:pick([3,3,2,4]),topNo:1,ending:pick([3,4])}[L.status];
 L.checks=checklist(kind,q);L.q=level(L);
 const promo=['promo','below','top','prem','std','ending'].includes(L.status);L.promo=promo;
 L.comm=L.status==='promo'?rint(18,25):L.status==='below'||L.status==='pause'?21:null;
 // профит и место
 if(promo){L.profit=L.status==='below'?40:rint(40,190);L.rank=L.status==='below'?rint(6,12):rint(1,10)}
 else if(L.status==='review'){L.profit=90;L.rank=rint(14,24)}
 else if(L.status==='pause'){L.profit=-rint(50,80);L.rank=0}
 else if(L.status==='upto'){L.profit=-rint(40,90);L.rank=rint(22,36)}
 else{L.profit=-rint(100,160);L.rank=L.status==='blocked'||L.status==='topNo'?rint(52,64):rint(34,50)}
 const hot=promo?2.2:L.status==='blocked'||L.status==='topNo'?.3:1;
 L.v7=Math.round((15+R()*110)*hot);L.vt=Math.round(L.v7*(10+R()*25));L.fav=Math.round(R()*36*Math.sqrt(hot));L.shr=Math.round(R()*6*hot);L.chats=kind==='daily'?Math.round(R()*10*hot):0;L.calls=kind==='daily'?0:Math.round(R()*14*hot);
 if(R()<.12){L.fav=0}if(R()<.3){L.shr=0}if(kind==='daily'&&R()<.25)L.chats=0;if(kind!=='daily'&&R()<.15)L.calls=0;
 L.created=Date.now()-SEQ*3.6e6*(2+R()*20);return L}
const DATA=[];
const PRE=[['daily','promo'],['sale','top'],['daily','ready'],['long','none'],['daily','below'],['daily','blocked'],['daily','pause'],['sale','top'],['daily','upto'],['daily','review'],['sale','topNo'],['daily','promo'],['sale','none'],['daily','ready']];
for(let i=0;i<486;i++){const p=PRE[i];DATA.push(p?mk(p[0],p[1]):mk(wpick({daily:44,long:24,sale:32})))}
for(const [s,n] of [['inactive',23],['draft',17],['archive',4]])for(let i=0;i<n;i++){const L=mk(pick(['daily','long','sale']));L.state=s;DATA.push(L)}
const byId=id=>DATA.find(L=>L.id===id);
/* ---------- представление статуса ---------- */
function view(L){const D=L.kind==='daily';const s=L.status;
 const st={promo:['icon-positive',`Продвигается · ${L.comm}%`],ready:['icon-secondary','Не продвигается'],upto:['icon-secondary','Не продвигается'],blocked:['icon-negative','Недоступно продвижение'],review:['icon-secondary','На проверке'],pause:['icon-warning',`На паузе · ${L.comm}%`],below:['icon-positive',`Продвигается · ${L.comm}%`],top:['icon-positive','Топ · 195 ₽/день'],prem:['icon-positive','Премиум · 832 ₽/день'],std:['icon-positive','Стандарт · 274 ₽/день'],ending:['icon-warning','Премиум · осталось 3 д.'],none:['icon-secondary','Не продвигается'],topNo:['icon-negative','Недоступно продвижение']}[s];
 let tone,icon,label;
 if(s==='review'){tone='neu';icon='clock';label='≈ +90 просм. скоро'}
 else if(s==='below'){tone='warn';icon='up';label='+40 из +80 просм.'}
 else if(s==='pause'){tone='warn';icon='pause';label=`${L.profit} просм. в день`.replace('-','−')}
 else if(L.profit>0){tone='pos';icon='up';label=`+${L.profit} просм. в день`}
 else{tone=L.profit<=-100?'neg':'warn';icon='down';label=`${L.profit} просм. в день`.replace('-','−')}
 const btn={promo:['Настроить','s'],ready:['Продвинуть','p'],upto:['Продвинуть','p'],blocked:['Улучшить','s'],review:['Открыть','s'],pause:['Календарь','s'],below:['Настроить','s'],top:['Поднять','s'],prem:['Настроить','s'],std:['Настроить','s'],ending:['Продлить','p'],none:['Продвинуть','p'],topNo:['Улучшить','s']}[s];
 const tips={promo:'Объявление поднято в поиске, на карте и в рекомендациях. Комиссию спишем только после оплаты брони.',ready:'Продвижение выключено. Качество позволяет включить до 25%.',upto:'Продвижение выключено. Сейчас доступно до 19% — улучшите качество, чтобы открыть 25%.',blocked:'Качество низкое — продвижение и рекомендации закрыты.',review:'Проверяем изменения до 1 часа — продвижение включится само.',pause:'Нет свободных дат — показы остановлены, настройки сохранены.',below:'Пока просмотров меньше обещанных. Не догоним до воскресенья — спишем только 15%.',top:'Фиксированная позиция в выдаче района. Ставка списывается раз в сутки.',prem:'Выделение в выдаче и приоритет над Стандартом.',std:'Базовое продвижение в поиске.',ending:'Оплаченный период скоро закончится.',none:'Продвижение выключено — объявление в общей выдаче.',topNo:'Без фото доступен только Стандарт.'}[s];
 return {st,tone,icon,label,btn,tip:tips}}
const rankIdx=r=>r?Math.min(12,Math.max(1,Math.ceil(r/64*12))):0;
const rankTone=i=>i===0?'icon-secondary':i<=3?'icon-positive':i<=7?'icon-warning':'icon-negative';
const rankTxt=i=>i===0?'ts':i<=3?'tpos':i<=7?'tw':'tneg';
const spread=L=>L.promo||L.status==='review'?1:2;
function strip(L){const idx=rankIdx(L.rank),sp=spread(L),lo=Math.max(1,idx-sp),hi=Math.min(12,idx+sp),c=`var(--${rankTone(idx)})`;let h='';for(let i=1;i<=12;i++){if(idx&&i===idx)h+=`<i class="on" style="background:${c}"></i>`;else if(idx&&i>=lo&&i<=hi)h+=`<i style="background:${c};opacity:.35"></i>`;else h+=`<i style="background:var(--icon-secondary);opacity:.25"></i>`}return h}
/* ---------- строка ---------- */
function tip(t,k){return esc(`<b>${t}</b>${k?`<span class=k>${k}</span>`:''}`)}
function rowHTML(L){const v=view(L);const qb=QG[L.q].map((_,i)=>`<i style="${seg(L.q,i)}"></i>`).join('');
 const P=(ic,val,t,k)=>`<span class="pill" data-tip="${tip(t,k)}">${I[ic]}${val}</span>`;
 const stats=[P('eye',kf(L.vt),`${fmt(L.vt)} просмотров`,`+${L.v7} за 7 дней`),P('heart',L.fav,`${L.fav} в избранном`,'Столько людей сохранили объявление'),P('share',L.shr,`Поделились ${L.shr} ${plural(L.shr,'раз','раза','раз')}`,'Ссылки в мессенджерах и соцсетях'),L.kind==='daily'?P('chat',L.chats,`${L.chats} ${plural(L.chats,'чат','чата','чатов')} за 7 дней`,'Звонков у посуточной аренды нет — гости пишут и бронируют онлайн'):P('phone',L.calls?'+'+L.calls:0,`${L.calls} ${plural(L.calls,'звонок','звонка','звонков')} за 7 дней`,'Звонки с подменного номера Циан')].join('');
 const idx=rankIdx(L.rank);
 return `<div class="item cols" data-id="${L.id}">
 <div class="listing"><div class="ph" data-act="open"><img alt="" src="${PHOTOS[L.ph]}" style="${FLIP[L.v]}"></div>
  <div class="info"><div><div class="h4 nm" data-act="open">${esc(L.title)}</div><div class="h6 ts ad">${esc(L.addr)}</div></div>
   <div class="qrow" data-pop="quality"><span class="qbar">${qb}</span><span class="h6 ts">качество ${score(L)}</span></div>
   <div class="stats">${stats}</div></div></div>
 <div class="price" data-tip="${tip(L.kind==='daily'?'Цена за сутки':L.kind==='long'?'Цена в месяц':'Цена продажи',L.kind==='daily'?'Базовая, без сезонных наценок и уборки':L.kind==='long'?'Без коммунальных платежей и залога':L.sub)}"><span class="h2">${fmt(L.price)} ₽</span><span class="h6 ts">${L.sub}</span></div>
 <div class="promo"><div class="pinfo">
   <span class="pstat" data-tip="${tip(v.st[1],v.tip)}"><span class="dot" style="background:var(--${v.st[0]})"></span><span class="h6 tp">${v.st[1]}</span></span>
   <span class="plabel ${v.tone}" data-pop="profit">${I[v.icon]}${v.label}${I.info}</span>
   <span class="lpos" data-pop="place"><span class="strip">${strip(L)}</span>${idx?`<span class="h6 ${rankTxt(idx)}">${L.rank}</span><span class="cap ts">место в среднем</span>`:'<span class="cap ts">вне выдачи</span>'}</span>
  </div><button class="btn ${v.btn[1]}" data-act="cta">${v.btn[0]}</button></div>
 <button class="more" data-act="more" data-tip="${tip('Ещё действия')}">${I.more}</button></div>`}
/* ---------- состояние ---------- */
const S={tab:'active',q:'',city:[],quality:[],promo:[],price:'d',sort:'new',shown:20};
const PROMO_F={on:'Продвигается',off:'Не продвигается',blocked:'Недоступно',pause:'На паузе / проверке'};
const promoKey=L=>L.promo?'on':['blocked','topNo'].includes(L.status)?'blocked':['pause','review'].includes(L.status)?'pause':'off';
const SORTS={new:'сначала новые',priceAsc:'цена по возрастанию',priceDesc:'цена по убыванию',views:'больше просмотров',quality:'сначала требуют внимания',rank:'ниже в выдаче'};
function filtered(){let a=DATA.filter(L=>L.state===S.tab);
 if(S.city.length)a=a.filter(L=>S.city.includes(L.city));if(S.quality.length)a=a.filter(L=>S.quality.includes(L.q));if(S.promo.length)a=a.filter(L=>S.promo.includes(promoKey(L)));
 if(S.price)a=a.filter(L=>S.price==='d'?L.kind==='daily':S.price==='l'?L.kind==='long':L.kind==='sale');
 if(S.q.trim()){const q=S.q.toLowerCase();a=a.filter(L=>(L.addr+' '+L.title).toLowerCase().includes(q))}
 const so={new:(x,y)=>y.created-x.created,priceAsc:(x,y)=>x.price-y.price,priceDesc:(x,y)=>y.price-x.price,views:(x,y)=>y.v7-x.v7,quality:(x,y)=>score(x)-score(y),rank:(x,y)=>(y.rank||99)-(x.rank||99)}[S.sort];return a.sort(so)}
function render(){const cnt={};for(const L of DATA)cnt[L.state]=(cnt[L.state]||0)+1;const act=DATA.filter(L=>L.state==='active');const pr=act.filter(L=>L.promo).length;
 const list=filtered(),shown=list.slice(0,S.shown);const n=k=>S[k].length;const any=S.city.length||S.quality.length||S.promo.length||S.price;
 const dd=(k,l,c)=>`<button class="dd${c?' act':''}" data-dd="${k}">${l}${c?`<span class="c">${c}</span>`:''}${I.chev}</button>`;
 $('#main').innerHTML=`<div class="h1" style="margin-bottom:20px">Мои объявления</div>
 <div class="row"><div class="seg">${[['active','Активные'],['inactive','Неактивные'],['draft','Черновики'],['archive','Архив']].map(([k,t])=>`<button class="${S.tab===k?'on':''}" data-tab="${k}">${t} ${cnt[k]||0}</button>`).join('')}</div>
 <label class="search">${I.search}<input id="q" placeholder="Поиск по адресу" value="${esc(S.q)}"></label></div>
 <div class="kpis"><div class="kpi on" data-tip="${tip('Просмотры за 7 дней','По всем активным объявлениям · +18% к прошлой неделе')}"><div><div class="b2 ts">Просмотры за 7 дней</div><div class="v">${fmt(act.reduce((a,L)=>a+L.v7,0)*3)} &nbsp;+18%</div></div><span class="bd">${I.eyeK}</span></div>
 <div class="kpi" data-tip="${tip('Брони и чаты','Онлайн-брони, чаты и звонки за 7 дней')}"><div><div class="b2 ts">Брони и чаты</div><div class="v">${fmt(act.reduce((a,L)=>a+L.chats+L.calls,0))}</div></div><span class="bd">${I.chatK}</span></div>
 <div class="kpi click" data-act="kpi-promo" data-tip="${tip('Продвигаются','Нажмите, чтобы показать только продвигаемые')}"><div><div class="b2 ts">Продвигаются</div><div class="v">${pr} из ${act.length}</div></div><span class="bd">${I.okK}</span></div></div>
 <div class="filters">${dd('city','Любой город',n('city'))}${S.price?`<button class="dd act" data-dd="price">${{d:'Посуточно',l:'Длительно',s:'Продажа'}[S.price]}${I.chev}</button>`:dd('price','Тип сделки',0)}${dd('quality','Качество объявления',n('quality'))}${dd('promo','Продвижение',n('promo'))}${any?'<button class="reset" data-act="reset">Сбросить</button>':''}</div>
 <div class="table"><div class="thead cols"><span class="sort h6" data-act="sort" data-tip="${tip('Сортировка','Нажмите, чтобы сменить')}">Объявления · <span class="tm">${SORTS[S.sort]}</span>${I.sort}</span><span class="h6">Цена</span><span class="h6">Статус продвижения</span><span class="h6" style="justify-self:end;margin-right:-8px">Действия</span></div>
 <div class="list">${shown.length?shown.map(rowHTML).join(''):`<div class="empty"><div class="h4">Ничего не нашлось</div><div class="b2 ts" style="margin:6px 0 16px">Попробуйте изменить фильтры</div><button class="btn s sm" data-act="reset">Сбросить фильтры</button></div>`}</div>
 ${list.length>shown.length?`<div class="more-wrap"><span class="b2 ts">Показано ${shown.length} из ${list.length}</span><button class="btn s sm" data-act="more-list">Показать ещё ${Math.min(20,list.length-shown.length)}</button></div>`:''}</div>`;
 if(focusQ){const qi=$('#q');qi.focus();qi.setSelectionRange(qi.value.length,qi.value.length)}}
let focusQ=false;
/* ---------- тултип ---------- */
const TIP=$('#tip');let tEl=null,tT=null;
document.addEventListener('mouseover',e=>{const t=e.target.closest('[data-tip]');if(t===tEl)return;tEl=t;clearTimeout(tT);TIP.classList.remove('show');if(!t||POP&&POP.contains(t))return;
 tT=setTimeout(()=>{TIP.innerHTML=t.dataset.tip;TIP.style.left='0';TIP.style.top='0';TIP.className='tip show';const b=t.getBoundingClientRect(),w=TIP.offsetWidth,h=TIP.offsetHeight;let x=b.left+b.width/2-w/2;x=Math.max(8,Math.min(innerWidth-w-8,x));let y=b.top-h-10,cls='up';if(y<8){y=b.bottom+10;cls='down'}TIP.classList.add(cls);TIP.style.left=x+'px';TIP.style.top=y+'px';TIP.style.setProperty('--ax',(b.left+b.width/2-x)+'px')},250)});
function hideTip(){clearTimeout(tT);TIP.classList.remove('show');tEl=null}
addEventListener('scroll',()=>{hideTip()},true);
/* ---------- поповеры ---------- */
let POP=null,POPA=null,PIN=false,hT=null;
function closePop(){if(POP)POP.remove();if(POPA)POPA.classList.remove('open');POP=null;POPA=null;PIN=false}
function place(el,a,align){document.body.appendChild(el);const b=a.getBoundingClientRect(),w=el.offsetWidth,h=el.offsetHeight;let x=align==='right'?b.right-w:b.left-8;x=Math.max(8,Math.min(innerWidth-w-8,x));let y=b.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,b.top-h-8);el.style.left=x+'px';el.style.top=y+'px'}
function openPop(a,kind,pin){closePop();hideTip();const L=byId(a.closest('.item').dataset.id);const el=document.createElement('div');el.className='pop';el.dataset.id=L.id;el.dataset.kind=kind;el.innerHTML=({quality:popQuality,place:popPlace,profit:popProfit})[kind](L);el.style.width=(kind==='quality'?380:kind==='profit'?410:400)+'px';place(el,a);if(kind==='quality')animRing(el);POP=el;POPA=a;a.classList.add('open');PIN=!!pin;
 el.addEventListener('mouseleave',()=>{if(!PIN)setTimeout(()=>{if(POP===el&&!PIN&&!el.matches(':hover')&&!a.matches(':hover'))closePop()},160)})}
document.addEventListener('mouseover',e=>{const a=e.target.closest('[data-pop]');if(!a)return;clearTimeout(hT);if(POPA===a||(PIN&&POP))return;hT=setTimeout(()=>{if(a.matches(':hover'))openPop(a,a.dataset.pop,false)},280)});
document.addEventListener('mouseout',e=>{const a=e.target.closest('[data-pop]');if(!a)return;clearTimeout(hT);if(POPA===a&&!PIN)setTimeout(()=>{if(POP&&!PIN&&!POP.matches(':hover')&&!a.matches(':hover'))closePop()},200)});
const bring=s=>{const S=88,w=10,r=(S-w)/2,C=2*Math.PI*r,L=s>=100?C:Math.max(.1,C*s/100-w*.9),H=Math.max(.1,Math.min(C*s/100*.29,r*1.05)-w*.9);return `<div class="bring" data-to="${s}"><svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><circle class="bt" cx="${S/2}" cy="${S/2}" r="${r}" fill="none" stroke="var(--surface-neutral)" stroke-width="${w}"/><g transform="rotate(-90 ${S/2} ${S/2})" fill="none" stroke-width="${w}" stroke-linecap="round"><circle class="ba" cx="${S/2}" cy="${S/2}" r="${r}" stroke="#F5631A" stroke-dasharray="${L} ${C}" data-len="${L}" data-c="${C}"/>${s>=100?'':`<circle class="bh" cx="${S/2}" cy="${S/2}" r="${r}" stroke="#F1AF12" stroke-dasharray="${H} ${C}" data-len="${H}" data-c="${C}"/>`}</g></svg><b>${s}</b></div>`};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function animRing(root,from,lvlUp){const R=root.querySelector('.bring');if(!R||RM)return;const to=+R.dataset.to,fresh=from==null,f0=fresh?0:from,D=fresh?1100:800,E='cubic-bezier(.22,1,.36,1)';
 const a=R.querySelector('.ba'),h=R.querySelector('.bh'),b=R.querySelector('b'),hd=root.querySelector('.bhead');
 const C=+a.dataset.c,L=+a.dataset.len,fl=Math.max(.1,fresh?.1:C*f0/100-9);
 a.animate([{strokeDasharray:`${fl} ${C}`},{strokeDasharray:`${L} ${C}`}],{duration:D,easing:E,delay:fresh?120:0,fill:'backwards'});
 if(h&&fresh)h.animate([{strokeDasharray:`.1 ${C}`,opacity:0},{strokeDasharray:`${h.dataset.len} ${C}`,opacity:1}],{duration:650,easing:E,delay:520,fill:'backwards'});
 if(fresh){R.animate([{transform:'scale(.7) rotate(-35deg)',opacity:0},{transform:'none',opacity:1}],{duration:700,easing:'cubic-bezier(.34,1.56,.64,1)'});
  hd&&hd.animate([{clipPath:'inset(0 100% 0 0 round 16px)'},{clipPath:'inset(0 0 0 0 round 16px)'}],{duration:520,easing:E});
  hd&&hd.querySelectorAll('.head>*').forEach((n,i)=>n.animate([{opacity:0,transform:'translateX(14px)'},{opacity:1,transform:'none'}],{duration:500,easing:E,delay:220+i*90,fill:'backwards'}));
  root.querySelectorAll('.bigbar i').forEach((n,i)=>n.animate([{transform:'scaleX(0)',transformOrigin:'left'},{transform:'scaleX(1)',transformOrigin:'left'}],{duration:420,easing:E,delay:300+i*90,fill:'backwards'}))}
 const t0=performance.now()+(fresh?120:0);const step=now=>{const p=Math.min(1,Math.max(0,(now-t0)/D)),e=1-Math.pow(1-p,4);b.textContent=Math.round(f0+(to-f0)*e);if(p<1)requestAnimationFrame(step);else b.animate([{transform:'scale(1)'},{transform:'scale(1.16)'},{transform:'scale(1)'}],{duration:360,easing:'ease-out'})};b.textContent=f0;requestAnimationFrame(step);
 if(lvlUp&&hd){hd.classList.remove('lvlup');void hd.offsetWidth;hd.classList.add('lvlup')}}
const ring=(s,c)=>{const C=2*Math.PI*24;return `<div class="ring"><svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke="var(--surface-neutral)" stroke-width="6"/><circle cx="28" cy="28" r="24" fill="none" stroke="${c}" stroke-width="6" stroke-dasharray="${C*s/100} ${C}" transform="rotate(-90 28 28)"/></svg><b>${s}</b></div>`};
function unlocks(L){if(L.kind==='daily')return [[L.q>=2,L.q>=3?'Продвижение комиссией до 25%':L.q===2?'Продвижение комиссией до 19%':'Продвижение комиссией'],[L.q>=3,'Показ в рекомендациях'],[L.q>=4,'Бейдж «Отличное жильё» в поиске']];return [[true,'Стандарт'],[L.q>=2,'Премиум'],[L.q>=3,'Топ с фиксированной позицией'],[L.q>=4,'Бейдж «Проверенное объявление»']]}
function popQuality(L){const s=score(L),q=L.q,todo=L.checks.filter(i=>!i.done);const col=['','var(--icon-negative)','var(--icon-warning)','var(--icon-positive)','var(--icon-positive)'][q];
 const sub=q===4?'Максимальный уровень — всё открыто':`До «${['','Низкого','Среднего','Хорошего','Отличного'][q+1]}» — ${todo.length} ${plural(todo.length,'пункт','пункта','пунктов')}${q===1?', продвижение закрыто':''}`;
 const items=[...L.checks].sort((a,b)=>a.done-b.done).map(i=>`<div class="it ${i.done?'done':'todo'}" ${i.done?'':`data-fix="${i.k}"`}><span class="ic20 ${i.done?'okl':'todo'}">${i.done?I.check12:''}</span><span class="b2 tx ${i.done?'ts':'tp'}">${i.k==='photo'?`Фото: ${i.cur} из 10`:i.t}</span>${i.done?'':`<span class="lnk">+${i.w} · Исправить</span>`}</div>`).join('');
 const un=unlocks(L).map(([ok,t])=>`<div class="r"><span class="ic20 ${ok?'ok':'lock'}">${ok?I.check12:I.lock12}</span><span class="b2 ${ok?'tp':'ts'}">${t}</span></div>`).join('');
 return `<div class="bhead">${bring(s)}<div class="head"><span class="h4">Качество: ${QN[q].toLowerCase()}</span><span class="b2">${sub}</span></div></div>
 <div><div class="bigbar">${QG[q].map((_,i)=>`<i style="${seg(q,i)}"></i>`).join('')}</div><div class="zones">${[1,2,3,4].map(i=>`<span class="${i===q?'h6 tp':'cap ts'}">${QN[i]}</span>`).join('')}</div></div>
 <div class="cl">${items}</div>
 <div class="box"><span class="h6 ts">${q===1?'Пока закрыто':'Открыто для объявления'}</span>${un}</div>
 <div class="foot"><span class="cap ts">Пересчитываем сразу после изменений</span>${todo.length?'<button class="btn p sm" data-act="fixall">Улучшить</button>':''}</div>`}
function popPlace(L){const idx=rankIdx(L.rank),sp=spread(L),c=`var(--${rankTone(idx)})`,lo=Math.max(1,idx-sp),hi=Math.min(12,idx+sp);const sim=L.kind==='daily'?'студии и 1-комн., ±20% площади, ±15% цены за сутки':L.kind==='long'?'та же комнатность, ±20% площади, ±15% цены в месяц':'та же комнатность, ±20% площади, ±15% цены';
 const zone=idx?Math.min(3,Math.floor((idx-1)/3)):-1;const Z=['Наверху','Выше среднего','Ниже среднего','Внизу'];
 let bar='';for(let i=1;i<=12;i++){bar+=idx&&i===idx?`<i style="background:${c}"></i>`:idx&&i>=lo&&i<=hi?`<i style="background:${c};opacity:.35"></i>`:'<i style="background:var(--surface-neutral)"></i>'}
 const mn=Math.max(1,L.rank-sp*5),mx=Math.min(64,L.rank+sp*5);const D=L.kind==='daily';const you=Math.max(L.promo?60:4,Math.round(L.v7/7)+(L.promo?L.profit:0));const nb=L.promo?Math.round(you*.45):you-L.profit;
 const why=L.promo?[['up','pos',`Продвижение${L.comm?' '+L.comm+'%':''} — выше ${64-L.rank} соседей`],['ok','pos',`Качество ${QN[L.q].toLowerCase()} — ${score(L)} из 100`]]
 :L.status==='pause'?[['cal','warn','Гости бронируют соседей с открытыми датами'],['ok','pos',`Настройки продвижения ${L.comm}% сохранены`]]
 :L.q<=1?[['edit','neg','Нет описания и правил дома'],['img','neg','Мало фото — у соседей от 12']]
 :L.q===2?[['img','warn','У соседей выше от 12 фото'],['up','warn','6 из 10 соседей продвигаются']]
 :[['up','warn',D?'8 из 10 соседей выше продвигаются с комиссией 20–25%':'11 из 12 соседей выше — в Топе или Премиуме'],['ok','pos',`Качество как у вас — «${QN[L.q]}»`]];
 const icn={up:I.arrowBold,ok:I.check12,img:I.img12,edit:I.edit12,cal:I.cal12};const bgv={pos:'surface-positive',warn:'surface-warning',neg:'surface-negative'},fgv={pos:'icon-positive',warn:'icon-warning',neg:'icon-negative'};
 const tips=L.promo?[[`Поднимите до 25% — будете ближе к 1 месту`,'Настроить'],['Откройте даты на праздники','Календарь']]:L.status==='pause'?[['Откройте хотя бы 3 даты — вернётесь на ~4 место','Календарь']]:L.q<=1?[['Напишите описание от 300 знаков','Исправить'],['Добавьте правила дома','Исправить'],['Добавьте 6 фото','Добавить']]:L.q===2?[['Добавьте 6 фото — +20 к качеству','Добавить'],['Откроется продвижение до 25%','']]:[[D?'Включите продвижение 21% → ~4 место':'Топ за 195 ₽/день → ~6 место','Продвинуть']];
 const filt=idx?[['Без фильтров',L.rank],[D?'Мгновенная бронь':'Сортировка по цене',Math.max(1,L.rank-rint(3,9))],['На карте',Math.min(64,L.rank+rint(2,8))]]:[];
 const btn=L.promo?['Настроить','s']:L.status==='pause'?['Календарь','s']:L.q<=1?['Улучшить','p']:L.q===2?['Добавить фото','p']:['Продвинуть','p'];
 return `<div class="head"><span class="h4">${idx?`В среднем ${L.rank} место из 64`:'Вне выдачи'}</span><span class="cap ts">${idx?'Среди похожих в районе: '+sim:'Нет свободных дат на 14 дней — объявление не показывается'}</span></div>
 <div><div class="bigbar">${bar}</div><div class="zones">${Z.map((z,i)=>`<span class="${i===zone?'h6 tp':'cap ts'}">${z}</span>`).join('')}</div></div>
 <div class="box"><span class="cap ts">${idx?`Яркий сегмент — ваше среднее место за 7 дней, светлые — разброс ${mn}–${mx} в разных поисках.`:'Пока объявление не показывается — откройте даты, и место появится.'}</span></div>
 ${filt.length?`<div style="display:flex;flex-direction:column;gap:6px">${filt.map(([a,b])=>`<div class="frow"><span class="b2 ts">${a}</span><span class="h6 tp">~${b} место</span></div>`).join('')}</div>`:''}
 <div class="cmp"><table><tr><th></th><th>Вы</th><th>Соседи</th><th>Разница</th></tr>
 <tr><td>Просмотры/день</td><td>${you}</td><td>${nb}</td><td class="${you-nb>=0?'tpos':you-nb<=-100?'tneg':'tw'}">${you-nb>0?'+':''}${String(you-nb).replace('-','−')}</td></tr>
 <tr><td>${D?'Брони/неделя':'Звонки/день'}</td><td>${D?Math.max(0,Math.round(L.chats/3)):Math.round(L.calls/7)}</td><td>${D?(L.promo?1:5):(L.promo?2:6)}</td><td></td></tr>
 <tr><td>${L.q<=2?'Фото':'Продвижение'}</td><td>${L.q<=2?L.checks[0].cur:L.promo?(L.comm?L.comm+'%':'Топ'):'нет'}</td><td>${L.q<=2?'от 12':D?'20–25%':'Топ'}</td><td></td></tr></table></div>
 <div class="why"><span class="h6 ts">${L.promo?'Почему вы выше':L.status==='pause'?'Что происходит':'Почему они выше'}</span>${why.map(([k,t,x])=>`<div class="r"><span class="ic24" style="background:var(--${bgv[t]});color:var(--${fgv[t]})">${icn[k]}</span><span class="b2 tp">${x}</span></div>`).join('')}</div>
 <div class="box main tips"><span class="h6 tp">${L.promo?'Как удержать место':L.q<=2&&!L.promo?'Что улучшить':'Что сделать'}</span>${tips.map(([t,a])=>`<div class="r"><span class="n"></span><span class="b2 tp tx">${t}</span>${a?`<span class="lnk" data-act="tip-act">${a} →</span>`:''}</div>`).join('')}</div>
 <div class="foot"><span class="cap ts">Среднее место за 7 дней по всем поискам</span><button class="btn ${btn[1]} sm" data-act="pop-cta">${btn[0]}</button></div>`}
function popProfit(L){const pos=L.profit>0&&L.status!=='review';const D=L.kind==='daily';const you=Math.round(L.v7/7);
 const bars=Array.from({length:14},(_,i)=>{const base=3+((i*37)%3);return pos&&i>=7?base+6+((i*11)%3):base});
 const title=L.status==='review'?'Скоро больше просмотров':L.status==='below'?'Ниже обещанного':pos?'Продвижение работает':L.profit<=-100?'Сколько вы недобираете':'Немного недобираете';
 const sub=L.status==='review'?'После проверки включится продвижение 21%':pos?(D?`За 7 дней с продвижением ${L.comm||21}% — сравнение с неделей до`:'За 7 дней в Топе — сравнение с неделей до'):'По сравнению с соседями выше в похожих поисках';
 const rows=pos?[['Просмотры/день',Math.max(5,you-L.profit),you,'+'+L.profit,'tpos'],[D?'Брони/неделя':'Звонки/день',1,4,'+3','tpos'],[D?'Выручка/неделя':'Показы в Топе',D?fmt(L.price)+' ₽':'—',D?fmt(L.price*4)+' ₽':'5 место',D?'+'+fmt(L.price*3)+' ₽':'','tpos']]:[['Просмотры/день',you,you-L.profit,String(L.profit).replace('-','−'),L.profit<=-100?'tneg':'tw'],[D?'Брони/день':'Звонки/день','0,2','2,2','−2',L.profit<=-100?'tneg':'tw']];
 const note=L.status==='review'?'Прогноз после проверки: ~4 место и +90 просмотров в день.':L.status==='below'?'Соседи подняли комиссию. Не догоним гарантию до воскресенья — спишем только базовые 15%.':pos?(D?`Надбавка ${(L.comm||21)-15}% — списали только после оплаты броней. Окупилась в ${rint(6,14)} раз.`:`Ставка 195 ₽/день — около ${rint(28,45)} ₽ за звонок.`):(L.q>=3?(D?'С продвижением 21% прогноз: ~4 место, +85 просмотров и ~1,6 брони в день. Комиссию спишем только после оплаты брони.':'Топ за 195 ₽/день → ~6 место, +4 звонка в день.'):'Улучшите качество — откроется продвижение до 25% и рекомендации.');
 const btn=pos||L.status==='below'?['Настроить','s']:L.status==='review'?['Открыть','s']:L.q<=1?['Улучшить','p']:['Продвинуть','p'];
 return `<div class="head"><span class="h4">${title}</span><span class="cap ts">${sub}</span></div>
 <div><div class="chart">${bars.map((b,i)=>`<i class="${pos&&i>=7?'on':''}" style="height:${Math.round(b/12*56)}px"></i>`).join('')}</div><div class="frow" style="margin-top:6px"><span class="cap ts">14 дней назад</span><span class="cap ${pos?'tpos':'ts'}">${pos?'включили продвижение →':'просмотры в день'}</span><span class="cap ts">сегодня</span></div></div>
 <div class="cmp"><table><tr><th></th><th>${pos?'Было':'Вы'}</th><th>${pos?'Стало':'Соседи'}</th><th>Разница</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[4]}">${r[3]}</td></tr>`).join('')}</table></div>
 <div class="box ${pos?'pos':'main'}"><span class="b2 tp">${note}</span></div>
 <div class="foot"><span class="lnk" style="flex:1" data-act="how">Как мы считаем</span><button class="btn ${btn[1]} sm" data-act="pop-cta">${btn[0]}</button></div>`}
/* ---------- меню ---------- */
let MENU=null,MA=null;function closeMenu(){if(MENU)MENU.remove();if(MA)MA.classList.remove('open');MENU=null;MA=null}
function openMenu(a,html,cls,align){closeMenu();closePop();hideTip();const m=document.createElement('div');m.className=cls;m.innerHTML=html;place(m,a,align);MENU=m;MA=a;a.classList.add('open');return m}
function actionsMenu(a,L){const D=L.kind==='daily';const it=[['pen','Редактировать','edit'],D?['calendar','Календарь и цены','cal']:null,['stats','Статистика','stats','7 дней'],['rocket',D?'Продвижение':'Поднять в поиске','promo',L.promo?(L.comm?L.comm+'%':'вкл'):''],!D?['send','Отправить рассылку','mail']:null,['star','Качество объявления','quality',score(L)],['share','Поделиться','share'],'-',['eyeoff','Снять с публикации','off'],['archive','В архив','arch','',1]].filter(Boolean);
 const m=openMenu(a,it.map(x=>x==='-'?'<hr>':`<button data-m="${x[2]}" class="${x[4]?'danger':''}">${I[x[0]]}<span class="b2 tx">${x[1]}</span>${x[3]!==undefined&&x[3]!==''?`<span class="cap ts">${x[3]}</span>`:''}</button>`).join(''),'menu','right');
 m.onclick=e=>{const k=e.target.closest('[data-m]')?.dataset.m;if(!k)return;closeMenu();
  if(k==='quality'){const el=$(`.item[data-id="${L.id}"] .qrow`);el.scrollIntoView({block:'center',behavior:'smooth'});setTimeout(()=>openPop(el,'quality',true),300);return}
  if(k==='off'||k==='arch'){const prev=L.state;L.state=k==='off'?'inactive':'archive';render();toast(k==='off'?'Снято с публикации':'Перенесено в архив',()=>{L.state=prev;render()});return}
  toast({edit:'Открываем редактор объявления',cal:'Открываем календарь и цены',stats:`${fmt(L.vt)} просмотров · ${L.fav} в избранном за всё время`,promo:'Настройка продвижения — в разработке',mail:'Рассылка — в разработке',share:'Ссылка скопирована'}[k])}}
function ddMenu(k,a){let opts=[],multi=true;const base=DATA.filter(L=>L.state===S.tab);
 if(k==='city')opts=[...new Set(DATA.map(L=>L.city))].map(c=>[c,c,base.filter(L=>L.city===c).length]);
 if(k==='quality')opts=[[4,'Отличное'],[3,'Хорошее'],[2,'Среднее'],[1,'Низкое']].map(([v,t])=>[v,t,base.filter(L=>L.q===v).length]);
 if(k==='promo')opts=Object.entries(PROMO_F).map(([v,t])=>[v,t,base.filter(L=>promoKey(L)===v).length]);
 if(k==='price'){multi=false;opts=[['d','Посуточно'],['l','Длительно'],['s','Продажа']]}
 const cur=k==='price'?[S.price]:S[k];
 const m=openMenu(a,opts.map(([v,t,c])=>multi?`<label data-v="${v}" class="${cur.includes(v)?'on':''}"><span class="cb ${cur.includes(v)?'on':''}">${cur.includes(v)?I.check12:''}</span>${k==='quality'?`<span class="qbar">${QG[v].map((_,i)=>`<i style="${seg(v,i)};width:14px;height:6px"></i>`).join('')}</span>`:''}${t}<span class="cnt">${c}</span></label>`:`<button data-v="${v}" class="${cur.includes(v)?'on':''}">${t}</button>`).join(''),'dmenu');
 m.onclick=e=>{const el=e.target.closest('[data-v]');if(!el)return;e.preventDefault();let v=el.dataset.v;if(k==='quality')v=+v;
  if(!multi){S.price=S.price===v?null:v;S.shown=20;closeMenu();render();return}const arr=S[k];const i=arr.indexOf(v);i>=0?arr.splice(i,1):arr.push(v);S.shown=20;render();ddMenu(k,$(`[data-dd="${k}"]`))}}
/* ---------- тосты ---------- */
function toast(msg,undo){const t=document.createElement('div');t.className='toast';t.innerHTML=`<span>${msg}</span>${undo?'<button>Отменить</button>':''}`;$('#toasts').appendChild(t);if(undo)t.querySelector('button').onclick=()=>{undo();t.remove()};setTimeout(()=>t.remove(),3800)}
/* ---------- события ---------- */
document.addEventListener('click',e=>{const t=e.target;
 if(MENU&&!MENU.contains(t)&&!(MA&&MA.contains(t)))closeMenu();
 if(POP&&!POP.contains(t)&&!(POPA&&POPA.contains(t)))closePop();
 const fix=t.closest('.pop [data-fix]');if(fix){const L=byId(POP.dataset.id);const it=L.checks.find(i=>i.k===fix.dataset.fix);const ps=score(L);it.done=true;if(it.k==='photo')it.cur=12;const pq=L.q;L.q=level(L);
  if(L.kind==='daily'&&L.q>=2&&L.status==='blocked')L.status=L.q>=3?'ready':'upto';if(L.kind==='daily'&&L.q>=3&&L.status==='upto')L.status='ready';if(L.kind!=='daily'&&L.q>=2&&L.status==='topNo')L.status='none';
  POP.innerHTML=popQuality(L);animRing(POP,ps,L.q>pq);PIN=true;const row=$(`.item[data-id="${L.id}"]`);row.outerHTML=rowHTML(L);const nr=$(`.item[data-id="${L.id}"]`);nr.classList.add('flash');POPA=nr.querySelector('.qrow');POPA.classList.add('open');toast(L.q>pq?`Качество выросло до «${QN[L.q]}»`:`Готово: ${it.t.split(':')[0]}`);return}
 const pa=t.closest('[data-pop]');if(pa){if(POPA===pa&&PIN){closePop();return}if(POPA===pa){PIN=true;return}openPop(pa,pa.dataset.pop,true);return}
 const tab=t.closest('[data-tab]');if(tab){S.tab=tab.dataset.tab;S.shown=20;render();return}
 const dd=t.closest('[data-dd]');if(dd){if(MA===dd){closeMenu();return}ddMenu(dd.dataset.dd,dd);return}
 const a=t.closest('[data-act]');if(!a)return;const act=a.dataset.act;const item=a.closest('.item');const L=item&&byId(item.dataset.id);
 if(act==='more'){if(MA===a){closeMenu();return}actionsMenu(a,L);return}
 if(act==='sort'){const m=openMenu(a,Object.entries(SORTS).map(([k,v])=>`<button data-s="${k}" class="${S.sort===k?'on':''}">${v[0].toUpperCase()+v.slice(1)}</button>`).join(''),'dmenu');m.onclick=e=>{const b=e.target.closest('[data-s]');if(!b)return;S.sort=b.dataset.s;closeMenu();render()};return}
 if(act==='reset'){Object.assign(S,{city:[],quality:[],promo:[],price:null,shown:20});render();return}
 if(act==='more-list'){S.shown+=20;render();return}
 if(act==='kpi-promo'){S.promo=['on'];S.shown=20;render();toast('Показаны только продвигаемые');return}
 if(act==='cta'){const label=a.textContent.trim();if(label==='Улучшить'){openPop(item.querySelector('.qrow'),'quality',true);return}if(label==='Календарь'){toast('Открываем календарь бронирований');return}if(label==='Открыть'){toast('Объявление на проверке — открываем карточку');return}toast(`«${label}» — окно продвижения в разработке`);return}
 if(act==='pop-cta'||act==='tip-act'||act==='fixall'||act==='how'){const lbl=a.textContent.replace('→','').trim();closePop();toast(act==='how'?'Методика расчёта — в разработке':lbl==='Улучшить'||act==='fixall'?'Открываем редактор объявления':`«${lbl}» — в разработке`);return}
 if(act==='open'){toast(`Открываем «${L.title}»`);return}
 if(act==='nav'){toast('В прототипе этот раздел не нарисован');return}
});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.q=e.target.value;S.shown=20;focusQ=true;render()}});
document.addEventListener('focusout',e=>{if(e.target.id==='q')focusQ=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closePop();closeMenu()}});
addEventListener('resize',()=>{closePop();closeMenu()});
render();
}
