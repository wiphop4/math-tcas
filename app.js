const KEY='mathtcas',$=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CH='เซต,ตรรกศาสตร์,จำนวนจริง,เรขาคณิตวิเคราะห์,ภาคตัดกรวย,ความสัมพันธ์และฟังก์ชัน,ฟังก์ชันเอกซ์โพเนนเชียลและลอการิทึม,ฟังก์ชันตรีโกณมิติ,เมทริกซ์,เวกเตอร์,จำนวนเชิงซ้อน,ลำดับและอนุกรม,แคลคูลัส,สถิติ,ความน่าจะเป็น,ตัวแปรสุ่ม'.split(',');
const ST=['ยังไม่เริ่ม','กำลังทำ','เสร็จ'],CK=['ยังไม่ตรวจ','ถูกต้อง','ผิด-รอแก้ไข'];
const T=[{k:'a',n:'งานที่ 1 · สรุปเนื้อหา MATH TCAS',s:[['AI ถอดเนื้อหาจาก PDF เป็น Word',2],['ตรวจความถูกต้องเทียบหนังสือ'],['เติมเนื้อหาเอง (เทคนิคจำ, หนังสือ สสวท.)'],['AI ปรับแต่งไฟล์ให้สวย',4],['AI สร้างไฟล์เขียนทวน',5]]},
{k:'b',n:'งานที่ 2 · ไฟล์โจทย์ HOMEWORK',s:[['ส่งไฟล์ให้ AI และยืนยันข้อที่ทำ/ข้าม',3],['AI ทำไฟล์โจทย์'],['ตรวจทานเทียบต้นฉบับ (จดเลขข้อที่ต้องแก้)'],['เสร็จสมบูรณ์']]}];
const PN={2:'ถอดเนื้อหา PDF เป็น Word (งาน 1 ขั้น 1)',3:'ยืนยันรายการข้อโจทย์ (งาน 2 ขั้น 1)',4:'ปรับแต่งไฟล์ให้สวย (งาน 1 ขั้น 4)',5:'สร้างไฟล์เขียนทวน (งาน 1 ขั้น 5)'};
const P4=`ฉันแนบไฟล์ Word สรุปเนื้อหา MATH TCAS บท {บท} ที่ฉันแก้และเติมเนื้อหาเองแล้ว ช่วยปรับแต่งไฟล์ให้สวย อ่านง่าย มินิมอล และเป็นระเบียบ แล้วตรวจความเรียบร้อยก่อนนำไปใช้จริง ได้แก่ ฟอนต์ ระยะห่าง ลำดับหัวข้อ สมการ และการขึ้นหน้าใหม่

เงื่อนไข
1. ห้ามเปลี่ยน แก้ หรือลบเนื้อหาใดๆ ปรับได้เฉพาะรูปแบบ
2. คงการแยกสีส่วนที่ AI เพิ่มไว้ (ปรับโทนสีให้สวยขึ้นได้ แต่ต้องยังแยกออกว่าส่วนไหน AI เพิ่ม)
3. เมื่อเสร็จ สรุปให้ฉันทราบว่าปรับอะไรไปบ้าง ถ้าพบจุดที่น่าสงสัยในเนื้อหา ให้แจ้งฉัน แต่ห้ามแก้เอง`;
const P5=`จากไฟล์สรุป MATH TCAS บท {บท} ที่แนบ ช่วยสร้างไฟล์ Word คู่ขนานไว้ให้ฉันเขียนทวน

1. ใช้ชื่อบทและหัวข้อเหมือนไฟล์สรุปทุกประการ (ลำดับและระดับหัวข้อเหมือนกัน)
2. ใต้ทุกหัวข้อเว้นพื้นที่ว่างให้ฉันเขียนอิสระว่าจำอะไรได้บ้าง ห้ามนำเนื้อหาจากไฟล์สรุปมาใส่
3. เฉพาะหัวข้อที่กว้างเกินไป ให้ใส่คำถาม Active Recall สั้นๆ เป็นคำใบ้ 1 ข้อ (ใส่แค่บางหัวข้อ ไม่ต้องมีเฉลย)
4. ดีไซน์มินิมอลเหมือนไฟล์สรุป`;
const DEF=()=>({ch:CH.map((n,i)=>({id:'c'+(i+1),n})),st:{},ck:{},pr:{2:'',3:'',4:P4,5:P5},upd:0,exp:0});
let S;try{S=Object.assign(DEF(),JSON.parse(localStorage[KEY]))}catch(e){S=DEF()}
const persist=()=>{try{localStorage[KEY]=JSON.stringify(S)}catch(e){}};
const save=()=>{S.upd=Date.now();persist()};
const BK=KEY+'_bk',fmt=t=>t?new Date(t).toLocaleString('th-TH'):'ยังไม่มี';
const opt=(a,v)=>a.map((x,i)=>`<option value=${i}${i==v?' selected':''}>${x}</option>`).join('');
let tm;const toast=m=>{const e=$('#toast');e.textContent=m;e.hidden=false;clearTimeout(tm);tm=setTimeout(()=>e.hidden=true,2600)};
const copy=t=>(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(()=>{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();document.execCommand('copy');a.remove()}).then(()=>toast('คัดลอกแล้ว'));
const sv=(c,t,i)=>(S.st[c+t.k+i]||{}).s||0;
const done=(c,t)=>t.s.every((_,i)=>sv(c,t,i)==2);
const next=t=>{for(const c of S.ch)for(let i=0;i<t.s.length;i++)if(sv(c.id,t,i)<2)return{c,i}};
const dots=(c,t)=>`<span class=ds>${t.s.map((_,i)=>`<i class="d s${sv(c.id,t,i)}" title="${ST[sv(c.id,t,i)]}"></i>`).join('')}</span>`;

function home(){
 let h=S.upd>S.exp?'<p class=note>มีการแก้ไขที่ยังไม่ได้บันทึกลง repo · <a href="#/b">ไปสำรองข้อมูล</a></p>':'';
 h+='<div class=sums>'+T.map(t=>{const n=S.ch.filter(c=>done(c.id,t)).length,tot=S.ch.length*t.s.length,d=S.ch.reduce((a,c)=>a+t.s.filter((_,i)=>sv(c.id,t,i)==2).length,0),nx=next(t);
  return `<section><h2>${t.n}</h2><div class=bar><i style="width:${tot?d/tot*100:0}%"></i></div><p>${n}/${S.ch.length} บทเสร็จ</p>`+(nx?`<p>ต่อไป: <a href="#/c/${nx.c.id}">${esc(nx.c.n)} · ขั้น ${nx.i+1} ${t.s[nx.i][0]}</a></p>`:'<p>เสร็จครบทุกบทแล้ว</p>')+'</section>'}).join('')+'</div>';
 return h+'<table><thead><tr><th>บท<th>งาน 1 (5 ขั้น)<th>งาน 2 (4 ขั้น)</tr></thead><tbody>'+S.ch.map((c,i)=>`<tr data-go="#/c/${c.id}"><td><a href="#/c/${c.id}">${i+1}. ${esc(c.n)}</a><td>${dots(c,T[0])}<td>${dots(c,T[1])}</tr>`).join('')+'</tbody></table><p class=mut>แต่ละจุดคือ 1 ขั้น: ว่าง = ยังไม่เริ่ม · เหลือง = กำลังทำ · เขียว = เสร็จ</p>';
}
function checker(c){const k=S.ck[c.id]||{raw:'',it:[]},ok=k.it.filter(x=>x.s==1).length;
 return `<div class=ck><textarea data-b=raw data-c="${c.id}" placeholder="วางรายชื่อหัวข้อ บรรทัดละ 1 หัวข้อ">${esc(k.raw)}</textarea><button data-act=ck data-c="${c.id}">ใช้รายชื่อนี้</button>`
 +(k.it.length?`<p class=cnt><b>${ok}/${k.it.length}</b> ถูกต้อง</p>`+k.it.map((x,j)=>`<div class="it t${x.s}"><span>${esc(x.t)}</span><select data-b=cs data-c="${c.id}" data-j=${j}>${opt(CK,x.s)}</select>${x.s==2?`<input data-b=cn data-c="${c.id}" data-j=${j} placeholder="จุดที่ผิด" value="${esc(x.n)}">`:''}</div>`).join(''):'')+'</div>'}
function chap(id){const c=S.ch.find(x=>x.id==id);if(!c)return home();
 return `<a href="#/">← ภาพรวม</a><h1>${esc(c.n)}</h1>`+T.map(t=>`<section><h2>${t.n}</h2>`+t.s.map(([n,p],i)=>{const k=c.id+t.k+i,o=S.st[k]||{s:0,n:''};
  return `<div class="step s${o.s}"><div class=hd>ขั้น ${i+1} · ${n}</div><div class=row><select data-b=s data-k="${k}">${opt(ST,o.s)}</select>${p?`<button data-act=cp data-p=${p} data-c="${c.id}">คัดลอกพรอมพ์ ${p}</button>`:''}</div><textarea data-b=n data-k="${k}" placeholder="โน้ต">${esc(o.n)}</textarea>${k==c.id+'a1'?checker(c):''}</div>`}).join('')+'</section>').join('')}
const prompts=()=>'<h1>คลังพรอมพ์</h1><p class=mut>พิมพ์ {บท} ตรงที่ต้องการให้ใส่ชื่อบทอัตโนมัติ · บันทึกให้เองทุกครั้งที่พิมพ์</p>'+[2,3,4,5].map(p=>`<section><h2>พรอมพ์ ${p} · ${PN[p]}</h2><textarea class=big data-b=pr data-p=${p} placeholder="${p<4?'วางพรอมพ์ของคุณที่นี่':''}">${esc(S.pr[p])}</textarea></section>`).join('');
const manage=()=>'<h1>จัดการบท</h1><p class=mut>แก้ชื่อได้ทันที · ถ้าลบบท ข้อมูลของบทนั้นจะหายไปด้วย</p>'+S.ch.map(c=>`<div class=row><input data-b=nm data-c="${c.id}" value="${esc(c.n)}"><button data-act=up data-c="${c.id}" aria-label="เลื่อนขึ้น">↑</button><button data-act=dn data-c="${c.id}" aria-label="เลื่อนลง">↓</button><button data-act=del data-c="${c.id}">ลบ</button></div>`).join('')+'<div class=row><input id=newch placeholder="ชื่อบทใหม่"><button data-act=add>เพิ่มบท</button></div>';
const backup=()=>`<h1>สำรองข้อมูล</h1><p>ข้อมูลบันทึกในเบราว์เซอร์เครื่องนี้ให้อัตโนมัติ ถ้าใช้หลายเครื่อง ให้ดาวน์โหลด data.json แล้วอัปโหลดทับในหน้า repo ของ GitHub (ดูคู่มือ) เครื่องอื่นจะดึงข้อมูลล่าสุดมาให้เองเมื่อเปิดเว็บ</p><p class=warn>repo เป็นสาธารณะ ทุกคนเปิดดู data.json ได้ อย่าพิมพ์ข้อมูลส่วนตัวหรือรหัสผ่านลงในโน้ต</p><div class=row><button data-act=ex>ดาวน์โหลด data.json</button><button data-act=imp>นำเข้าไฟล์ JSON</button>${localStorage[BK]?'<button data-act=rs>กู้คืนข้อมูลก่อนหน้า</button>':''}</div><p class=mut>แก้ไขล่าสุด: ${fmt(S.upd)} · ส่งออกล่าสุด: ${fmt(S.exp)}</p>`;

function render(){const h=location.hash.slice(2).split('/');
 $('#app').innerHTML=({c:()=>chap(h[1]),p:prompts,m:manage,b:backup}[h[0]]||home)();
 document.querySelectorAll('nav a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#/'+(h[0]=='c'?'':h[0])))}
