import {createClient} from "npm:@supabase/supabase-js@2";
const ORIGIN="https://evandrojaconi.github.io";
const head={"Content-Type":"application/json","Access-Control-Allow-Origin":ORIGIN,
  "Access-Control-Allow-Headers":"authorization,apikey,content-type,x-client-info",
  "Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin"};
const reply=(x:unknown,status=200)=>new Response(JSON.stringify(x),{status,headers:head});
const WEBSITE_ID="acafa0de-17ce-402b-a249-876ca5722659";
const BASE_URL="https://analytics.arestaclimb.com";
Deno.serve(async req=>{
 if(req.headers.get("Origin")&&req.headers.get("Origin")!==ORIGIN)return reply({error:"Origem não autorizada"},403);
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:head});
 if(req.method!=="POST")return reply({error:"Método inválido"},405);
 const jwt=(req.headers.get("Authorization")||"").replace(/^Bearer\s+/,"");
 if(!jwt)return reply({error:"Autenticação obrigatória"},401);
 const key=Deno.env.get("SUPABASE_ANON_KEY")||Deno.env.get("SUPABASE_PUBLISHABLE_KEY")||"";
 const url=Deno.env.get("SUPABASE_URL")||"";
 if(!key||!url)return reply({status:"unavailable",message:"Backend ainda sem configuração de autenticação"},503);
 try{
  const input=await req.json();
  const workspace=String(input.workspace_id||"");
  const period=String(input.period||"7d");
  if(!/^[0-9a-f-]{36}$/i.test(workspace)||!["7d","30d"].includes(period))return reply({error:"Parâmetros inválidos"},400);
  const client=createClient(url,key,{global:{headers:{Authorization:"Bearer "+jwt}},
    auth:{persistSession:false,autoRefreshToken:false}});
  const user=await client.auth.getUser(jwt);
  if(user.error||!user.data.user)return reply({error:"Sessão inválida"},401);
  const member=await client.from("crm_memberships").select("role")
    .eq("workspace_id",workspace).eq("user_id",user.data.user.id).maybeSingle();
  if(member.error||!member.data||!["admin","editor"].includes(member.data.role))return reply({error:"Sem permissão de leitura/importação"},403);
  const source=await client.from("crm_metric_sources").select("id").eq("workspace_id",workspace)
    .eq("provider","Umami").eq("source_ref",WEBSITE_ID).maybeSingle();
  if(source.error||!source.data)return reply({error:"Fonte não cadastrada neste workspace"},404);
  const umamiKey=Deno.env.get("UMAMI_API_KEY");
  if(!umamiKey)return reply({status:"needs_key",message:"Configure UMAMI_API_KEY em Supabase → Edge Functions → Secrets. Nunca no navegador."});
  const endAt=Date.now(), startAt=endAt-(period==="30d"?30:7)*86400000;
  const target=BASE_URL+"/api/websites/"+WEBSITE_ID+"/stats?startAt="+startAt+"&endAt="+endAt;
  const res=await fetch(target,{headers:{Authorization:"Bearer "+umamiKey,Accept:"application/json"},signal:AbortSignal.timeout(13000)});
  if(!res.ok)return reply({status:"source_error",message:"Umami não autorizou a consulta (HTTP "+res.status+"). Confira API key e permissões."},200);
  const stats=await res.json();
  const rows=[
    ["Visualizações de página",stats.pageviews],
    ["Visitantes",stats.visitors],
    ["Visitas",stats.visits],
    ["Rejeições",stats.bounces]
  ].map(([name,value])=>{
    const raw=typeof value==="object"&&value!==null?value.value:value;
    return {metric_name:String(name),metric_value:Number(raw)};
  }).filter(x=>Number.isFinite(x.metric_value)&&x.metric_value>=0);
  if(!rows.length)return reply({status:"source_error",message:"O Umami respondeu sem métricas numéricas reconhecíveis. Nenhum dado foi gravado."});
  const values=rows.map(x=>({...x,workspace_id:workspace,source_id:source.data.id,
    metric_unit:"contagem",period_label:period+" · "+new Date(startAt).toISOString().slice(0,10)+"/"+new Date(endAt).toISOString().slice(0,10),
    observed_at:new Date().toISOString(),provenance:"api",source_note:"Umami API v3, janela móvel; métricas de site, não visitas físicas a picos.",
    created_by:user.data.user.id}));
  const inserted=await client.from("crm_metric_snapshots").insert(values);
  if(inserted.error)return reply({status:"source_error",message:"Falha ao registrar leitura: "+inserted.error.message});
  await client.from("crm_metric_sources").update({connection_status:"connected",last_fetched_at:new Date().toISOString(),last_error:null})
    .eq("id",source.data.id).eq("workspace_id",workspace);
  return reply({status:"ok",recorded:values.length,period,read_at:new Date().toISOString()});
 }catch(_e){return reply({status:"source_error",message:"Falha temporária na consulta. A fonte mantém o último estado conhecido."});}
});
