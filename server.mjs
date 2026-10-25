import { SOURCE,normalize,kml } from './core.mjs';
export default {async fetch(request,env){
 const url=new URL(request.url);const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 async function read(){const item=env.BUCKET&&await env.BUCKET.get('stations.json');return item?await item.json():SEED;}
 try{
 if(url.pathname==='/api/stations')return json(await read());
 if(url.pathname==='/api/refresh'){
  if(request.method!=='POST')return json({error:'POST required'},405);
  if(request.headers.get('origin')&&request.headers.get('origin')!==url.origin)return json({error:'Origin mismatch'},403);
  if(!env.BUCKET)return json({error:'Persistent storage is not connected'},503);
  const previous=await read();if(previous.persisted&&Date.now()-Date.parse(previous.fetchedAt)<15*60e3)return json({...previous,refreshNote:'Recently refreshed; using the saved dataset.'});
  const p=new URLSearchParams({where:"fuel_type_code='ELEC' AND state='NE' AND latitude>41.17 AND latitude<41.31 AND longitude>-96.22 AND longitude<-95.91",outFields:'id,station_name,street_address,city,latitude,longitude,ev_dc_fast_num,ev_level2_evse_num,ev_connector_types,ev_network,ev_network_web,access_code,access_detail_code,restricted_access,access_days_time,status_code,facility_type,station_phone,ev_pricing,date_last_confirmed,updated_at',returnGeometry:'false',f:'json'});
  const response=await fetch(SOURCE+'/query?'+p,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw new Error('Source HTTP '+response.status);
  const stations=normalize(await response.json());if(stations.length<5)throw new Error('Unexpectedly small dataset; previous snapshot retained');
  const next={stations,fetchedAt:new Date().toISOString(),persisted:true,source:SOURCE};await env.BUCKET.put('stations.json',JSON.stringify(next));return json(next);
 }
 if(url.pathname==='/api/export.kml'){const data=await read();return new Response(kml(data.stations.filter(s=>s.access==='public'&&s.status==='E'),data.fetchedAt),{headers:{'Content-Type':'application/vnd.google-earth.kml+xml','Content-Disposition':'attachment; filename="omaha-chargers.kml"'}});}
 if(url.pathname==='/health')return json({ok:true,storage:!!env.BUCKET});
 if(url.pathname==='/')return new Response(HTML,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});
 return new Response('Not found',{status:404});
 }catch(e){return json({error:'Refresh unavailable. Your last saved stations are retained.',detail:String(e.message)},502);}
}};