addEventListener('hashchange',()=>{render();scrollTo(0,0)});

document.addEventListener('click',e=>{
 const g=e.target.closest('[data-go]');if(g&&!e.target.closest('a')){location.hash=g.dataset.go;return}
 const b=e.target.closest('[data-act]');if(!b)return;const d=b.dataset,a=d.act;
 if(a=='cp'){const p=S.pr[d.p]||'';if(!p.trim())return toast('พรอมพ์ '+d.p+' ยังว่าง ไปวางที่คลังพรอมพ์ก่อน');return copy(p.replaceAll('{บท}',S.ch.find(c=>c.id==d.c).n))}
 if(a=='ck'){const k=S.ck[d.c]=S.ck[d.c]||{raw:'',it:[]},old=Object.fromEntries(k.it.map(x=>[x.t,x]));k.it=k.raw.split('\n').map(x=>x.trim()).filter(Boolean).map(t=>old[t]||{t,s:0,n:''})}
 else if(a=='up'||a=='dn'){const i=S.ch.findIndex(c=>c.id==d.c),j=i+(a=='up'?-1:1);if(j<0||j>=S.ch.length)return;[S.ch[i],S.ch[j]]=[S.ch[j],S.ch[i]]}
 else if(a=='del'){if(!confirm('ลบบทนี้? ข้อมูลของบทจะหายไปด้วย'))return;S.ch=S.ch.filter(c=>c.id!=d.c);delete S.ck[d.c];Object.keys(S.st).filter(k=>k.startsWith(d.c)&&/^[ab]/.test(k.slice(d.c.length))).forEach(k=>delete S.st[k])}
 else if(a=='add'){const n=$('#newch').value.trim();if(!n)return;S.ch.push({id:'c'+Date.now(),n})}
 else if(a=='ex'){S.exp=Date.now();persist();const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(S,null,1)],{type:'application/json'}));l.download='data.json';l.click();toast('ดาวน์โหลดแล้ว อัปโหลดทับ data.json ใน repo ต่อได้เลย');return render()}
 else if(a=='imp'){$('#f').click();return}
 else if(a=='rs'){const o=JSON.parse(localStorage[BK]);localStorage[BK]=JSON.stringify(S);S=Object.assign(DEF(),o);toast('กู้คืนข้อมูลก่อนหน้าแล้ว')}
 save();render()});

