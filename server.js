const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const ROOT=__dirname, DATA_DIR=path.join(ROOT,'data'), DB_FILE=path.join(DATA_DIR,'workspace.json');
const PORT=Number(process.env.PORT||3000);
fs.mkdirSync(DATA_DIR,{recursive:true});
function load(){try{return JSON.parse(fs.readFileSync(DB_FILE,'utf8'))}catch{return {reviews:[],decisions:[],activity:[]}}}
function save(db){const tmp=DB_FILE+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2));fs.renameSync(tmp,DB_FILE)}
let db=load();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function send(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(obj))}
function clean(v,max=20000){return String(v??'').slice(0,max)}
function body(req){return new Promise((resolve,reject)=>{let raw='',size=0;req.on('data',c=>{size+=c.length;if(size>350000){reject(new Error('Request too large (max 350 KB)'));req.destroy();return}raw+=c});req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch{reject(new Error('Invalid JSON request'))}});req.on('error',reject)})}
function stamp(){return new Date().toISOString()}
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');const p=url.pathname;
  if(req.method==='GET'&&p==='/api/health')return send(res,200,{status:'online',service:'BrandGuard workspace API',storage:'JSON file on server',timestamp:stamp()});
  if(req.method==='GET'&&p==='/api/reviews')return send(res,200,{items:db.reviews});
  if(req.method==='POST'&&p==='/api/reviews'){const b=await body(req);if(!clean(b.text).trim())return send(res,400,{error:'Draft text is required'});const item={id:crypto.randomUUID(),title:clean(b.title,120)||'Untitled draft',type:clean(b.type,50),text:clean(b.text,20000),findings:Array.isArray(b.findings)?b.findings.slice(0,100):[],rewrite:clean(b.rewrite,20000),risk:clean(b.risk,20),createdAt:stamp()};db.reviews.unshift(item);db.reviews=db.reviews.slice(0,200);save(db);return send(res,201,{item})}
  if(req.method==='GET'&&p==='/api/decisions')return send(res,200,{items:db.decisions});
  if(req.method==='POST'&&p==='/api/decisions'){const b=await body(req);if(!['Approved','Changes requested'].includes(b.status))return send(res,400,{error:'Decision must be Approved or Changes requested'});const item={id:crypto.randomUUID(),title:clean(b.title,120)||'Untitled draft',type:clean(b.type,50),risk:clean(b.risk,20),status:b.status,reviewer:clean(b.reviewer,80)||'Reviewer',findings:Array.isArray(b.findings)?b.findings.slice(0,100):[],createdAt:stamp(),time:new Date().toLocaleString()};db.decisions.unshift(item);db.decisions=db.decisions.slice(0,500);save(db);db.activity.unshift({id:crypto.randomUUID(),kind:'decision',title:item.title,assignee:item.reviewer,role:'Reviewer',detail:'Decision recorded: '+item.status+' · risk '+item.risk,time:new Date().toLocaleString(),createdAt:stamp()});db.activity=db.activity.slice(0,500);save(db);return send(res,201,{item})}
  if(req.method==='DELETE'&&p==='/api/decisions'){db.decisions=[];save(db);return send(res,200,{ok:true})}
  if(req.method==='GET'&&p==='/api/activity')return send(res,200,{items:db.activity});
  if(req.method==='POST'&&p==='/api/activity'){const b=await body(req);if(!['assignment','comment'].includes(b.kind))return send(res,400,{error:'Activity kind must be assignment or comment'});if(b.kind==='comment'&&!clean(b.detail,2000).trim())return send(res,400,{error:'Comment text is required'});const item={id:crypto.randomUUID(),kind:b.kind,title:clean(b.title,120)||'Untitled draft',assignee:clean(b.assignee,80),author:clean(b.author,80),role:clean(b.role,60),detail:clean(b.detail,2000),time:new Date().toLocaleString(),createdAt:stamp()};db.activity.unshift(item);db.activity=db.activity.slice(0,500);save(db);return send(res,201,{item})}
  if(req.method==='GET'&&p.startsWith('/api/'))return send(res,404,{error:'API route not found'});
  let target=decodeURIComponent(p==='/'?'/index.html':p);target=path.normalize(target).replace(/^([.][.][/\\])+/, '');const file=path.join(ROOT,target);if(!file.startsWith(ROOT+path.sep))return send(res,403,{error:'Forbidden'});if(!fs.existsSync(file)||!fs.statSync(file).isFile())return send(res,404,{error:'Not found'});res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':path.basename(file)==='index.html'?'no-cache':'public, max-age=3600'});fs.createReadStream(file).pipe(res);
 }catch(e){if(!res.headersSent)send(res,400,{error:e.message||'Request failed'})}
});
server.listen(PORT,'0.0.0.0',()=>console.log(`BrandGuard AI working demo running on http://localhost:${PORT}`));