document.addEventListener('input',e=>{const el=e.target,d=el.dataset,v=el.value;
 if(d.b=='n')(S.st[d.k]=S.st[d.k]||{s:0,n:''}).n=v;
 else if(d.b=='raw')(S.ck[d.c]=S.ck[d.c]||{raw:'',it:[]}).raw=v;
 else if(d.b=='cn')S.ck[d.c].it[d.j].n=v;
 else if(d.b=='pr')S.pr[d.p]=v;
 else if(d.b=='nm')S.ch.find(c=>c.id==d.c).n=v;
 else return;
 save()});

document.addEventListener('change',e=>{const el=e.target,d=el.dataset;
 if(el.id=='f'){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!Array.isArray(o.ch))throw 0;localStorage[BK]=JSON.stringify(S);S=Object.assign(DEF(),o);save();render();toast('นำเข้าข้อมูลแล้ว')}catch(x){toast('ไฟล์นี้ไม่ใช่ข้อมูลที่ถูกต้อง')}};r.readAsText(el.files[0]);el.value='';return}
 if(d.b=='s'){const v=+el.value;
  if(d.k.endsWith('a2')&&v){const bad=(S.ck[d.k.slice(0,-2)]||{it:[]}).it.filter(x=>x.s!=1).length;
   if(bad&&!confirm('ยังมี '+bad+' หัวข้อที่ยังไม่ผ่านการตรวจ จะไปขั้น 3 เลยไหม?'))return render()}
  (S.st[d.k]=S.st[d.k]||{s:0,n:''}).s=v}
 else if(d.b=='cs')S.ck[d.c].it[d.j].s=+el.value;
 else return;
 save();render()});

render();
fetch('data.json?t='+Date.now()).then(r=>r.ok?r.json():null).then(r=>{
 if(r&&Array.isArray(r.ch)&&(r.upd||0)>S.upd){localStorage[BK]=JSON.stringify(S);S=Object.assign(DEF(),r);S.exp=S.upd;persist();render();toast('โหลดข้อมูลล่าสุดจาก repo แล้ว')}}).catch(()=>{});
