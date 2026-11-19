(()=>{
'use strict';
const D=window.PARAMO_DATA;
const C={navy:'#173f72',teal:'#168b87',green:'#76a82f',gold:'#e3a62f',magenta:'#c43e7d',red:'#b74343',grey:'#8a97a8',light:'#cfd7e2',REF:'#7d8da3',BRIDGE:'#76a82f',NZT:'#c43e7d',BAU:'#47698f',REN100:'#168b87',ZNO:'#F2C94C',ZNX:'#8E44AD',ZSO:'#27AE60',ZSX:'#2D9CDB'};
const CASES={
  ecuador_24bus:{scenarios:['REF','BRIDGE','NZT'],hydrology:['Baseline','Adverse'],stats:['Mean','P10','P50','P90','Representative']},
  ecuador_6bus:{scenarios:['BAU','REN100'],hydrology:['Normal','Extreme'],stats:['Deterministic']}
};
const TECH_LABELS={HYDRO:'Hydro',GEOTHERMAL:'Geothermal',BIOENERGY:'Bioenergy',WIND:'Wind',PV:'Solar PV',GAS:'Natural gas',DIESEL:'Diesel','FUEL OIL':'Fuel oil',NUCLEAR:'Nuclear',IMPORTS:'Imports','FOSSIL THERMAL':'Fossil thermal'};
const TECH_COLORS={HYDRO:'#1f77b4',GEOTHERMAL:'#8c564b',BIOENERGY:'#76a82f',WIND:'#17a2b8',PV:'#e3a62f',GAS:'#7a6b92',DIESEL:'#6c757d','FUEL OIL':'#4d4d4d',NUCLEAR:'#9467bd',IMPORTS:'#9aa8ba','FOSSIL THERMAL':'#5c6370'};
const chartExports={};
const state={tab:'overview',caseId:'ecuador_24bus',scenario:'BRIDGE',hydrology:'Baseline',stat:'Mean',year:2050,month:1,showLines:true,showReferenceLines:true,showNodes:true,showPlants:false,showExternal:true,sixFuelView:'fuel',hydroAsset:'system',corridor:'all'};
const el=id=>document.getElementById(id);
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
const by=(a,p)=>a.filter(p); const one=(a,p)=>a.find(p)||{};
const fmt=(v,d=1)=>Number.isFinite(Number(v))?Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}):'—';
const fmt0=v=>Number.isFinite(Number(v))?Math.round(Number(v)).toLocaleString('en-US'):'—';
const pct=(v,d=1)=>`${fmt(100*n(v),d)}%`;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const is24=()=>state.caseId==='ecuador_24bus';
const sixCase=()=>`${state.scenario}_${state.hydrology}`;
const s24=(h=state.hydrology,s=state.scenario)=>one(D.national.summary,r=>r.Hydrology===h&&r.Scenario===s);
const s6=(s=state.scenario,h=state.hydrology)=>one(D.sixNode.summary,r=>r.Case===`${s}_${h}`);
const statPrefix=st=>st==='Representative'?'Rep':st;
const metric24=(row,base,st=state.stat)=>n(row[`${statPrefix(st)}${base}`]);
const colorScenario=s=>C[s]||C.teal;
const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const RN=window.PARAMO_REFERENCE_NETWORK||{features:[]};
const citation='Guaman, W., & Benalcazar, P. (2026). PARAMO Ecuador Results Explorer: Planning And Resource Allocation under Multi-scenario Optimization (Version 1.0.0) [Software and public research results]. GitHub. https://github.com/WilianGuaman/PARAMO-Ecuador.';
const CHART_UNITS={overviewTradeoff:'Cost [MUSD] · CO₂ [Mt] · ENS [GWh]',overviewBars:'Relative indicator [%]',capacityTrajectory:'Operating capacity [MW]',capacityAdditions:'New capacity [MW/year]',generationAnnual:'Electricity generation [GWh/year]',generationMixYear:'Electricity generation [GWh]',transmissionCost:'Transmission investment [MUSD/year]',networkSecondary:'New circuits in service [count]',transmissionDecisionTimeline:'Investment year [year]',reservoirEnvelope:'Reservoir storage [hm³]',reservoirYear:'Water volume [hm³/month] · storage [hm³]',hydroSeasonality:'Hydro generation [GWh/month] · AF [%]',hydroWaterBalance:'Generation [GWh/month] · release [hm³/month]',hydroCascadeFlow:'Water transfer [hm³/month]',hydrologyPenalty:'Cost premium [MUSD]',monthlyGeneration:'Electricity [GWh/month]',operationReliability:'Reserve [MW] · energy [GWh/month]',annualOperation:'Electricity [GWh/year] · capacity [MW]',emissionCumulative:'CO₂ [MtCO₂]',emissionAnnual:'CO₂ [ktCO₂/year]',emissionDistribution:'CO₂ [MtCO₂ or ktCO₂]',emissionTradeoff:'Cost [MUSD] · CO₂ [MtCO₂]',ensCumulative:'ENS [GWh]',ensAnnual:'ENS [GWh/year]',ensDistribution:'ENS [GWh]',ensTradeoff:'Cost [MUSD] · ENS [GWh]',costDistribution:'Cost [MUSD]',costComponents:'Cost [MUSD]',performanceSpace:'Cost [MUSD] · CO₂ [MtCO₂]',compareChart:'Normalized indicator [p.u.]'};
const AXIS_SPECS={
 overviewTradeoff:{x:'Total system cost [MUSD]',y:'Cumulative CO₂ [Mt]'},overviewBars:{x:'Scenario and hydrology configuration',y:'Relative indicator [%]'},
 capacityTrajectory:{x:'Planning year [year]',y:'Operating capacity [MW]'},capacityAdditions:{x:'Planning year [year]',y:'New capacity [MW/year]'},generationAnnual:{x:'Planning year [year]',y:'Electricity generation [GWh/year]'},
 transmissionCost:{x:'Planning year / scenario [–]',y:'Transmission investment [MUSD/year]'},networkSecondary:{x:'Planning year / corridor [–]',y:'New circuits in service [count]'},transmissionDecisionTimeline:{x:'Investment year [year]',y:'Planning corridor'},
 reservoirEnvelope:{x:'Calendar month [month]',y:'Reservoir storage [hm³]'},reservoirYear:{x:'Calendar month [month]',y:'Monthly water volume [hm³/month]',y2:'End-of-month storage [hm³]'},hydroSeasonality:{x:'Calendar month [month]',y:'Hydro availability / generation'},hydroWaterBalance:{x:'Calendar month [month]',y:'Hydro generation [GWh/month]',y2:'Hydraulic release [hm³/month]'},
 hydrologyPenalty:{x:'Policy pathway [–]',y:'Hydrological-stress cost premium [MUSD]'},monthlyGeneration:{x:'Calendar month [month]',y:'Electricity [GWh/month]'},operationReliability:{x:'Calendar month [month]',y:'Operating reserve [MW]',y2:'ENS / curtailment [GWh/month]'},annualOperation:{x:'Planning year [year]',y:'Annual electricity [GWh/year]',y2:'Peak capacity [MW]'},
 emissionCumulative:{x:'Scenario and hydrology configuration [–]',y:'Cumulative CO₂ emissions [MtCO₂]'},emissionAnnual:{x:'Planning year [year]',y:'Annual CO₂ emissions [ktCO₂/year]'},emissionDistribution:{x:'Scenario and hydrology configuration [–]',y:'Cumulative CO₂ [MtCO₂ or ktCO₂]'},emissionTradeoff:{x:'Total system cost [MUSD]',y:'Cumulative CO₂ [Mt]'},
 ensCumulative:{x:'Scenario and hydrology configuration [–]',y:'Cumulative ENS [GWh]'},ensAnnual:{x:'Planning year [year]',y:'Annual ENS [GWh/year]'},ensDistribution:{x:'Scenario and hydrology configuration [–]',y:'Cumulative ENS [GWh]'},ensTradeoff:{x:'Total system cost [MUSD]',y:'Cumulative ENS [GWh]'},
 costDistribution:{x:'Scenario and hydrology configuration [–]',y:'Total cost [MUSD]'},costComponents:{x:'Scenario or case [–]',y:'Discounted cost [MUSD]'},performanceSpace:{x:'Total system cost [MUSD]',y:'Cumulative CO₂ [Mt]'},compareChart:{x:'Performance metric [–]',y:'Normalized indicator [p.u.]'}
};

function kpi(label,value,sub,cls=''){return `<div class="kpi-card ${cls}"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div></div>`}
function tableHtml(headers,rows){return `<table class="data-table"><thead><tr>${headers.map(h=>`<th${h.num?' class="num"':''}>${h.label}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr${r.selected?' class="selected-row"':''}>${headers.map(h=>`<td${h.num?' class="num"':''}>${r[h.key]??''}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function setChartUnit(id,label){const plotEl=el(id);if(!plotEl)return;const head=plotEl.closest('.chart-card')?.querySelector('.chart-head');if(!head)return;let badge=head.querySelector('.chart-unit');if(!badge){badge=document.createElement('span');badge.className='chart-unit';const tools=head.querySelector('.chart-tools');head.insertBefore(badge,tools||null)}badge.textContent=label||CHART_UNITS[id]||'See axis titles'}
function axisTitle(axis,title){const out=Object.assign({},axis||{});if(!out.title&&title)out.title={text:title,standoff:12};else if(typeof out.title==='string')out.title={text:out.title,standoff:12};else if(out.title&&typeof out.title==='object'&&!out.title.text&&title)out.title=Object.assign({text:title,standoff:12},out.title);else if(out.title&&typeof out.title==='object'&&!('standoff' in out.title))out.title=Object.assign({standoff:12},out.title);return out}
function plot(id,traces,layout={},rows=[],filename=id,unit=null){
  traces=applySeason(traces);
  const spec=AXIS_SPECS[id]||{},hasY2=traces.some(t=>t.yaxis==='y2')||Boolean(layout.yaxis2)||Boolean(spec.y2),baseMargin={l:82,r:hasY2?78:34,t:30,b:76};
  const merged=Object.assign({paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'#fff',font:{family:'Inter, Segoe UI, Arial, sans-serif',size:11,color:'#46536a'},legend:{orientation:'h',y:1.15,x:0},hovermode:'closest'},layout);
  merged.margin=Object.assign({},baseMargin,layout.margin||{});
  merged.xaxis=axisTitle(Object.assign({gridcolor:'#e7ebf0',zeroline:false,automargin:true},layout.xaxis||{}),spec.x||'Category / period [–]');
  merged.yaxis=axisTitle(Object.assign({gridcolor:'#e7ebf0',zeroline:false,automargin:true},layout.yaxis||{}),spec.y||CHART_UNITS[id]||'Value [–]');
  if(hasY2)merged.yaxis2=axisTitle(Object.assign({overlaying:'y',side:'right',showgrid:false,automargin:true},layout.yaxis2||{}),spec.y2||'Secondary value [–]');
  Plotly.react(id,traces,merged,{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});
  setChartUnit(id,unit||CHART_UNITS[id]);chartExports[id]={rows,filename};
}
function downloadChartCSV(id){
 const ex=chartExports[id];if(!ex?.rows?.length)return;
 const rows=ex.rows,fields=[...new Set(rows.flatMap(r=>Object.keys(r)))];
 const quote=v=>{if(v===null||v===undefined)return '';let text=typeof v==='object'?JSON.stringify(v):String(v);if(typeof v==='string'&&/^[=+@\-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
 const text=[fields.map(quote).join(','),...rows.map(row=>fields.map(k=>quote(row[k])).join(','))].join('\r\n');
 const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=ex.filename+'.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function addChartTools(){document.querySelectorAll('[data-tools]').forEach(box=>{
 const id=box.dataset.tools;box.innerHTML='<button type="button" data-format="png">PNG</button><button type="button" data-format="svg">SVG</button>'+(['network24Detail','hydro24Detail'].some(parent=>box.closest('#'+parent))&&chartExports[id]?.rows?.length?'<button type="button" data-format="csv" title="Export underlying source rows">CSV</button>':'');
 box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const ex=chartExports[id]||{filename:id};if(b.dataset.format==='csv'){downloadChartCSV(id);return;}Plotly.downloadImage(id,{format:b.dataset.format,filename:ex.filename,width:1400,height:id==='tx24Maps'?1050:850,scale:b.dataset.format==='png'?2:1});}));
})}


function summaryMetrics(caseId=state.caseId,scenario=state.scenario,hydro=state.hydrology,stat=null){
  if(caseId==='ecuador_24bus'){
    const r=one(D.national.summary,x=>x.Hydrology===hydro&&x.Scenario===scenario), st=stat||(caseId===state.caseId?state.stat:'Mean'), p=statPrefix(st);
    return {caseId,scenario,hydro,stat:st,cost:n(r[`${p}TotalCost_MUSD`]),co2:n(r[`${p}CO2_kt`])/1000,ens:n(r[`${p}ENS_GWh`]),capacity:n(r[`${p}InstalledCapacity2050_MW`]),capex:n(r[`${p}CAPEX_MUSD`]),opex:n(r[`${p}OPEX_MUSD`]),trans:n(r[`${p}TransmissionCost_MUSD`]),imports:n(r[`${p}Imports_GWh`]),renew:null};
  }
  const r=one(D.sixNode.summary,x=>x.Case===`${scenario}_${hydro}`);
  return {caseId,scenario,hydro,stat:'Deterministic',cost:n(r.TotalCost_MUSD),co2:n(r.CumEmissions_Mt),ens:n(r.CumENS_GWh),capacity:n(r.NewGen_MW),capex:n(r.InvestmentCost_MUSD),opex:n(r.OperatingCost_MUSD),trans:null,imports:n(r.CumImports_GWh),renew:n(r.RenShareFinalYear)};
}
function allConfigMetrics(caseId=state.caseId){
  const c=CASES[caseId],out=[];
  for(const h of c.hydrology)for(const s of c.scenarios)out.push(summaryMetrics(caseId,s,h,caseId==='ecuador_24bus'?'Mean':'Deterministic'));
  return out;
}

function initYearOptions(){el('yearSelect').value=state.year;}
function syncSelectors(){
  const c=CASES[state.caseId];
  if(!c.scenarios.includes(state.scenario)) state.scenario=is24()?'BRIDGE':'BAU';
  if(!c.hydrology.includes(state.hydrology)) state.hydrology=c.hydrology[0];
  el('scenarioSelect').innerHTML=c.scenarios.map(s=>`<option value="${s}">${s}${s==='REF'?' · Reference':s==='BRIDGE'?' · Transition':s==='NZT'?' · Net-zero':s==='BAU'?' · Business as usual':' · 100% renewable'}</option>`).join('');
  el('hydrologySelect').innerHTML=c.hydrology.map(h=>`<option value="${h}">${h}${is24()?(h==='Baseline'?' · W100':' · W5'):''}</option>`).join('');
  el('scenarioSelect').value=state.scenario;el('hydrologySelect').value=state.hydrology;el('statWrap').hidden=!is24();el('statSelect').value=state.stat;el('yearSelect').value=state.year;el('yearValue').textContent=state.year;el('monthSelect').value=state.month;el('monthValue').textContent=monthNames[state.month-1];el('caseSelect').value=state.caseId;el('fuelViewWrap').hidden=is24();el('fuelViewSelect').value=state.sixFuelView;
  el('corridorWrap').hidden=is24();el('hydroAssetWrap').hidden=is24();
  [['mapLines','showLines'],['mapReferenceLines','showReferenceLines'],['mapNodes','showNodes'],['mapPlants','showPlants'],['mapExternal','showExternal']].forEach(([id,k])=>el(id).checked=state[k]);
  if(!is24()) syncSixControls();
  el('ensembleNote').innerHTML=is24()?`<strong>${state.hydrology}</strong>: ${D.meta.nationalEnsembles[state.hydrology]} realizations · representative run ${s24().Representative_w||'—'}.`:`<strong>${sixCase().replace('_',' · ')}</strong> · deterministic W=1.`;
  el('caseCapabilityNote').innerHTML=is24()?'24N: ensemble uncertainty, aggregate transmission investment, national hydrology and the 24-node network.':'6N: transmission decisions, generation expansion and aggregate storage.';
  updateURL();
}
function syncSixControls(){
 const corridors=[...new Set(D.sixNode.transmission.map(r=>r.Corridor))].sort();
 el('corridorSelect').innerHTML='<option value="all">All corridors</option>'+corridors.map(c=>`<option value="${c}">${c}</option>`).join('');
 if(!corridors.includes(state.corridor))state.corridor='all';el('corridorSelect').value=state.corridor;
 el('hydroAssetWrap').hidden=false;
 const assets=D.sixNode.hydroDisplayAssets;
 el('hydroAssetSelect').innerHTML=Object.entries(assets).map(([k,a])=>`<option value="${k}">${esc(a.label)}</option>`).join('');
 if(!assets[state.hydroAsset])state.hydroAsset='paute';el('hydroAssetSelect').value=state.hydroAsset;
}

function updateURL(){const q=new URLSearchParams({case:state.caseId,scenario:state.scenario,hydrology:state.hydrology,stat:state.stat,year:String(state.year),month:String(state.month),view:state.tab,wet:el('wetCheck').checked?'1':'0',dry:el('dryCheck').checked?'1':'0',txLayer:el('tx24Layer').value,fuel:state.sixFuelView,hydroAsset:state.hydroAsset,corridor:state.corridor,hydroView:detailState.hydroView,corridor24:detailState.corridor});history.replaceState(null,'',`${location.pathname}?${q}`)}
function parseURL(){const q=new URLSearchParams(location.search),cid=q.get('case');if(cid&&CASES[cid])state.caseId=cid;const c=CASES[state.caseId],sv=q.get('scenario'),h=q.get('hydrology');state.scenario=c.scenarios.includes(sv)?sv:(state.caseId==='ecuador_24bus'?'BRIDGE':'BAU');state.hydrology=c.hydrology.includes(h)?h:c.hydrology[0];const st=q.get('stat');if(c.stats.includes(st))state.stat=st;const y=Number(q.get('year'));if(y>=2025&&y<=2050)state.year=y;const m=Number(q.get('month'));if(m>=1&&m<=12)state.month=m;const v=q.get('view');if(v&&el(v))state.tab=v;const fv=q.get('fuel');if(fv==='fuel'||fv==='technology')state.sixFuelView=fv;state.hydroAsset=q.get('hydroAsset')||'system';state.corridor=q.get('corridor')||'all'}
function renderOverview(){
  const m=summaryMetrics(); let renew='—',capLabel=is24()?'Installed capacity 2050':'New generation capacity',capSub=is24()?`${state.stat} · 2050`:'Built over 2025–2050';
  if(is24()){
    const ann=one(D.national.annualRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&n(r.Year)===2050),ren=n(ann.HYDRO_GWh)+n(ann.WIND_GWh)+n(ann.PV_GWh)+n(ann.GEOTHERMAL_GWh)+n(ann.BIOENERGY_GWh),tot=n(ann.GenerationTotal_GWh);renew=tot?`${fmt(100*ren/tot,1)}%`:'—';
  } else renew=pct(s6().RenShareFinalYear);
  el('overviewKpis').innerHTML=[kpi('Total system cost',`${fmt(m.cost,1)} MUSD`,m.stat,'navy'),kpi('Cumulative CO₂',`${fmt(m.co2,2)} Mt`,is24()?m.stat:'2025–2050','magenta'),kpi('Energy not served',`${fmt(m.ens,2)} GWh`,'Cumulative ENS','red'),kpi(capLabel,`${fmt0(m.capacity)} MW`,capSub,'green'),kpi('Renewable share',renew,'Final year','gold')].join('');
  el('overviewInsight').innerHTML=is24()?`<strong>${state.scenario} · ${state.hydrology}</strong>: total cost ${fmt(m.cost,1)} MUSD · cumulative CO₂ ${fmt(m.co2,2)} Mt · ENS ${fmt(m.ens,2)} GWh.`:`<strong>${sixCase().replace('_',' · ')}</strong>: total cost ${fmt(m.cost,1)} MUSD · cumulative CO₂ ${fmt(m.co2,2)} Mt · ENS ${fmt(m.ens,2)} GWh.`;
  const rows=allConfigMetrics();
  plot('overviewTradeoff',[{type:'scatter',mode:'markers+text',x:rows.map(r=>r.cost),y:rows.map(r=>r.co2),text:rows.map(r=>`${r.scenario}<br>${r.hydro}`),textposition:'top center',marker:{size:rows.map(r=>12+Math.min(22,Math.sqrt(Math.max(r.ens,0))*1.5)),color:rows.map(r=>colorScenario(r.scenario)),line:{color:'#fff',width:1.5}},customdata:rows.map(r=>r.ens),hovertemplate:'%{text}<br>Cost %{x:,.1f} MUSD<br>CO₂ %{y:,.2f} Mt<br>ENS %{customdata:,.2f} GWh<extra></extra>'}],{xaxis:{title:'Total system cost [MUSD]',gridcolor:'#e7ebf0'},yaxis:{title:'Cumulative CO₂ emissions [MtCO₂]',gridcolor:'#e7ebf0'}},rows,'overview_cost_co2_ens');
  const maxCost=Math.max(...rows.map(r=>r.cost)),maxCO2=Math.max(...rows.map(r=>r.co2)),maxENS=Math.max(1,...rows.map(r=>r.ens));
  const labels=rows.map(r=>`${r.scenario} · ${r.hydro}`);
  plot('overviewBars',[{type:'bar',name:'Cost',x:labels,y:rows.map(r=>100*r.cost/maxCost),marker:{color:C.navy}},{type:'bar',name:'CO₂',x:labels,y:rows.map(r=>100*r.co2/maxCO2),marker:{color:C.magenta}},{type:'bar',name:'ENS',x:labels,y:rows.map(r=>100*r.ens/maxENS),marker:{color:C.red}}],{barmode:'group',yaxis:{title:'Relative to maximum [%]',gridcolor:'#e7ebf0'},xaxis:{tickangle:-25}},rows,'overview_normalized');
  el('overviewTable').innerHTML=tableHtml([{label:'Configuration',key:'config'},{label:'Cost [MUSD]',key:'cost',num:true},{label:'CO₂ [Mt]',key:'co2',num:true},{label:'ENS [GWh]',key:'ens',num:true},{label:'Renewable final [%]',key:'ren',num:true}],rows.map(r=>({config:`${r.scenario} · ${r.hydro}`,cost:fmt(r.cost,1),co2:fmt(r.co2,2),ens:fmt(r.ens,2),ren:r.caseId==='ecuador_6bus'?fmt(100*n(one(D.sixNode.summary,x=>x.Case===`${r.scenario}_${r.hydro}`).RenShareFinalYear),1):'—',selected:r.scenario===state.scenario&&r.hydro===state.hydrology})));
}

function seriesStack(id,rows,order,valueKey,title){const traces=[];for(const t of order){const rr=rows.filter(r=>r.Tech===t);if(!rr.length)continue;traces.push({type:'scatter',mode:'lines',stackgroup:'one',name:TECH_LABELS[t]||t,x:rr.map(r=>r.Year),y:rr.map(r=>n(r[valueKey])),line:{width:0.8,color:TECH_COLORS[t]||C.grey}})}plot(id,traces,{yaxis:{title,gridcolor:'#e7ebf0'},xaxis:{title:'Planning year [year]',gridcolor:'#e7ebf0'}},rows,id)}
function renderGeneration(){
  let capRows=[],addRows=[],genRows=[],order=[];
  if(is24()){
    const st=state.stat, key=st==='Mean'?'mean_MW':st==='P10'?'p10_MW':st==='P50'?'p50_MW':st==='P90'?'p90_MW':'Capacity_MW';
    if(st==='Representative') capRows=by(D.national.capacityRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario).map(r=>({Year:n(r.Year),Tech:r.Tech,Capacity_MW:n(r.Capacity_MW)}));
    else capRows=by(D.national.capacityStats,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario).map(r=>({Year:n(r.Year),Tech:r.Tech,Capacity_MW:n(r[key])}));
    const addKey=st==='Mean'?'add_mean_MW':st==='P10'?'add_p10_MW':st==='P50'?'add_p50_MW':st==='P90'?'add_p90_MW':'add_mean_MW';
    addRows=by(D.national.capacityAddStats,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario).map(r=>({Year:n(r.Year),Tech:r.Tech,Add:n(r[addKey])}));
    genRows=by(D.national.annualRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario);order=D.meta.techOrder;
    el('capacityChartTitle').textContent='Installed capacity by technology';el('capacityAdditionsTitle').textContent='Capacity additions';el('generationAnnualTitle').textContent='Annual generation · representative realization';el('generationMixYearTitle').textContent='Selected-year technology mix';
  }else{
    const c=sixCase(),useFuel=state.sixFuelView==='fuel';
    if(useFuel){order=D.meta.fuelOrder;capRows=by(D.sixNode.capacityFuel,r=>r.Case===c).map(r=>({Year:n(r.Year),Tech:r.FuelCategory,Capacity_MW:n(r.Capacity_MW)}));addRows=by(D.sixNode.newCapacityFuel,r=>r.Case===c).map(r=>({Year:n(r.Year),Tech:r.FuelCategory,Add:n(r.NewCapacity_MW)}));const detail=by(D.sixNode.generationFuel,r=>r.Case===c);for(const y of [...new Set(detail.map(r=>n(r.Year)))]){const o={Year:y};for(const r of detail.filter(x=>n(x.Year)===y))o[`${r.FuelCategory}_GWh`]=n(r.Generation_GWh);genRows.push(o)}el('capacityChartTitle').textContent='Installed capacity by fuel / resource';el('capacityAdditionsTitle').textContent='Capacity additions by fuel / resource';el('generationAnnualTitle').textContent='Annual generation by fuel / resource';el('generationMixYearTitle').textContent='Selected-year fuel / resource mix';}
    else{order=['HYDRO','PV','WIND','GEOTHERMAL','BIOENERGY','FOSSIL THERMAL','IMPORTS'];const map={Hydro:'HYDRO',SolarPV:'PV',Wind:'WIND',Geothermal:'GEOTHERMAL',Biomass:'BIOENERGY',FossilThermal:'FOSSIL THERMAL',Imports:'IMPORTS'};for(const r of by(D.sixNode.capacity,x=>x.Case===c))for(const [k,t] of Object.entries(map))capRows.push({Year:n(r.Year),Tech:t,Capacity_MW:n(r[k])});for(const r of by(D.sixNode.newCapacity,x=>x.Case===c))for(const [k,t] of Object.entries(map))addRows.push({Year:n(r.Year),Tech:t,Add:n(r[k])});for(const r of by(D.sixNode.genMix,x=>x.Case===c)){const o={Year:n(r.Year)};for(const [k,t] of Object.entries(map))o[`${t}_GWh`]=n(r[k]);genRows.push(o)}el('capacityChartTitle').textContent='Installed capacity by technology';el('capacityAdditionsTitle').textContent='Capacity additions by technology';el('generationAnnualTitle').textContent='Annual generation by technology';el('generationMixYearTitle').textContent='Selected-year technology mix';}
  }
  const capYear=capRows.filter(r=>r.Year===state.year),addYear=addRows.filter(r=>r.Year===state.year); const totalCap=capYear.reduce((s,r)=>s+n(r.Capacity_MW),0),totalAdd=addYear.reduce((s,r)=>s+n(r.Add),0);let genYearTotal=0;if(is24()){const r=one(genRows,x=>n(x.Year)===state.year);genYearTotal=n(r.GenerationTotal_GWh)}else{const r=one(D.sixNode.annual,x=>x.Case===sixCase()&&n(x.Year)===state.year);genYearTotal=n(r.DomesticGen_GWh)+n(r.Imports_GWh)}
  el('generationKpis').innerHTML=[kpi('Operating capacity',`${fmt0(totalCap)} MW`,`${state.year}`,'navy'),kpi('New capacity',`${fmt0(totalAdd)} MW`,`${state.year}`,'green'),kpi('Annual generation',`${fmt(genYearTotal,1)} GWh`,`${state.year}`,'gold'),kpi('View',is24()?state.stat:(state.sixFuelView==='fuel'?'Fuel detail':'Technology'),'Reporting layer','magenta')].join('');
  seriesStack('capacityTrajectory',capRows,order,'Capacity_MW','Operating capacity [MW]');
  const addTraces=order.map(t=>{const rr=addRows.filter(r=>r.Tech===t);return rr.length?{type:'bar',name:TECH_LABELS[t]||t,x:rr.map(r=>r.Year),y:rr.map(r=>n(r.Add)),marker:{color:TECH_COLORS[t]||C.grey}}:null}).filter(Boolean);plot('capacityAdditions',addTraces,{barmode:'stack',yaxis:{title:'New capacity [MW]',gridcolor:'#e7ebf0'},xaxis:{title:'Planning year [year]'}},addRows,'capacity_additions');
  const genTraces=[];for(const t of order){const key=`${t}_GWh`;if(is24()){const rr=genRows;if(rr.some(r=>key in r))genTraces.push({type:'scatter',mode:'lines',stackgroup:'one',name:TECH_LABELS[t]||t,x:rr.map(r=>n(r.Year)),y:rr.map(r=>n(r[key])),line:{width:.8,color:TECH_COLORS[t]||C.grey}})}else{if(genRows.some(r=>key in r))genTraces.push({type:'scatter',mode:'lines',stackgroup:'one',name:TECH_LABELS[t]||t,x:genRows.map(r=>r.Year),y:genRows.map(r=>n(r[key])),line:{width:.8,color:TECH_COLORS[t]||C.grey}})}}plot('generationAnnual',genTraces,{yaxis:{title:'Annual electricity generation [GWh/year]',gridcolor:'#e7ebf0'},xaxis:{title:'Planning year [year]'}},genRows,'generation_annual');
  let mix=[];const gy=one(genRows,r=>n(r.Year)===state.year);for(const t of order){const v=n(gy[`${t}_GWh`]);if(v>0)mix.push({Tech:t,Value:v})}plot('generationMixYear',[{type:'pie',labels:mix.map(r=>TECH_LABELS[r.Tech]||r.Tech),values:mix.map(r=>r.Value),hole:.45,marker:{colors:mix.map(r=>TECH_COLORS[r.Tech]||C.grey)},textinfo:'label+percent'}],{margin:{l:20,r:20,t:20,b:20},legend:{orientation:'h',y:-.05}},mix,'generation_mix_year');
}

function decisionColor(stateLabel){if(stateLabel==='Existing corridor reinforced')return '#2f78b7';if(stateLabel==='New standard circuit(s)')return '#4a9b5e';if(stateLabel==='New reinforced circuit(s)')return '#d08b24';if(stateLabel==='Reinforced existing + new circuit(s)')return '#b04c82';return '#8795a5'}
function decisionBadge(status){const cls=status==='Base configuration'?'decision-none':status==='Existing corridor reinforced'?'decision-reinforced-existing':status==='New standard circuit(s)'?'decision-new-standard':status==='New reinforced circuit(s)'?'decision-new-reinforced':'decision-combined';return `<span class="decision-badge ${cls}">${esc(status)}</span>`}
function renderNetwork(){
  el('transmissionDecisionCard').hidden=false;
  const c=sixCase(),all=by(D.sixNode.transmission,r=>r.Case===c),yr=all.filter(r=>n(r.Year)===state.year),filtered=state.corridor==='all'?yr:yr.filter(r=>r.Corridor===state.corridor);
  el('networkStatus').textContent='Corridor-level investment result';el('networkStatus').className='status-badge';
  el('networkNote').innerHTML='The existing 230/500 kV grid is geographic context; the seven reduced corridors are PARAMO planning transfer paths. <strong>Cumulative configuration</strong> describes the corridor state by the selected year, while <strong>action in selected year</strong> identifies the investment executed in that year.';
  const added=filtered.reduce((sum,r)=>sum+n(r.AddedCapacity_MW),0),maxUtil=Math.max(0,...filtered.map(r=>n(r.Utilization))),reinforced=filtered.filter(r=>r.CumulativeState==='Existing corridor reinforced'||r.CumulativeState==='Reinforced existing + new circuit(s)').length,newCircuits=filtered.filter(r=>n(r.CumulativeNewCircuits)>0).length;
  el('networkKpis').innerHTML=[kpi('Added transfer capacity',`${fmt(added,1)} MW`,`${state.year}`,'green'),kpi('Existing corridors reinforced',fmt0(reinforced),'Selected-year state','navy'),kpi('Corridors with new circuits',fmt0(newCircuits),'Selected-year state','gold'),kpi('Maximum utilization',`${fmt(100*maxUtil,1)}%`,`${state.year}`,'red')].join('');
  const annualCapex=[];for(const y of [...new Set(all.map(r=>n(r.Year)))])annualCapex.push({Year:y,Capex:all.filter(r=>n(r.Year)===y).reduce((sum,r)=>sum+n(r.Capex_MUSD),0)});
  plot('transmissionCost',[{type:'bar',x:annualCapex.map(r=>r.Year),y:annualCapex.map(r=>r.Capex),marker:{color:C.navy},hovertemplate:'%{x}<br>%{y:,.2f} MUSD<extra></extra>'}],{xaxis:{title:'Planning year [year]'},yaxis:{title:'Transmission investment [MUSD/year]'}},annualCapex,'transmission_investment','Investment [MUSD/year]');
  let sec;if(state.corridor==='all'){sec=yr;plot('networkSecondary',[{type:'bar',name:'Available capacity',x:sec.map(r=>r.Corridor),y:sec.map(r=>n(r.AvailableCapacity_MW)),marker:{color:sec.map(r=>decisionColor(r.CumulativeState)),line:{color:'#fff',width:.7}},customdata:sec.map(r=>r.CumulativeState),hovertemplate:'%{x}<br>%{customdata}<br>Available %{y:,.1f} MW<extra></extra>'}],{barmode:'stack',xaxis:{title:'Planning corridor [–]',tickangle:-25},yaxis:{title:'Available transfer capacity [MW]'}},sec,'corridor_capacity','Transfer capacity [MW]');el('networkSecondaryTitle').textContent=`Available capacity and configuration · ${state.year}`}else{sec=all.filter(r=>r.Corridor===state.corridor);const events=sec.filter(r=>r.AnnualAction!=='No investment in selected year');plot('networkSecondary',[{type:'scatter',mode:'lines+markers',name:'Available capacity',x:sec.map(r=>r.Year),y:sec.map(r=>n(r.AvailableCapacity_MW)),line:{color:C.teal,width:3}},{type:'scatter',mode:'lines',name:'Peak flow',x:sec.map(r=>r.Year),y:sec.map(r=>n(r.PeakAbsFlow_MW)),line:{color:C.magenta,width:2,dash:'dot'}},{type:'scatter',mode:'markers',name:'Investment action',x:events.map(r=>r.Year),y:events.map(r=>n(r.AvailableCapacity_MW)),marker:{size:12,color:events.map(r=>decisionColor(r.CumulativeState)),symbol:'diamond',line:{color:'#fff',width:1}},text:events.map(r=>r.AnnualAction),hovertemplate:'%{x}<br>%{text}<br>Capacity %{y:,.1f} MW<extra></extra>'}],{xaxis:{title:'Planning year [year]'},yaxis:{title:'Capacity / peak flow [MW]'}},sec,'corridor_trajectory','Capacity / flow [MW]');el('networkSecondaryTitle').textContent=`${state.corridor} · capacity, flow and investment timing`}
  const allEvents=all.filter(r=>r.AnnualAction!=='No investment in selected year'&&(state.corridor==='all'||r.Corridor===state.corridor));
  const actionClass=r=>r.AnnualAction.includes('Reinforce existing')&&r.AnnualAction.includes('Add')?'Combined':r.AnnualAction.includes('Reinforce existing')?'Reinforcement':r.AnnualAction.includes('reinforced circuit')?'New reinforced circuit':'New standard circuit';
  const actionColor=r=>actionClass(r)==='Reinforcement'?'#2f78b7':actionClass(r)==='New standard circuit'?'#4a9b5e':actionClass(r)==='New reinforced circuit'?'#d08b24':'#b04c82';
  if(allEvents.length)plot('transmissionDecisionTimeline',[{type:'scatter',mode:'markers',x:allEvents.map(r=>r.Year),y:allEvents.map(r=>r.Corridor),marker:{size:14,color:allEvents.map(actionColor),symbol:allEvents.map(r=>actionClass(r)==='Reinforcement'?'diamond':actionClass(r)==='Combined'?'star':'circle'),line:{color:'#fff',width:1.2}},customdata:allEvents.map(r=>[r.AnnualAction,n(r.AddedCapacity_MW),n(r.Capex_MUSD),r.CumulativeState]),hovertemplate:'Year %{x}<br>%{y}<br>%{customdata[0]}<br>Added capacity %{customdata[1]:,.1f} MW<br>CAPEX %{customdata[2]:,.2f} MUSD<br>%{customdata[3]}<extra></extra>'}],{xaxis:{title:'Investment year [year]',dtick:1},yaxis:{title:'Planning corridor [–]',categoryorder:'array',categoryarray:[...new Set(all.map(r=>r.Corridor))]},margin:{l:120}},allEvents,'transmission_decision_timeline','Investment year [year]');else plot('transmissionDecisionTimeline',[{type:'scatter',mode:'markers',x:[],y:[]}],{xaxis:{title:'Investment year [year]'},yaxis:{title:'Planning corridor [–]'},annotations:[{text:'No transmission investment events for the selected configuration.',xref:'paper',yref:'paper',x:.5,y:.5,showarrow:false}]},[],'transmission_decision_timeline','Investment year [year]');
  const rows=filtered.map(r=>({corr:r.Corridor,avail:fmt(r.AvailableCapacity_MW,1),added:fmt(r.AddedCapacity_MW,1),state:decisionBadge(r.CumulativeState),action:`<span class="${r.AnnualAction==='No investment in selected year'?'transmission-none':'transmission-event'}">${esc(r.AnnualAction)}</span>`,first:r.FirstInvestmentYear||'—',flow:fmt(r.PeakAbsFlow_MW,1),util:fmt(100*n(r.Utilization),1),capex:fmt(r.Capex_MUSD,2)}));
  el('networkTable').innerHTML=tableHtml([{label:'Corridor',key:'corr'},{label:`Available ${state.year} [MW]`,key:'avail',num:true},{label:'Added capacity [MW]',key:'added',num:true},{label:'Cumulative configuration',key:'state'},{label:'Action in selected year',key:'action'},{label:'First investment year',key:'first',num:true},{label:'Peak flow [MW]',key:'flow',num:true},{label:'Utilization [%]',key:'util',num:true},{label:'CAPEX in year [MUSD]',key:'capex',num:true}],rows);
}
function regimeSeason(regime,month){return D.sixNode.hydrologyCalendar?.[regime]?.[String(month)]||''}
function seasonCalendarHtml(regimes){const months=[1,2,3,4,5,6,7,8,9,10,11,12];return `<div class="season-calendar">${regimes.map(reg=>`<div class="season-row"><strong>${esc(reg)}</strong><div class="season-months">${months.map(m=>{const s=regimeSeason(reg,m)||'—';return `<span class="season-month ${s==='Wet'?'wet':s==='Dry'?'dry':''}"><b>${monthNames[m-1]}</b><small>${esc(s)}</small></span>`}).join('')}</div></div>`).join('')}</div>`}

function emptyPlot(id,message,filename,unit){plot(id,[{type:'scatter',mode:'markers',x:[],y:[]}],{xaxis:{visible:false},yaxis:{visible:false},annotations:[{text:message,xref:'paper',yref:'paper',x:.5,y:.5,showarrow:false,align:'center'}]},[],filename,unit)}



function renderHydrology(){
 document.querySelector('#hydrology .section-intro p').textContent='Monthly generation, reservoir storage and upstream–downstream connections for the selected plants.';
 const asset=D.sixNode.hydroDisplayAssets[state.hydroAsset],system=state.hydroAsset==='system';
 const ids=asset.plants,rows=D.sixNode.plantResults.filter(r=>r.Case===sixCase()&&r.Year===state.year&&(system||ids.includes(r.Generator)));
 const meta=Object.values(D.sixNode.hydroDisplayAssets).flatMap(a=>a.metadata),name=id=>meta.find(m=>m.Generator===id)?.PlantName||id;
 const plants=system?[...new Set(rows.map(r=>r.Generator))]:ids;
 const stored=plants.filter(id=>rows.some(r=>r.Generator===id&&r.Storage_Hm3!==undefined));
 const selected=rows.filter(r=>r.Month===state.month);
 el('hydroKpis').innerHTML=[kpi('Monthly generation',fmt(selected.reduce((a,r)=>a+r.Generation_GWh,0),1)+' GWh',asset.label+' · '+monthNames[state.month-1],'green'),kpi('Stored volume',stored.length?fmt(selected.reduce((a,r)=>a+(r.Storage_Hm3||0),0),1)+' hm³':'—',stored.length?'End-of-month volume':'No reservoir state for this plant','navy')].join('');
 const trace=(id,key)=>({type:'scatter',mode:'lines+markers',name:name(id),x:HM,y:HM.map(m=>rows.find(r=>r.Generator===id&&r.Month===m)?.[key]??null),connectgaps:false});
 const sr=system?D.sixNode.storage.filter(r=>r.Case===sixCase()&&r.Year===state.year).sort((a,b)=>a.Month-b.Month):rows.filter(r=>r.Storage_Hm3!==undefined);
 const st=system?[{type:'scatter',mode:'lines+markers',name:'Aggregate storage',x:sr.map(r=>r.Month),y:sr.map(r=>r.StorageHm3)}]:stored.map(id=>trace(id,'Storage_Hm3'));
 plot('reservoirEnvelope',st,{xaxis:{title:'Month',tickvals:HM,ticktext:monthNames},yaxis:{title:'End-of-month storage [hm³]',rangemode:'tozero'},annotations:st.length?[]:[{text:'This plant has no modeled reservoir storage state.',xref:'paper',yref:'paper',x:.5,y:.5,showarrow:false}]},sr,'reservoir_storage','Storage [hm³]');
 plot('plantGeneration6',plants.map(id=>({...trace(id,'Generation_GWh'),type:'bar'})),{barmode:'stack',xaxis:{title:'Month',tickvals:HM,ticktext:monthNames},yaxis:{title:'Electricity generation [GWh]',rangemode:'tozero'},legend:{orientation:'h',y:1.18},margin:{t:65}},rows.map(({Storage_Hm3,...r})=>r),'plant_generation','Generation [GWh/month]');
 el('hydroStorageTitle').textContent=asset.label+' · storage · '+state.year;
 el('plantGeneration6Title').textContent=asset.label+' · generation · '+state.year;
 el('cascadeCard6').hidden=system;
 if(!system){
 el('cascadeTitle6').textContent=asset.label+' · '+state.year+' · '+monthNames[state.month-1];
 el('cascadeDiagram6').innerHTML=ids.map((id,i)=>{const m=asset.metadata.find(x=>x.Generator===id),r=selected.find(x=>x.Generator===id);const connected=i&&asset.edges?.some(e=>e[0]===ids[i-1]&&e[1]===id);return (connected?'<div class="cascade-arrow"><span>Downstream</span><span class="shaft">→</span></div>':'')+`<div class="cascade-node ${m.Class==='Reservoir'?'reservoir':m.Status==='Candidate'?'candidate':''}"><div class="cascade-month-label">${esc(m.Status)} · ${m.Class==='Reservoir'?'Reservoir':'Run-of-river'}</div><h3>${esc(m.PlantName)}</h3><div class="metric"><span>Generation</span><strong>${fmt(r?.Generation_GWh,2)} GWh</strong></div>${r?.Storage_Hm3!==undefined?`<div class="metric"><span>Storage</span><strong>${fmt(r.Storage_Hm3,1)} hm³</strong></div>`:''}</div>`;}).join('');
 }
 renderHydraulicOutputs6(asset,rows,plants);
 el('plantResults6Table').innerHTML=tableHtml([{label:'Plant',key:'plant'},{label:'Monthly generation [GWh]',key:'gen',num:true},{label:'End-of-month storage [hm³]',key:'storage',num:true}],plants.map(id=>{const r=selected.find(x=>x.Generator===id);return {plant:name(id),gen:fmt(r?.Generation_GWh,2),storage:r?.Storage_Hm3!==undefined?fmt(r.Storage_Hm3,1):'—'};}));
}

function renderHydraulicOutputs6(asset,rows,plants){
 const meta=Object.values(D.sixNode.hydroDisplayAssets).flatMap(a=>a.metadata),name=id=>meta.find(m=>m.Generator===id)?.PlantName||id;
 const traces=plants.map(id=>({type:'bar',name:name(id),x:monthNames,y:HM.map(m=>rows.find(r=>r.Generator===id&&r.Month===m)?.Generation_GWh??null)}));
 const releases=HM.map(m=>rows.filter(r=>r.Month===m).reduce((a,r)=>a+(r.Release_Hm3||0),0));
 traces.push({type:'scatter',mode:'lines+markers',name:'Sum of plant releases',x:monthNames,y:releases,yaxis:'y2',line:{color:C.magenta,width:3}});
 plot('hydroRelease6',traces,{barmode:'stack',xaxis:{title:'Calendar month [month]'},yaxis:{title:'Monthly hydro generation [GWh/month]'},yaxis2:{title:'Sum of plant releases [hm³/month]',overlaying:'y',side:'right',showgrid:false}},rows,'generation_hydraulic_release','Generation [GWh/month] · release [hm³/month]');
 el('hydroRelease6Title').textContent=asset.label+' · monthly generation and hydraulic release';
 const scenarios=CASES.ecuador_6bus.scenarios,rr=scenarios.map(sc=>({Scenario:sc,Penalty:summaryMetrics('ecuador_6bus',sc,'Extreme').cost-summaryMetrics('ecuador_6bus',sc,'Normal').cost}));
 plot('hydrologyPenalty6',[{type:'bar',x:rr.map(r=>r.Scenario),y:rr.map(r=>r.Penalty),marker:{color:rr.map(r=>colorScenario(r.Scenario))}}],{xaxis:{title:'Policy pathway'},yaxis:{title:'Extreme-case cost premium [MUSD]'}},rr,'hydrology_cost_premium','Cost premium [MUSD]');
}

function renderOperation(){
  if(is24()){
    const ops=by(D.national.monthlyOps,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&n(r.Year)===state.year),gen=by(D.national.monthlyGen,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&n(r.Year)===state.year),annual=by(D.national.annualRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario),m=summaryMetrics();el('operationBadge').textContent='Representative run';el('operationKpis').innerHTML=[kpi('Imports',`${fmt(m.imports,1)} GWh`,'Mean cumulative','navy'),kpi('ENS',`${fmt(m.ens,2)} GWh`,state.stat,'red'),kpi('Reserve',`${fmt(ops.reduce((s,r)=>s+n(r.MW),0)/Math.max(1,ops.length),1)} MW`,`${state.year} monthly mean`,'green'),kpi('Representative run',s24().Representative_w,state.hydrology,'gold')].join('');
    const tech=[...new Set(gen.map(r=>r.Tech))];plot('monthlyGeneration',tech.map(t=>{const rr=gen.filter(r=>r.Tech===t);return {type:'bar',name:TECH_LABELS[t]||t,x:rr.map(r=>monthNames[n(r.Month)-1]),y:rr.map(r=>n(r.GWh)),marker:{color:TECH_COLORS[t]||C.grey}}}),{barmode:'stack',xaxis:{title:'Calendar month [month]'},yaxis:{title:'Monthly electricity generation [GWh/month]',gridcolor:'#e7ebf0'}},gen,'monthly_generation');plot('operationReliability',[{type:'scatter',mode:'lines+markers',name:'Reserve',x:ops.map(r=>monthNames[n(r.Month)-1]),y:ops.map(r=>n(r.MW)),line:{color:C.green}},{type:'bar',name:'ENS',x:ops.map(r=>monthNames[n(r.Month)-1]),y:ops.map(r=>n(r.ENS_GWh)),yaxis:'y2',marker:{color:C.red}}],{yaxis:{title:'Operating reserve [MW]',gridcolor:'#e7ebf0'},yaxis2:{title:'ENS [GWh/month]',overlaying:'y',side:'right'}},ops,'operation_reliability');plot('annualOperation',[{type:'scatter',mode:'lines',name:'Generation',x:annual.map(r=>n(r.Year)),y:annual.map(r=>n(r.GenerationTotal_GWh)),line:{color:C.navy,width:3}},{type:'scatter',mode:'lines',name:'CO₂',x:annual.map(r=>n(r.Year)),y:annual.map(r=>n(r.CO2_kt)),yaxis:'y2',line:{color:C.magenta,width:2}}],{yaxis:{title:'Annual electricity generation [GWh/year]',gridcolor:'#e7ebf0'},yaxis2:{title:'Annual CO₂ emissions [ktCO₂/year]',overlaying:'y',side:'right'},xaxis:{title:'Planning year [year]'}},annual,'annual_operation');
  }else{
    const c=sixCase(),mon=by(D.sixNode.monthly,r=>r.Case===c&&n(r.Year)===state.year),ann=by(D.sixNode.annual,r=>r.Case===c),sel=one(ann,r=>n(r.Year)===state.year);el('operationBadge').textContent='Deterministic W=1';el('operationKpis').innerHTML=[kpi('Demand',`${fmt(n(sel.Demand_GWh),1)} GWh`,`${state.year}`,'navy'),kpi('Imports',`${fmt(n(sel.Imports_GWh),1)} GWh`,`${state.year}`,'gold'),kpi('ENS',`${fmt(n(sel.ENS_GWh),2)} GWh`,`${state.year}`,'red'),kpi('Reserve peak',`${fmt(n(sel.ReservePeak_MW),1)} MW`,`${state.year}`,'green')].join('');plot('monthlyGeneration',[{type:'bar',name:'Domestic generation',x:mon.map(r=>monthNames[n(r.Month)-1]),y:mon.map(r=>n(r.DomesticGen_GWh)),marker:{color:C.teal}},{type:'bar',name:'Imports',x:mon.map(r=>monthNames[n(r.Month)-1]),y:mon.map(r=>n(r.Imports_GWh)),marker:{color:C.grey}}],{barmode:'stack',yaxis:{title:'Monthly electricity [GWh/month]',gridcolor:'#e7ebf0'}},mon,'monthly_energy_balance');plot('operationReliability',[{type:'scatter',mode:'lines+markers',name:'Reserve',x:mon.map(r=>monthNames[n(r.Month)-1]),y:mon.map(r=>n(r.Reserve_MW)),line:{color:C.green}},{type:'bar',name:'ENS',x:mon.map(r=>monthNames[n(r.Month)-1]),y:mon.map(r=>n(r.ENS_GWh)),yaxis:'y2',marker:{color:C.red}},{type:'bar',name:'Curtailment',x:mon.map(r=>monthNames[n(r.Month)-1]),y:mon.map(r=>n(r.Curtailment_GWh)),yaxis:'y2',marker:{color:C.gold}}],{yaxis:{title:'Operating reserve [MW]',gridcolor:'#e7ebf0'},yaxis2:{title:'ENS / curtailment [GWh/month]',overlaying:'y',side:'right'}},mon,'operation_reliability');plot('annualOperation',[{type:'scatter',mode:'lines',name:'Demand',x:ann.map(r=>r.Year),y:ann.map(r=>n(r.Demand_GWh)),line:{color:C.navy,width:3}},{type:'scatter',mode:'lines',name:'Domestic generation',x:ann.map(r=>r.Year),y:ann.map(r=>n(r.DomesticGen_GWh)),line:{color:C.teal,width:2}},{type:'scatter',mode:'lines',name:'Peak credited capacity',x:ann.map(r=>r.Year),y:ann.map(r=>n(r.PeakCreditedCapacity_MW)),yaxis:'y2',line:{color:C.gold,width:2}}],{yaxis:{title:'Annual electricity [GWh/year]',gridcolor:'#e7ebf0'},yaxis2:{title:'Peak credited capacity [MW]',overlaying:'y',side:'right',showgrid:false},xaxis:{title:'Planning year [year]'}},ann,'annual_operation','Annual electricity [GWh/year] · capacity [MW]');
  }
}

function rangeBar(rows,metric,label,id,color){
  if(is24()){
    const vals=rows.map(r=>({label:`${r.Scenario} · ${r.Hydrology}`,p10:n(r[`P10${metric}`]),p50:n(r[`P50${metric}`]),p90:n(r[`P90${metric}`])}));plot(id,[{type:'scatter',mode:'markers',x:vals.map(r=>r.label),y:vals.map(r=>r.p50),error_y:{type:'data',symmetric:false,array:vals.map(r=>r.p90-r.p50),arrayminus:vals.map(r=>r.p50-r.p10),thickness:2,width:6},marker:{size:11,color}}],{yaxis:{title:label,gridcolor:'#e7ebf0'},xaxis:{tickangle:-25}},vals,id);return;
  }
  plot(id,[{type:'bar',x:rows.map(r=>`${r.scenario} · ${r.hydro}`),y:rows.map(r=>r[metric]),marker:{color:rows.map(r=>colorScenario(r.scenario))}}],{yaxis:{title:label,gridcolor:'#e7ebf0'},xaxis:{tickangle:-25}},rows,id);
}
function renderEmissions(){const m=summaryMetrics(),all=allConfigMetrics();el('emissionKpis').innerHTML=[kpi('Cumulative CO₂',`${fmt(m.co2,2)} Mt`,'Planning horizon','magenta'),kpi('Final-year CO₂',is24()?'See annual trajectory':`${fmt(n(s6().EmissionsFinalYear_Mt),2)} Mt`,'2050','red'),kpi('Renewable final',is24()?'Representative mix':pct(n(s6().RenShareFinalYear)),'2050','green'),kpi('Hydrology',state.hydrology,'Selected case','gold')].join('');el('emissionInsight').innerHTML=`<strong>${state.scenario} · ${state.hydrology}</strong>: cumulative CO₂ is ${fmt(m.co2,2)} Mt.`;plot('emissionCumulative',[{type:'bar',x:all.map(r=>`${r.scenario} · ${r.hydro}`),y:all.map(r=>r.co2),marker:{color:all.map(r=>colorScenario(r.scenario))}}],{yaxis:{title:'Cumulative CO₂ emissions [MtCO₂]',gridcolor:'#e7ebf0'},xaxis:{tickangle:-25}},all,'emissions_cumulative');let ann;if(is24())ann=by(D.national.annualRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario).map(r=>({Year:n(r.Year),CO2_kt:n(r.CO2_kt)}));else ann=by(D.sixNode.annual,r=>r.Case===sixCase()).map(r=>({Year:n(r.Year),CO2_kt:n(r.CO2_kt)}));plot('emissionAnnual',[{type:'scatter',mode:'lines+markers',x:ann.map(r=>r.Year),y:ann.map(r=>r.CO2_kt),line:{color:C.magenta,width:3}}],{yaxis:{title:'Annual CO₂ emissions [ktCO₂/year]',gridcolor:'#e7ebf0'},xaxis:{title:'Planning year [year]'}},ann,'emissions_annual');el('emissionAnnualTitle').textContent=is24()?'Annual CO₂ trajectory · representative realization':'Annual CO₂ trajectory';if(is24())rangeBar(D.national.summary,'CO2_kt','Cumulative CO₂ [kt]','emissionDistribution',C.magenta);else rangeBar(all,'co2','Cumulative CO₂ [Mt]','emissionDistribution',C.magenta);plot('emissionTradeoff',[{type:'scatter',mode:'markers+text',x:all.map(r=>r.cost),y:all.map(r=>r.co2),text:all.map(r=>`${r.scenario}<br>${r.hydro}`),textposition:'top center',marker:{size:13,color:all.map(r=>colorScenario(r.scenario))}}],{xaxis:{title:'Cost [MUSD]',gridcolor:'#e7ebf0'},yaxis:{title:'Cumulative CO₂ emissions [MtCO₂]',gridcolor:'#e7ebf0'}},all,'cost_co2_space')}
function renderReliability(){const m=summaryMetrics(),all=allConfigMetrics();el('reliabilityKpis').innerHTML=[kpi('Cumulative ENS',`${fmt(m.ens,2)} GWh`,'Planning horizon','red'),kpi('ENS status',m.ens>0?'Positive ENS':'Zero ENS','Scenario outcome',m.ens>0?'gold':'green'),kpi('Total cost',`${fmt(m.cost,1)} MUSD`,'Planning horizon','navy'),kpi('Hydrology',state.hydrology,'Selected case','magenta')].join('');el('reliabilityInsight').innerHTML=m.ens>0?`<strong>${state.scenario} · ${state.hydrology}</strong> has ${fmt(m.ens,2)} GWh of cumulative ENS in the public result.`:`<strong>${state.scenario} · ${state.hydrology}</strong> reports zero cumulative ENS.`;plot('ensCumulative',[{type:'bar',x:all.map(r=>`${r.scenario} · ${r.hydro}`),y:all.map(r=>r.ens),marker:{color:all.map(r=>colorScenario(r.scenario))}}],{yaxis:{title:'Cumulative ENS [GWh]',gridcolor:'#e7ebf0'},xaxis:{tickangle:-25}},all,'ens_cumulative');let ann;if(is24())ann=by(D.national.annualRep,r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario).map(r=>({Year:n(r.Year),ENS_GWh:n(r.PNS_GWh)}));else ann=by(D.sixNode.annual,r=>r.Case===sixCase()).map(r=>({Year:n(r.Year),ENS_GWh:n(r.ENS_GWh)}));plot('ensAnnual',[{type:'bar',x:ann.map(r=>r.Year),y:ann.map(r=>r.ENS_GWh),marker:{color:C.red}}],{yaxis:{title:'Annual ENS [GWh/year]',gridcolor:'#e7ebf0'},xaxis:{title:'Planning year [year]'}},ann,'ens_annual');if(is24())rangeBar(D.national.summary,'ENS_GWh','Cumulative ENS [GWh]','ensDistribution',C.red);else rangeBar(all,'ens','Cumulative ENS [GWh]','ensDistribution',C.red);plot('ensTradeoff',[{type:'scatter',mode:'markers+text',x:all.map(r=>r.cost),y:all.map(r=>r.ens),text:all.map(r=>`${r.scenario}<br>${r.hydro}`),textposition:'top center',marker:{size:13,color:all.map(r=>colorScenario(r.scenario))}}],{xaxis:{title:'Cost [MUSD]',gridcolor:'#e7ebf0'},yaxis:{title:'Cumulative ENS [GWh]',gridcolor:'#e7ebf0'}},all,'cost_ens_space')}
function renderCosts(){const m=summaryMetrics(),all=allConfigMetrics();el('costKpis').innerHTML=[kpi('Total cost',`${fmt(m.cost,1)} MUSD`,m.stat,'navy'),kpi('Investment',`${fmt(m.capex,1)} MUSD`,m.stat,'green'),kpi('Operating cost',`${fmt(m.opex,1)} MUSD`,m.stat,'gold'),kpi('Hydrology',state.hydrology,'Selected case','magenta')].join('');if(is24())rangeBar(D.national.summary,'TotalCost_MUSD','Total cost [MUSD]','costDistribution',C.navy);else rangeBar(all,'cost','Total cost [MUSD]','costDistribution',C.navy);if(is24()){const rows=CASES.ecuador_24bus.scenarios.map(s=>s24(state.hydrology,s));plot('costComponents',[{type:'bar',name:'CAPEX',x:rows.map(r=>r.Scenario),y:rows.map(r=>n(r.MeanCAPEX_MUSD)),marker:{color:C.green}},{type:'bar',name:'OPEX',x:rows.map(r=>r.Scenario),y:rows.map(r=>n(r.MeanOPEX_MUSD)),marker:{color:C.navy}},{type:'bar',name:'Transmission',x:rows.map(r=>r.Scenario),y:rows.map(r=>n(r.MeanTransmissionCost_MUSD)),marker:{color:C.gold}}],{barmode:'stack',yaxis:{title:'Discounted cost [MUSD]',gridcolor:'#e7ebf0'}},rows,'cost_components')}else{const rows=D.sixNode.cost;plot('costComponents',[{type:'bar',name:'Operating',x:rows.map(r=>r.Case),y:rows.map(r=>n(r.Operating)),marker:{color:C.navy}},{type:'bar',name:'Investment',x:rows.map(r=>r.Case),y:rows.map(r=>n(r.Investment)),marker:{color:C.green}},{type:'bar',name:'Fixed O&M',x:rows.map(r=>r.Case),y:rows.map(r=>n(r.FixedOM)),marker:{color:C.gold}},{type:'bar',name:'PNS penalty',x:rows.map(r=>r.Case),y:rows.map(r=>n(r.PNSPenalty)),marker:{color:C.red}}],{barmode:'stack',yaxis:{title:'Discounted cost [MUSD]',gridcolor:'#e7ebf0'},xaxis:{tickangle:-20}},rows,'cost_components')};plot('performanceSpace',[{type:'scatter',mode:'markers+text',x:all.map(r=>r.cost),y:all.map(r=>r.co2),text:all.map(r=>`${r.scenario}<br>${r.hydro}`),textposition:'top center',marker:{size:all.map(r=>12+Math.min(22,Math.sqrt(Math.max(r.ens,0))*1.5)),color:all.map(r=>colorScenario(r.scenario))}}],{xaxis:{title:'Cost [MUSD]',gridcolor:'#e7ebf0'},yaxis:{title:'Cumulative CO₂ emissions [MtCO₂]',gridcolor:'#e7ebf0'}},all,'system_performance')}

function setupCompareLegacy(){for(const id of ['compareCaseA','compareCaseB'])el(id).innerHTML='<option value="ecuador_24bus">Ecuador 24-Bus</option><option value="ecuador_6bus">Ecuador 6-Bus</option>';el('compareCaseA').value='ecuador_24bus';el('compareCaseB').value='ecuador_6bus';function refresh(side){const cid=el(`compareCase${side}`).value,c=CASES[cid];el(`compareScenario${side}`).innerHTML=c.scenarios.map(s=>`<option>${s}</option>`).join('');el(`compareHydro${side}`).innerHTML=c.hydrology.map(h=>`<option>${h}</option>`).join('');if(side==='A'){el(`compareScenario${side}`).value='BRIDGE';el(`compareHydro${side}`).value='Baseline'}else{el(`compareScenario${side}`).value='BAU';el(`compareHydro${side}`).value='Normal'}}refresh('A');refresh('B');['A','B'].forEach(side=>['Case','Scenario','Hydro'].forEach(k=>el(`compare${k}${side}`).addEventListener('change',()=>{if(k==='Case')refresh(side);renderCompare()})))}
function renderCompareLegacy(){const read=side=>summaryMetrics(el(`compareCase${side}`).value,el(`compareScenario${side}`).value,el(`compareHydro${side}`).value,el(`compareCase${side}`).value==='ecuador_24bus'?'Mean':'Deterministic'),a=read('A'),b=read('B');const metrics=[['Total cost [MUSD]','cost'],['Cumulative CO₂ [Mt]','co2'],['Cumulative ENS [GWh]','ens'],['Capacity indicator [MW]','capacity']];el('compareTable').innerHTML=tableHtml([{label:'Metric',key:'metric'},{label:'A',key:'a',num:true},{label:'B',key:'b',num:true},{label:'B − A',key:'d',num:true}],metrics.map(([label,key])=>({metric:label,a:fmt(a[key],2),b:fmt(b[key],2),d:fmt(b[key]-a[key],2)})));plot('compareChart',[{type:'bar',name:'A',x:metrics.map(x=>x[0]),y:metrics.map(([,k])=>a[k]/Math.max(Math.abs(a[k]),Math.abs(b[k]),1)),marker:{color:C.navy}},{type:'bar',name:'B',x:metrics.map(x=>x[0]),y:metrics.map(([,k])=>b[k]/Math.max(Math.abs(a[k]),Math.abs(b[k]),1)),marker:{color:C.teal}}],{barmode:'group',yaxis:{title:'Normalized indicator [p.u.]',gridcolor:'#e7ebf0'},xaxis:{tickangle:-20}},[a,b],'scenario_comparison')}

function renderMap(){is24()?renderMap24():renderMap6()}

function mapPolygons(geometry){
  if(!geometry)return[];
  if(geometry.type==='Polygon')return [geometry.coordinates||[]];
  if(geometry.type==='MultiPolygon')return geometry.coordinates||[];
  return[];
}
function countryContextTraces(){
  const boundaries=RN.country_boundaries||[];
  const order=['Colombia','Peru','Ecuador'];
  const traces=[];
  for(const country of order){
    const ft=boundaries.find(x=>x?.properties?.name===country);if(!ft)continue;
    const isEcuador=country==='Ecuador';
    for(const polygon of mapPolygons(ft.geometry)){
      const ring=polygon?.[0]||[];if(!ring.length)continue;
      traces.push({type:'scatter',mode:'lines',name:country,
        x:ring.map(p=>n(p[0])),y:ring.map(p=>n(p[1])),fill:'toself',
        fillcolor:isEcuador?'rgba(222,232,220,.52)':'rgba(238,241,244,.30)',
        line:{color:isEcuador?'#71806f':'#aab2bc',width:isEcuador?1.8:1.0},
        hovertemplate:`${country}<extra></extra>`,showlegend:false});
    }
  }
  return traces;
}
function plotReferencePlants(tr){
  if(!state.showPlants)return;
  const pts=D.geography.plants.filter(x=>Number.isFinite(Number(x.longitude))&&Number.isFinite(Number(x.latitude)));
  tr.push({type:'scatter',mode:'markers',name:'Reference plants',x:pts.map(x=>n(x.longitude)),y:pts.map(x=>n(x.latitude)),
    customdata:pts.map(x=>`${x.plant_name}<br>${x.technology}<br>${fmt(n(x.effective_capacity_mw||x.nominal_capacity_mw),1)} MW<br>${x.province||''}`),
    hovertemplate:'%{customdata}<extra></extra>',marker:{size:pts.map(x=>4+Math.min(8,Math.sqrt(Math.max(n(x.effective_capacity_mw||x.nominal_capacity_mw),0))/2.5)),color:'#fff',line:{color:C.magenta,width:1.3},opacity:.9},showlegend:false});
}
function voltageClass(v){const x=n(v);if(Math.abs(x-500)<1)return 500;if(Math.abs(x-230)<1)return 230;if(Math.abs(x-138)<1)return 138;return null}
function physicalFeatures(){return (RN.features||[]).filter(ft=>voltageClass(ft?.properties?.voltage_kv)!==null)}
function physicalNetworkTraces(){
  if(!state.showReferenceLines)return[];
  const styles={500:{color:'#c42355',width:3.0},230:{color:'#1b4f8a',width:2.1},138:{color:'#d5a01f',width:1.25}};
  const traces=[];
  for(const kv of [138,230,500]){
    const x=[],y=[],txt=[];let count=0;
    for(const ft of physicalFeatures().filter(f=>voltageClass(f.properties.voltage_kv)===kv)){
      const p=ft.properties||{};const info=`<b>${p.description||`${p.from||'—'} – ${p.to||'—'}`}</b><br>${kv} kV existing grid<br>Length: ${fmt(n(p.length_km),1)} km<br>Circuits: ${fmt0(n(p.circuits)||1)}`;
      const parts=ft.geometry?.type==='MultiLineString'?(ft.geometry.coordinates||[]):[ft.geometry?.coordinates||[]];
      for(const line of parts){for(const pt of line){x.push(n(pt[0]));y.push(n(pt[1]));txt.push(info)}x.push(null);y.push(null);txt.push('')}
      count++;
    }
    if(count)traces.push({type:'scatter',mode:'lines',name:`Existing ${kv} kV`,x,y,text:txt,hovertemplate:'%{text}<extra></extra>',line:styles[kv],opacity:.94,connectgaps:false,showlegend:false,meta:{layer:'physical',voltage:kv,count}});
  }
  return traces;
}
function planningLineTraces24(){
  if(!state.showLines)return[];
  const x=[],y=[],txt=[],loops=[];let count=0;
  for(const e of D.geography.planningLines24||[]){
    const x1=n(e.from_lon),y1=n(e.from_lat),x2=n(e.to_lon),y2=n(e.to_lat);
    if(![x1,y1,x2,y2].every(Number.isFinite))continue;
    const info=`<b>${e.from_bus_name} – ${e.to_bus_name}</b><br>PARAMO 24-node branch`;
    if(Math.hypot(x2-x1,y2-y1)<1e-8){
      const r=.075,steps=24;for(let i=0;i<=steps;i++){const a=2*Math.PI*i/steps;loops.push([x1+r*Math.cos(a),y1+r*Math.sin(a),info])}loops.push([null,null,'']);
    }else{x.push(x1,x2,null);y.push(y1,y2,null);txt.push(info,info,'')}
    count++;
  }
  for(const p of loops){x.push(p[0]);y.push(p[1]);txt.push(p[2])}
  if(!count)return[];
  return [
    {type:'scatter',mode:'lines',name:'PARAMO 24-node reduced network halo',x,y,hoverinfo:'skip',line:{color:'rgba(255,255,255,.96)',width:6.5},connectgaps:false,showlegend:false,meta:{layer:'reduced24',count}},
    {type:'scatter',mode:'lines',name:'PARAMO 24-node reduced network',x,y,text:txt,hovertemplate:'%{text}<extra></extra>',line:{color:'#073b4c',width:3.5},connectgaps:false,showlegend:false,meta:{layer:'reduced24',count}}
  ];
}
function nodeIndex24(){return Object.fromEntries((D.geography.nodes24||[]).map(x=>[x.paramo_bus,x]))}
function externalSystemTraces24(){
  if(!state.showExternal)return[];
  const idx=nodeIndex24(),tr=[];
  for(const item of D.geography.interconnections||[]){
    const start=idx[item.model_connection_bus];const ex=n(item.display_longitude),ey=n(item.display_latitude);if(!start||!Number.isFinite(ex)||!Number.isFinite(ey))continue;
    const sx=n(start.longitude),sy=n(start.latitude),label=item.country||item.external_system;
    const isPeru=String(item.external_system).toUpperCase()==='PER';
    // Peru is already represented by the Node_23–Node_24 branch. Colombia needs an explicit planning link.
    if(!isPeru){tr.push({type:'scatter',mode:'lines',name:`${label} interconnection`,x:[sx,ex],y:[sy,ey],text:[`${start.paramo_bus_name} – ${label}`,``,],hovertemplate:'%{text}<extra></extra>',line:{color:'#40546d',width:2.8,dash:'dash'},showlegend:false,meta:{layer:'external24',country:label}})}
    tr.push({type:'scatter',mode:'markers+text',name:label,x:[ex],y:[ey],text:[label],textposition:isPeru?'top right':'bottom right',customdata:[item.display_basis||'External-system anchor'],hovertemplate:'%{text}<br>%{customdata}<extra></extra>',marker:{size:13,color:'#fff',line:{color:'#40546d',width:2.5}},showlegend:false,meta:{layer:'external24',country:label}});
  }
  return tr;
}
function nodes24Trace(){
  if(!state.showNodes)return[];
  const pts=(D.geography.nodes24||[]).filter(x=>Number.isFinite(Number(x.longitude))&&Number.isFinite(Number(x.latitude)));
  return [{type:'scatter',mode:'markers+text',name:'24N nodes',x:pts.map(x=>n(x.longitude)),y:pts.map(x=>n(x.latitude)),text:pts.map(x=>String(x.paramo_bus||'').replace('Node_','N')),textposition:'top center',textfont:{size:8,color:'#243b53'},customdata:pts.map(x=>`${x.paramo_bus_name}<br>${x.canonical_substation_name}<br>Model zone: ${x.model_zone_legacy||'—'}<br>PARAMO planning node`),hovertemplate:'%{customdata}<extra></extra>',marker:{size:8,color:pts.map(x=>C[x.model_zone_legacy]||C.navy),line:{color:'#fff',width:1.2}},showlegend:false,meta:{layer:'nodes24',count:pts.length}}];
}
function mapLayout(){return {margin:{l:54,r:12,t:10,b:48},paper_bgcolor:'#fff',plot_bgcolor:'#f7f9f6',showlegend:false,hovermode:'closest',xaxis:{title:{text:'Longitude [°]',standoff:7},range:[-81.55,-75.15],gridcolor:'#dfe5df',zeroline:false,showline:true,linecolor:'#aeb8c4',mirror:true,automargin:true},yaxis:{title:{text:'Latitude [°]',standoff:7},range:[-6.25,2.25],gridcolor:'#dfe5df',zeroline:false,showline:true,linecolor:'#aeb8c4',mirror:true,automargin:true,scaleanchor:'x',scaleratio:1}}}
function updateMapGridStatus(){
  const counts={138:0,230:0,500:0};for(const ft of physicalFeatures()){const v=voltageClass(ft.properties.voltage_kv);if(v)counts[v]++}
  const reduced=is24()?(D.geography.planningLines24||[]).length:[...new Set((D.sixNode.transmission||[]).map(r=>r.Corridor))].length;
  el('mapGridStatus').innerHTML=`<strong>Physical grid:</strong> ${counts[500]} × 500 kV · ${counts[230]} × 230 kV · ${counts[138]} × 138 kV<br><strong>PARAMO network:</strong> ${reduced} ${is24()?'branches':'corridors'}`;
}
function renderMap24(){
  el('mapTitle').textContent='Ecuador grid and PARAMO 24-node network';el('mapSubtitle').textContent=`${state.scenario} · ${state.hydrology}`;el('mapBadge').textContent='24-bus';updateMapGridStatus();
  const tr=[...countryContextTraces(),...physicalNetworkTraces(),...planningLineTraces24(),...externalSystemTraces24(),...nodes24Trace()];plotReferencePlants(tr);
  Plotly.react('networkMap',tr,mapLayout(),{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});
  el('mapLegend').innerHTML='<span class="legend-item"><span class="country-context-key"></span>Ecuador / neighboring borders</span><span class="legend-item"><span class="network-voltage-key network-500"></span>500 kV</span><span class="legend-item"><span class="network-voltage-key network-230"></span>230 kV</span><span class="legend-item"><span class="network-voltage-key network-138"></span>138 kV</span><span class="legend-item"><span class="planning-line-key"></span>PARAMO 24-node branch</span><span class="legend-item"><span class="external-link-key"></span>Colombia / Peru link</span>';
}
function renderMap6(){
  el('mapTitle').textContent='Ecuador grid and PARAMO 6-node network';el('mapSubtitle').textContent=`${sixCase().replace('_',' · ')} · ${state.year}`;el('mapBadge').textContent='6-bus';updateMapGridStatus();
  const nodes=(D.sixNode.nodes||[]).filter(x=>Number.isFinite(Number(x.longitude))&&Number.isFinite(Number(x.latitude))),coord=Object.fromEntries(nodes.map(x=>[String(x.node).toUpperCase(),x])),yr=(D.sixNode.transmission||[]).filter(x=>x.Case===sixCase()&&n(x.Year)===state.year),tr=[...countryContextTraces(),...physicalNetworkTraces()];
  if(state.showLines){const maxCap=Math.max(1,...yr.map(e=>n(e.AvailableCapacity_MW)));for(const e of yr){const a=coord[String(e.FromNode).toUpperCase()],b=coord[String(e.ToNode).toUpperCase()];if(!a||!b)continue;const isExt=a.type==='external'||b.type==='external';if(isExt&&!state.showExternal)continue;const color=isExt?'#40546d':decisionColor(e.CumulativeState),width=2.8+6.5*n(e.AvailableCapacity_MW)/maxCap,x=[n(a.longitude),n(b.longitude)],y=[n(a.latitude),n(b.latitude)],info=`<b>${e.Corridor}</b><br>${e.CumulativeState}<br>Available: ${fmt(n(e.AvailableCapacity_MW),1)} MW<br>Added: ${fmt(n(e.AddedCapacity_MW),1)} MW<br>Peak flow: ${fmt(n(e.PeakAbsFlow_MW),1)} MW<br>Utilization: ${fmt(100*n(e.Utilization),1)}%`;tr.push({type:'scatter',mode:'lines',name:`${e.Corridor} halo`,x,y,line:{color:'#fff',width:width+2.5,dash:isExt?'dash':'solid'},hoverinfo:'skip',showlegend:false,meta:{layer:'reduced6',corridor:e.Corridor,external:isExt}});tr.push({type:'scatter',mode:'lines',name:e.Corridor,x,y,text:[info,info],hovertemplate:'%{text}<extra></extra>',line:{color,width,dash:isExt?'dash':'solid'},showlegend:false,meta:{layer:'reduced6',corridor:e.Corridor,external:isExt}})}}
  plotReferencePlants(tr);
  if(state.showNodes){const internal=nodes.filter(x=>x.type==='internal');tr.push({type:'scatter',mode:'markers+text',name:'6N nodes',x:internal.map(x=>n(x.longitude)),y:internal.map(x=>n(x.latitude)),text:internal.map(x=>x.node),textposition:'top center',customdata:internal.map(x=>`${x.name}<br>PARAMO planning node`),hovertemplate:'%{text}<br>%{customdata}<extra></extra>',marker:{size:17,color:internal.map(x=>C[x.node]||C.navy),line:{color:'#fff',width:2}},showlegend:false,meta:{layer:'nodes6',count:internal.length}})}
  if(state.showExternal){const ext=nodes.filter(x=>x.type==='external');tr.push({type:'scatter',mode:'markers+text',name:'External systems',x:ext.map(x=>n(x.longitude)),y:ext.map(x=>n(x.latitude)),text:ext.map(x=>x.name),textposition:'top right',customdata:ext.map(x=>x.coordinate_basis),hovertemplate:'%{text}<br>%{customdata}<extra></extra>',marker:{size:16,color:'#fff',line:{color:'#40546d',width:2.6}},showlegend:false,meta:{layer:'external6',count:ext.length}})}
  Plotly.react('networkMap',tr,mapLayout(),{responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']});
  el('mapLegend').innerHTML='<span class="legend-item"><span class="country-context-key"></span>Ecuador / neighboring borders</span><span class="legend-item"><span class="network-voltage-key network-500"></span>500 kV</span><span class="legend-item"><span class="network-voltage-key network-230"></span>230 kV</span><span class="legend-item"><span class="network-voltage-key network-138"></span>138 kV</span><span class="legend-item"><span class="planning-line-key"></span>PARAMO 6-node corridor</span><span class="legend-item"><span class="external-link-key"></span>Colombia / Peru corridor</span><span class="legend-item">Width ∝ available capacity [MW]</span>';
}

function renderCurrent(){syncSelectors();detailVisibility();if(state.tab==='overview')renderOverview();else if(state.tab==='generation')renderGeneration();else if(state.tab==='network'){if(is24())renderNetwork24Detail();else renderNetwork();}else if(state.tab==='hydrology'){if(is24())renderHydrology24Detail();else renderHydrology();}else if(state.tab==='operation')renderOperation();else if(state.tab==='emissions')renderEmissions();else if(state.tab==='reliability')renderReliability();else if(state.tab==='costs')renderCosts();else if(state.tab==='compare')renderCompare();applyResearchContext();renderMap();renderResearchViews();renderInterpretation();setTimeout(addChartTools,0)}
function switchTab(tab){state.tab=tab;document.querySelectorAll('.tab-panel').forEach(x=>x.classList.toggle('active',x.id===tab));document.querySelectorAll('.nav-btn').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));renderCurrent()}
function showRuntimeError(err){const box=el('runtimeNotice');if(box){box.hidden=false;box.textContent='The interactive layer could not be initialized. Reload the page; if the problem persists, report the issue in the GitHub repository.'}console.error(err)}
/* research: additive result views within the existing interface. */
function revisionAnnual(metric,id,unit,color){
 const rowFilter=r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario;
 let traces=[],rows=[],label=state.stat;
 if(state.stat==='Representative'){
 rows=D.national.annualRep.filter(rowFilter);const field=metric==='ENS_GWh'?'PNS_GWh':'CO2_kt';label=`${state.scenario} · ${state.hydrology} · ${s24().Representative_w}`;
 traces=[{type:'scatter',mode:'lines+markers',name:label,x:rows.map(r=>r.Year),y:rows.map(r=>r[field]),line:{color,width:2.5},marker:{size:4}}];
 }else{
 rows=D.national.annualEnsembleStats.filter(rowFilter);
 if(state.hydrology==='Baseline'){
 traces.push({type:'scatter',mode:'lines',name:'P90',x:rows.map(r=>r.Year),y:rows.map(r=>r['P90'+metric]),line:{width:0},showlegend:false,hoverinfo:'skip'});
 traces.push({type:'scatter',mode:'lines',name:'P10–P90 across realizations',x:rows.map(r=>r.Year),y:rows.map(r=>r['P10'+metric]),line:{width:0},fill:'tonexty',fillcolor:metric==='ENS_GWh'?'rgba(183,67,67,.14)':'rgba(196,62,125,.14)',hoverinfo:'skip'});
 }else if(metric==='CO2_kt'){
 for(let i=1;i<=5;i++){const rr=D.national.emissionChartRows.filter(r=>rowFilter(r)&&r.w==='w'+i);traces.push({type:'scatter',mode:'lines',name:'w'+i,x:rr.map(r=>r.Year),y:rr.map(r=>r.CO2_kt),line:{width:1,color},opacity:.32,showlegend:false});}
 }
 traces.push({type:'scatter',mode:'lines+markers',name:state.stat,x:rows.map(r=>r.Year),y:rows.map(r=>r[state.stat+metric]),line:{color,width:3},marker:{size:3}});
 }
 plot(id,traces,{xaxis:{title:'Planning year'},yaxis:{title:unit}},rows,id,unit);
 const title=el(id).closest('.chart-card')?.querySelector('.chart-title');if(title)title.textContent=`Annual ${metric==='ENS_GWh'?'ENS':'direct CO₂'} · ${label}`;
}
function applyResearchContext(){
 const s=is24()?s24():null;
 el('studyDesign').hidden=!is24();el('plantBalanceFigure').hidden=!(is24()&&state.tab==='hydrology');
 if(!is24())return;
 const rows=D.national.summary;

 if(state.tab==='generation'){
  el('capacityChartTitle').textContent=`Domestic in-service capacity · ${state.stat}`;
  el('capacityAdditionsTitle').textContent='New generation capacity commissioned';
  const key='add_'+state.stat.toLowerCase()+'_MW';
  const rr=D.national.capacityAddStats.filter(r=>r.Scenario===state.scenario&&r.Hydrology===state.hydrology);
  const ar=state.stat==='Representative'?D.national.capacityAddRep.filter(r=>r.Scenario===state.scenario&&r.Hydrology===state.hydrology).map(r=>({...r,[key]:r.Capacity_MW})):rr;
  const traces=D.meta.techOrder.filter(t=>t!=='IMPORTS').map(t=>{const tr=ar.filter(r=>r.Tech===t);return {type:'bar',name:TECH_LABELS[t]||t,x:tr.map(r=>r.Year),y:tr.map(r=>r[key]),marker:{color:TECH_COLORS[t]}};});
  plot('capacityAdditions',traces,{barmode:'stack',yaxis:{title:'Commissioned capacity [MW]'},xaxis:{title:'Planning year'}},ar,'capacity_additions','New capacity [MW]');
  const curr=ar.filter(r=>r.Year===state.year);const cards=el('generationKpis').querySelectorAll('.kpi-card');if(cards[1])cards[1].innerHTML=kpi('New capacity',fmt0(curr.reduce((x,r)=>x+n(r[key]),0))+' MW','Commissioned during selected year').replace(/^<div[^>]*>|<\/div>$/g,'');
  const displayedSupply=D.national.annualRep.find(r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&r.Year===state.year);
  if(cards[2])cards[2].innerHTML=kpi('Annual supply',fmt(displayedSupply?.GenerationTotal_GWh,1)+' GWh',`${s.Representative_w} · ${state.year}`).replace(/^<div[^>]*>|<\/div>$/g,'');
  if(cards[3])cards[3].innerHTML=kpi('Capacity statistic',state.stat,'Energy: selected realization').replace(/^<div[^>]*>|<\/div>$/g,'');
  el('generationAnnualTitle').textContent=`Annual supply · ${s.Representative_w} · ${state.hydrology}`;
  el('generationMixYearTitle').textContent=`Supply mix · ${state.year} · ${s.Representative_w}`;
  el('repGenerationNote').innerHTML=`Energy panels use monthly model outputs for <strong>${state.scenario}–${s.Representative_w}</strong>. Capacity uses the statistic selected at left. Imports are shown as supply, not domestic installed capacity. The additions panel reports commissioned capacity; the capacity stock also reflects unit retirement.`;
 }
 if(false && state.tab==='network'){
  const tr=D.national.transmissionStates.filter(r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&r.Year===state.year);
  const sorted=[...tr].sort((a,b)=>b.ReconductoringShare-a.ReconductoringShare);const names=r=>r.FromNode.replace('Node_','N')+'–'+r.ToNode.replace('Node_','N');
  plot('networkSecondary',[{type:'bar',orientation:'h',name:'Reconductoring share',y:sorted.map(names),x:sorted.map(r=>100*r.ReconductoringShare),marker:{color:C.navy},hovertemplate:'%{y}<br>Realizations with reconductoring %{x:.1f}%<extra></extra>'}],{margin:{l:95,r:22,t:18,b:52},xaxis:{title:'Share of realizations [%]',range:[0,100]},yaxis:{title:'Equivalent corridor',autorange:'reversed',automargin:true}},tr,'reconductoring_24N','Adoption share [%]');
  el('networkSecondaryTitle').textContent=`Reconductoring states in service · ${state.year}`;el('networkSecondary').style.height='660px';
  el('transmissionDecisionCard').hidden=false;
  plot('transmissionDecisionTimeline',[{type:'bar',orientation:'h',name:'Standard new circuits',y:tr.map(names),x:tr.map(r=>r.ExpectedNewStandard),marker:{color:C.green}},{type:'bar',orientation:'h',name:'Reconductored new circuits',y:tr.map(names),x:tr.map(r=>r.ExpectedNewReconductored),marker:{color:C.gold}}],{barmode:'stack',margin:{l:95,r:30,t:35,b:50},xaxis:{title:'Expected number of new circuits'},yaxis:{title:'Equivalent corridor',autorange:'reversed',automargin:true}},tr,'new_circuits_24N','Expected circuits [count]');
  el('transmissionDecisionTimeline').style.height='660px';el('transmissionDecisionTimeline').closest('.chart-card').querySelector('.chart-title').textContent=`New circuits in service · ${state.year}`;
  const tc=D.national.costTerms.filter(r=>r.Hydrology===state.hydrology&&r.Component==='TransmissionCost');plot('transmissionCost',[{type:'bar',name:'Total transmission',x:tc.map(r=>r.Scenario),y:tc.map(r=>r.Mean),marker:{color:tc.map(r=>colorScenario(r.Scenario))}}],{yaxis:{title:'Mean discounted cost [MUSD]'},xaxis:{title:'Pathway'}},tc,'transmission_mean_cost','Mean total [MUSD]');
  el('networkNote').innerHTML='Current investment states come from <strong>04_DATOS / transmission_adoption_rate.csv</strong>. Existing-line reconductoring is a share of realizations; new circuits are expected counts. These are equivalent planning corridors, not physical line routes.';
  el('networkStatus').textContent='31 corridors · ensemble investment states';el('networkStatus').className='status-badge';
  el('networkKpis').innerHTML=[kpi('Transmission cost',fmt(tc.find(x=>x.Scenario===state.scenario)?.Mean,1)+' MUSD','Ensemble mean','navy'),kpi('Equivalent corridors','31','24 electrical buses','green'),kpi('New circuits',fmt(tr.reduce((a,r)=>a+r.ExpectedNewCircuits,0),2),'Expected in-service count','gold'),kpi('Ensemble',fmt0(s.EnsembleN),`${state.hydrology} · ${state.year}`,'magenta')].join('');
  el('networkTable').innerHTML=tableHtml([{label:'Corridor',key:'corr'},{label:'Reconductoring [%]',key:'share',num:true},{label:'Expected standard circuits',key:'standard',num:true},{label:'Expected reinforced circuits',key:'reinforced',num:true}],tr.map(r=>({corr:names(r),share:fmt(100*r.ReconductoringShare,1),standard:fmt(r.ExpectedNewStandard,2),reinforced:fmt(r.ExpectedNewReconductored,2)})));
 }
 if(false && state.tab==='hydrology'){
  el('hydroGenerationTitle').textContent=`Monthly water operation · ${s.Representative_w} · ${state.year}`;
  el('hydroCascadeFlowTitle').textContent='Monthly hydro profile · variation across planning years';
  el('hydroSeasonLegend').innerHTML='<div class="hydro-regime-note">Aggregate storage refers to the represented five-plant subsystem. The lower right hydro profile spans 2025–2050 within each selected realization; its band is not Monte Carlo uncertainty. Water volumes summed across cascade plants include reuse.</div>';
  const cards=el('hydroKpis').querySelectorAll('.kpi-sub');if(cards[3])cards[3].textContent='Selected realization';
 }
 if(state.tab==='emissions')revisionAnnual('CO2_kt','emissionAnnual','Direct CO₂ [kt/model-year]',C.magenta);
 if(state.tab==='reliability')revisionAnnual('ENS_GWh','ensAnnual','ENS [GWh/model-year]',C.red);
 if(state.tab==='costs'){
  const labels={OpCostGen:'Generation OPEX',PNSCost:'ENS penalty',TransmissionCost:'Transmission',NewGenBuiltCost:'New generation',FixedCosts:'Fixed costs',EmissionCosts:'Carbon cost',ReserveCosts:'Reserve',CurtailedCosts:'Curtailment'};
  const colors=[C.navy,C.red,C.gold,C.green,C.grey,C.magenta,C.teal,'#786b9b'];const terms=D.national.costTerms.filter(r=>r.Hydrology===state.hydrology&&r.Component!=='TotalCost_w');
  const traces=Object.entries(labels).map(([k,l],i)=>({type:'bar',name:l,x:['REF','BRIDGE','NZT'],y:['REF','BRIDGE','NZT'].map(s=>terms.find(r=>r.Scenario===s&&r.Component===k)?.Mean??null),marker:{color:colors[i]}}));
  plot('costComponents',traces,{barmode:'stack',yaxis:{title:'Mean discounted cost [MUSD]'},xaxis:{title:'Pathway'}},terms,'disjoint_cost_components','8 disjoint components [MUSD]');
  el('costComponents').closest('.chart-card').querySelector('.chart-title').textContent='Mean discounted cost components';
 }
 if(state.tab==='operation'){
  const ops=D.national.monthlyOps.filter(r=>r.Scenario===state.scenario&&r.Hydrology===state.hydrology&&r.Year===state.year);
  const imports=D.national.monthlyGen.filter(r=>r.Scenario===state.scenario&&r.Hydrology===state.hydrology&&r.Year===state.year&&r.Tech==='IMPORTS').reduce((a,r)=>a+r.GWh,0);
  el('operationKpis').innerHTML=[kpi('Imports',fmt(imports,1)+' GWh',`${state.year} · ${s.Representative_w}`,'navy'),kpi('ENS',fmt(ops.reduce((a,r)=>a+r.ENS_GWh,0),2)+' GWh',`${state.year} · ${s.Representative_w}`,'red'),kpi('Reserve',fmt(ops.reduce((a,r)=>a+r.MW,0)/12,1)+' MW','Monthly mean','green'),kpi('Resolution','Monthly','Not hourly UC','gold')].join('');
 }
}
function setupCompare(){
 for(const id of ['compareCaseA','compareCaseB'])el(id).innerHTML='<option value="ecuador_24bus">Ecuador 24-Bus</option><option value="ecuador_6bus">Ecuador 6-Bus</option>';
 function refresh(side){const cid=el('compareCase'+side).value,c=CASES[cid];el('compareScenario'+side).innerHTML=c.scenarios.map(s=>`<option>${s}</option>`).join('');el('compareHydro'+side).innerHTML=c.hydrology.map(h=>`<option>${h}</option>`).join('');el('compareScenario'+side).value=cid==='ecuador_24bus'?'BRIDGE':'BAU';el('compareHydro'+side).value=c.hydrology[side==='A'?0:1];}
 refresh('A');refresh('B');['A','B'].forEach(side=>['Case','Scenario','Hydro'].forEach(k=>el(`compare${k}${side}`).addEventListener('change',()=>{if(k==='Case')refresh(side);renderCompare()})));
}
function renderCompare(){
 if(el('compareCaseA').value!==el('compareCaseB').value){
 el('compareTable').innerHTML='<div class="warning-box">24-Bus and 6-Bus are independent models. Select the same representation on both sides for within-model differences. Their scenario labels, temporal resolution, annual plans and capacity indicators are not interchangeable.</div>';
 plot('compareChart',[],{xaxis:{visible:false},yaxis:{visible:false},annotations:[{text:'Select two configurations of the same model',xref:'paper',yref:'paper',x:.5,y:.5,showarrow:false}]},[],'separate_models','Independent models');return;
 }
 renderCompareLegacy();
}

function init(){initResearch();initDetail();parseURL();initYearOptions();if(state.tab==='figures')state.tab='overview';syncSelectors();document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));document.querySelectorAll('[data-open-tab]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();switchTab(a.dataset.openTab)}));el('caseSelect').addEventListener('change',e=>{state.caseId=e.target.value;state.scenario=is24()?'BRIDGE':'BAU';state.hydrology=CASES[state.caseId].hydrology[0];state.stat=is24()?'Mean':'Deterministic';state.sixFuelView='fuel';state.hydroAsset=e.target.value==='ecuador_6bus'?'paute':'system';state.corridor='all';renderCurrent()});[['scenarioSelect','scenario'],['hydrologySelect','hydrology'],['statSelect','stat'],['yearSelect','year'],['monthSelect','month']].forEach(([id,k])=>el(id).addEventListener('change',e=>{state[k]=(k==='year'||k==='month')?Number(e.target.value):e.target.value;renderCurrent()}));el('fuelViewSelect').addEventListener('change',e=>{state.sixFuelView=e.target.value;renderCurrent()});el('corridorSelect').addEventListener('change',e=>{state.corridor=e.target.value;renderCurrent()});el('hydroAssetSelect').addEventListener('change',e=>{state.hydroAsset=e.target.value;renderCurrent()});[['mapLines','showLines'],['mapReferenceLines','showReferenceLines'],['mapNodes','showNodes'],['mapPlants','showPlants'],['mapExternal','showExternal']].forEach(([id,k])=>el(id).addEventListener('change',e=>{state[k]=e.target.checked;renderMap();updateURL()}));el('resetBtn').addEventListener('click',()=>{el('wetCheck').checked=true;el('dryCheck').checked=true;el('tx24Layer').value='representative';Object.assign(detailState,{hydroView:'operation',storageUnit:'volume',cascade:'Paute',plant:'E_HYD_Mazar_170MW',plantLayer:'mean',corridor:'all'});Object.assign(state,{tab:'overview',caseId:'ecuador_24bus',scenario:'BRIDGE',hydrology:'Baseline',stat:'Mean',year:2050,month:1,showLines:true,showReferenceLines:true,showNodes:true,showPlants:false,showExternal:true,sixFuelView:'fuel',hydroAsset:'system',corridor:'all'});['mapLines','mapReferenceLines','mapNodes','mapExternal'].forEach(id=>el(id).checked=true);el('mapPlants').checked=false;switchTab('overview')});el('presentationBtn').addEventListener('click',()=>document.body.classList.toggle('presentation-mode'));el('copyLinkBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);el('copyLinkBtn').textContent='Link copied';setTimeout(()=>el('copyLinkBtn').textContent='Copy view link',1200)}catch{alert(location.href)}});el('citationBox').textContent=citation;el('copyCitationBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(citation);el('copyCitationBtn').textContent='Copied';setTimeout(()=>el('copyCitationBtn').textContent='Copy citation',1200)}catch{alert(citation)}});setupCompare();switchTab(state.tab)}
/* Incremental 24-bus explorer, v1.0.0. Numeric records are never inferred from figures. */
const N24=window.PARAMO_NATIONAL_DETAIL;

const detailState={hydroView:'operation',storageUnit:'volume',cascade:'Paute',plant:'E_HYD_Mazar_170MW',plantLayer:'mean',corridor:'all'};
const HM=Array.from({length:12},(_,i)=>i+1);
const HC={Baseline:C.teal,Adverse:C.magenta};
const TX={reconductoring:'#1f77b4',newCircuit:'#de6500',base:'#b6bec7'};
const node24=Object.fromEntries(N24.nodes.map(x=>[x.paramo_bus,x]));
const edgeKey=(a,b)=>[a,b].sort((x,y)=>Number(x.split('_')[1])-Number(y.split('_')[1])).join('|');
const name24=id=>(node24[id]?.name||id).replace(/^B\d+_/,'').replaceAll('_',' ');
const txRows=(h,year=state.year)=>(el('tx24Layer')?.value==='representative'?D.national.transmissionSelected:D.national.transmissionStates).filter(r=>r.Hydrology===h&&r.Scenario===state.scenario&&Number(r.Year)===year);
function txMatch(r,key){return key==='all'||edgeKey(r.FromNode,r.ToNode)===key;}
function txStats(h,year=state.year,key=detailState.corridor){const rows=txRows(h,year).filter(r=>txMatch(r,key));return {rows,newCircuits:rows.reduce((a,r)=>a+Number(r.ExpectedNewCircuits),0),reconductoring:rows.reduce((a,r)=>a+Number(r.ReconductoringShare),0)};}
function detailURL(){const q=new URLSearchParams(location.search);q.set('hydroView',detailState.hydroView);q.set('corridor24',detailState.corridor);history.replaceState(null,'',location.pathname+'?'+q.toString());}
function detailVisibility(){
 el('network24Detail').hidden=!is24();el('hydro24Detail').hidden=!is24();el('hydroLegacyBody').hidden=is24();
 // These two views explicitly distinguish means and selected paths; a global quantile does not apply.
 if(is24()&&['network','hydrology'].includes(state.tab))el('statWrap').hidden=true;
 el('caseCapabilityNote').innerHTML=is24()?'24N: monthly planning, transmission investment decisions and aggregate reservoir storage.':'6N: independent reduced model; transmission decisions, generation expansion and aggregate storage.';
 if(is24()&&state.tab==='network')el('network24Detail').classList.add('active');
 detailURL();
}
function renderNetwork24Detail(){

 const selected=txStats(state.hydrology,state.year,'all'),cost=D.national.transmissionCostStats.filter(r=>r.Hydrology===state.hydrology),total=cost.find(r=>r.Scenario===state.scenario&&r.Component==='Total transmission');
 el('networkStatus').textContent='Corridor-level ensemble states';el('networkStatus').className='status-badge';
 el('networkNote').className='detail-scope';el('networkNote').innerHTML=`<strong>${esc(state.scenario)} · ${state.year}</strong> · Maps compare Baseline (N=100) and Adverse (N=5). Investment widths use weighted ensemble means, not the selected representative realization. The table below follows <strong>${esc(state.hydrology)}</strong>.`;
 el('networkKpis').innerHTML=[kpi('Transmission cost',fmt(total?.Mean,1)+' MUSD',`${state.hydrology} · discounted mean over 2025–2050`,'navy'),kpi('Equivalent network','24 buses · 31 links','28 spatial + 3 co-located links','green'),kpi('New circuits',fmt(selected.newCircuits,2),`${state.hydrology} · expected in service by ${state.year}`,'gold'),kpi('Reconductored corridors',fmt(selected.reconductoring,2),'Expected count; not new circuits','magenta')].join('');
 el('transmissionDecisionCard').hidden=true;
 el('tx24Title').textContent=`${state.scenario} · transmission states in service by ${state.year}`;
 el('tx24Corridor').value=detailState.corridor;
 renderTxMaps24();renderTxHistory24();
 const components=['New lines','Existing-line reinforcement','New reinforced circuits'];
 plot('transmissionCost',components.map((comp,i)=>({type:'bar',name:({'New lines':'New conventional circuits','Existing-line reinforcement':'Existing-circuit reconductoring'}[comp]||comp),x:['REF','BRIDGE','NZT'],y:['REF','BRIDGE','NZT'].map(sc=>cost.find(r=>r.Component===comp&&r.Scenario===sc)?.Mean??null),marker:{color:[C.green,TX.reconductoring,TX.newCircuit][i]}})),{barmode:'stack',xaxis:{title:'Policy pathway'},yaxis:{title:'Expected discounted transmission cost [MUSD]'},legend:{orientation:'h',y:1.2},margin:{t:50}},cost,'24N_transmission_cost','Ensemble mean [MUSD]');
 const rank=selected.rows.filter(r=>r.ExpectedNewCircuits>0||r.ReconductoringShare>0).sort((a,b)=>b.ExpectedNewCircuits-a.ExpectedNewCircuits).slice(0,12);
 const label=r=>`${r.FromNode.replace('Node_','') }–${r.ToNode.replace('Node_','')} · ${name24(r.FromNode)}–${name24(r.ToNode)}`;
 plot('networkSecondary',[{type:'bar',orientation:'h',name:'New standard',x:rank.map(r=>r.ExpectedNewStandard),y:rank.map(label),marker:{color:C.gold}},{type:'bar',orientation:'h',name:'New reinforced',x:rank.map(r=>r.ExpectedNewReconductored),y:rank.map(label),marker:{color:TX.newCircuit}}],{barmode:'stack',xaxis:{title:'Expected new circuits in service [circuits]',rangemode:'tozero'},yaxis:{autorange:'reversed',title:'Equivalent corridor'},margin:{l:190,t:40},legend:{orientation:'h',y:1.17}},rank,'24N_new_circuits','Expected count [circuits]');
 el('networkSecondaryTitle').textContent=`New-circuit allocation · ${state.hydrology} · ${state.year}`;
 const tr=selected.rows.filter(r=>txMatch(r,detailState.corridor));
 el('networkTable').innerHTML=tableHtml([{label:'Equivalent corridor',key:'corr'},{label:'Reconductoring [%]',key:'share',num:true},{label:'Expected standard circuits',key:'standard',num:true},{label:'Expected new reinforced',key:'reinforced',num:true},{label:'Expected new total',key:'total',num:true}],tr.map(r=>({corr:esc(label(r)),share:fmt(100*r.ReconductoringShare,1),standard:fmt(r.ExpectedNewStandard,2),reinforced:fmt(r.ExpectedNewReconductored,2),total:fmt(r.ExpectedNewCircuits,2)})));
}
function renderTxMaps24(){
 const traces=[],annotations=[],shapes=[];const selected=detailState.corridor;
 // Label offsets reproduce the publication geometry, without moving the buses.
 const positions={3:[-78.54,.20],4:[-80.20,.96],6:[-77.83,-.50],8:[-78.15,-1.45],9:[-80.54,-1.77],11:[-77.18,.07],12:[-79.68,-.24],15:[-80.07,-1.11],18:[-79.34,-2.03],20:[-78.16,-2.57],22:[-78.5,-4.07],23:[-80.28,-3.30],24:[-80.41,-5.31]};
 const groups={6:'6/7',9:'9/10',12:'12/13'};
 for(const [i,h] of ['Baseline','Adverse'].entries()){
  const ax=i?'x2':'x',ay=i?'y2':'y',rows=txRows(h),lookup=Object.fromEntries(rows.map(r=>[edgeKey(r.FromNode,r.ToNode),r]));
  function line(xs,ys,color,width,opts={}){traces.push({type:'scatter',mode:'lines',x:xs,y:ys,xaxis:ax,yaxis:ay,line:{color,width},hoverinfo:'skip',showlegend:false,...opts});}
  for(const f of N24.boundaries.features){let a=f.geometry.coordinates;if(f.geometry.type==='Polygon')a=a[0];if(!Array.isArray(a[0])||typeof a[0][0]!=='number')continue;line(a.map(p=>p[0]),a.map(p=>p[1]),'#939aa1',1,{fill:f.properties.name==='Ecuador'?'toself':undefined,fillcolor:'#f6f7f8'});}
  function addEdge(e,xy,inset=false){
   const key=edgeKey(e.from_bus,e.to_bus),r=lookup[key];if(!r)return;
   const title=`${e.from_bus.replace('Node_','')}–${e.to_bus.replace('Node_','')} · ${name24(e.from_bus)} → ${name24(e.to_bus)}`;
   const individual=el('tx24Layer').value==='representative';
   const hover=`${h} · ${state.scenario} · ${individual?s24(h).Representative_w:'ensemble mean'} · in service by ${state.year}<br>${title}<br>Existing-circuit reconductoring: ${individual?(r.ReconductoringShare>.5?'Yes':'No'):fmt(100*r.ReconductoringShare,1)+'% of realizations'}<br>${individual?'':'Expected '}new conventional circuits: ${fmt(r.ExpectedNewStandard,individual?0:2)}<br>${individual?'':'Expected '}new reinforced circuits: ${fmt(r.ExpectedNewReconductored,individual?0:2)}${inset?'<br>Co-located electrical buses':''}`;
   const opacity=selected==='all'||selected===key?1:.20;
   const data=[key,key,key],txt=[hover,hover,hover];
   const coords=(off=0)=>{
    const dx=xy[1][0]-xy[0][0],dy=xy[1][1]-xy[0][1],norm=Math.hypot(dx,dy)||1;const xx=xy.map(p=>[p[0]-dy/norm*off,p[1]+dx/norm*off]);
    return {x:[xx[0][0],(xx[0][0]+xx[1][0])/2,xx[1][0]],y:[xx[0][1],(xx[0][1]+xx[1][1])/2,xx[1][1]]};};
   const opt={customdata:data,text:txt,hoverinfo:undefined,hovertemplate:'%{text}<extra></extra>',opacity,meta:{corridor:key,hydrology:h,kind:'base'}};
   let c=coords();line(c.x,c.y,TX.base,1.1,opt);
   if(r.ReconductoringShare>0){line(c.x,c.y,TX.reconductoring,.7+4.1*r.ReconductoringShare,{...opt,meta:{...opt.meta,kind:'reconductoring',value:r.ReconductoringShare}});}
   if(r.ExpectedNewStandard>0){c=coords(inset?-.075:.055);line(c.x,c.y,TX.newCircuit,.7+2.4*r.ExpectedNewStandard,{...opt,meta:{...opt.meta,kind:'new',value:r.ExpectedNewStandard}});} if(r.ExpectedNewReconductored>0){c=coords(inset?.075:-.055);line(c.x,c.y,'#8555a8',.7+2.4*r.ExpectedNewReconductored,{...opt,meta:{...opt.meta,kind:'new reinforced',value:r.ExpectedNewReconductored}});}
  }
  for(const e of N24.edges){if(e.co_located)continue;const a=node24[e.from_bus],b=node24[e.to_bus];addEdge(e,[[a.longitude,a.latitude],[b.longitude,b.latitude]]);}
  traces.push({type:'scatter',mode:'markers',x:N24.nodes.map(r=>r.longitude),y:N24.nodes.map(r=>r.latitude),xaxis:ax,yaxis:ay,marker:{color:'#162331',size:6},text:N24.nodes.map(r=>`Node ${r.node_number} · ${name24(r.paramo_bus)}`),hovertemplate:'%{text}<extra></extra>',showlegend:false});
  for(const [num,xy] of Object.entries(positions)){
   const r=node24['Node_'+num];line([r.longitude,xy[0]],[r.latitude,xy[1]],'#525f6e',.5);
   annotations.push({xref:ax,yref:ay,x:xy[0],y:xy[1],text:groups[num]||num,showarrow:false,font:{size:11,color:C.navy},bgcolor:'rgba(255,255,255,.85)',borderpad:1});
  }
  for(const [x,y,text] of [[-76.55,1.20,'COLOMBIA'],[-76.1,-5.07,'PERU'],[-76.40,-1.6,'ECUADOR']])annotations.push({xref:ax,yref:ay,x,y,text,showarrow:false,font:{size:10,color:'#7b8693'}});
  shapes.push({type:'rect',xref:ax,yref:ay,x0:-77.22,x1:-75.00,y0:-4.69,y1:-2.77,fillcolor:'#fff',line:{color:'#a7aeb6',width:.8},layer:'above'});
  annotations.push({xref:ax,yref:ay,x:-76.1,y:-3.00,text:'Local links',showarrow:false,font:{size:11,color:C.navy}});
  // Inset traces must remain above its background: the background is placed below all data.
  shapes[shapes.length-1].layer='below';
  [[6,7],[9,10],[12,13]].forEach(([a,b],j)=>{const e=N24.edges.find(e=>edgeKey(e.from_bus,e.to_bus)===edgeKey('Node_'+a,'Node_'+b)),y=-3.51-.40*j;addEdge(e,[[-76.95,y],[-75.30,y]],true);annotations.push({xref:ax,yref:ay,x:-76.13,y:y+.16,text:`${a}–${b}`,showarrow:false,font:{size:10,color:C.navy}});});
  annotations.push({xref:'paper',yref:'paper',x:i?.77:.23,y:1.065,text:`<b>${h}</b>`,showarrow:false,font:{size:13,color:C.navy}});
 }
 const axis={range:[-81.35,-74.85],title:{text:'Longitude [°]',standoff:6},tickvals:[-81,-78,-75],gridcolor:'#e3e7eb',showline:true,linecolor:'#aeb8c4',zeroline:false,constrain:'domain',fixedrange:false};
 const ya={range:[-5.55,1.6],title:{text:'Latitude [°]',standoff:7},tickvals:[-5,-3,-1,1],gridcolor:'#e3e7eb',showline:true,linecolor:'#aeb8c4',zeroline:false,constrain:'domain'};
 plot('tx24Maps',traces,{xaxis:{...axis,domain:[0,.455],anchor:'y'},yaxis:{...ya,domain:[0,1],scaleanchor:'x',scaleratio:1},xaxis2:{...axis,domain:[.545,1],anchor:'y2'},yaxis2:{...ya,domain:[0,1],anchor:'x2',scaleanchor:'x2',scaleratio:1,overlaying:false,side:'left',showgrid:true},annotations,shapes,showlegend:false,hovermode:'closest',margin:{l:46,r:18,t:62,b:175},dragmode:'pan'},['Baseline','Adverse'].flatMap(h=>txRows(h)),`24N_${state.scenario}_${state.year}_transmission_map`,el('tx24Layer').value==='representative'?'Selected plan · cumulative states':'Adoption [%] · expected circuits');
 const div=el('tx24Maps');if(div.removeAllListeners)div.removeAllListeners('plotly_click');div.on('plotly_click',e=>{const key=e.points?.[0]?.customdata;if(typeof key==='string'&&key.includes('|')){detailState.corridor=key;renderCurrent();}});
}
function renderTxHistory24(){
 const key=detailState.corridor,all=key==='all',years=Array.from({length:26},(_,i)=>2025+i),b=txStats('Baseline'),a=txStats('Adverse');
 const label=all?'All 31 corridors':key.split('|').map(x=>`${x.replace('Node_','')} · ${name24(x)}`).join(' → ');
 el('tx24Selection').innerHTML=`<strong>${esc(label)}</strong><span>New circuits by ${state.year}: <b>${fmt(b.newCircuits,2)}</b> Baseline / <b>${fmt(a.newCircuits,2)}</b> Adverse</span><span>${all?'Expected reconductored corridors':'Reconductoring share'}: <b>${fmt((all?1:100)*b.reconductoring,all?2:0)}${all?'':'%'}</b> / <b>${fmt((all?1:100)*a.reconductoring,all?2:0)}${all?'':'%'}</b></span>`;
 const rows=['Baseline','Adverse'].flatMap(h=>years.map(y=>({Hydrology:h,Year:y,ExpectedNewCircuits:txStats(h,y).newCircuits,ExpectedReconductoredCorridors:txStats(h,y).reconductoring})));
 plot('tx24History',['Baseline','Adverse'].map(h=>({type:'scatter',mode:'lines+markers',name:h,x:years,y:years.map(y=>txStats(h,y).newCircuits),line:{color:HC[h],width:2.5,shape:'hv'},marker:{size:3}})),{xaxis:{title:'Planning year',range:[2025,2050],tickvals:[2025,2030,2035,2040,2045,2050]},yaxis:{title:'Expected new circuits in service [count]',rangemode:'tozero'},shapes:[{type:'line',x0:state.year,x1:state.year,yref:'paper',y0:0,y1:1,line:{color:'#9aa6b5',dash:'dot',width:1}}]},rows,`24N_${state.scenario}_circuits_trajectory`,'Expected circuits [count]');
 plot('tx24Reconductoring',['Baseline','Adverse'].map(h=>({type:'scatter',mode:'lines+markers',name:h,x:years,y:years.map(y=>txStats(h,y).reconductoring*(all?1:100)),line:{color:HC[h],width:2.5,shape:'hv'},marker:{size:3}})),{xaxis:{title:'Planning year',range:[2025,2050],tickvals:[2025,2030,2035,2040,2045,2050]},yaxis:{title:all?'Expected reconductored corridors [count]':'Share of realizations [%]',rangemode:'tozero',...(all?{}:{range:[0,105]})}},rows,`24N_${state.scenario}_reconductoring_trajectory`,all?'Expected corridors [count]':'Realizations [%]');
 el('tx24HistoryTitle').textContent=all?'New circuits in service · complete network':'New circuits in service · selected corridor';
}
const storageHi=Math.max(...D.national.reservoirRep.map(r=>r.StorageHm3),...D.national.reservoirEnvelope.map(r=>r.max||0));
function storageValue(v){return v;}

const storageLabel=()=>'Aggregate end-of-month storage [hm³]';
const hydroRep=(h,year=state.year)=>D.national.reservoirRep.filter(r=>r.Hydrology===h&&r.Scenario===state.scenario&&Number(r.Year)===year).sort((a,b)=>a.Month-b.Month);
const hydroRepLabel=h=>`${h} · ${s24(h).Representative_w}`;
function hydroAxes(ytitle){return {xaxis:{title:'Model month · 720 h',tickmode:'array',tickvals:HM,ticktext:monthNames},yaxis:{title:ytitle},legend:{orientation:'h',y:1.14},margin:{t:45}};}
function renderHydrology24Detail(){
 document.querySelector('#hydrology .section-intro p').textContent='Monthly aggregate storage and electricity supply in selected planning solutions.';
 const s=s24(),rep=hydroRep(state.hydrology),record=rep.find(r=>r.Month===state.month),gen=D.national.monthlyGen.filter(r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario&&r.Year===state.year),hgen=gen.filter(r=>r.Tech==='HYDRO'),view=detailState.hydroView;
 el('h24Scope').innerHTML=`<strong>24-bus monthly model · ${esc(state.scenario)} · ${state.year} · ${monthNames[state.month-1]}</strong><span>Aggregate storage and generation profiles use the identified selected realizations. Ensemble indicators are labelled separately. Each model year has 12 × 720 h; there is no hourly UC in this case.</span>`;
 el('h24Kpis').innerHTML=[kpi('Stored volume',fmt(record?.StorageHm3,1)+' hm³',`${state.hydrology} · ${s.Representative_w} · ${monthNames[state.month-1]}`,'navy'),kpi('Hydro supply',fmt(hgen.find(r=>r.Month===state.month)?.GWh,1)+' GWh',`${monthNames[state.month-1]} · all system hydropower`,'green'),kpi('Mean stored volume',fmt(s.ReservoirMean_Hm3,1)+' hm³','Five-plant subsystem · whole-horizon ensemble mean','magenta')].join('');
 document.querySelectorAll('[data-h24]').forEach(b=>{b.classList.toggle('active',b.dataset.h24===view);b.setAttribute('aria-pressed',String(b.dataset.h24===view));});
 ['operation','comparison'].forEach(v=>el('h24-'+v).hidden=v!==view);
 if(view==='operation')renderHydroOperation24(rep,gen);
 else if(view==='comparison')renderHydroComparison24();

}
function renderHydroOperation24(rep,gen){
 const traces=['Baseline','Adverse'].map(h=>{const rr=hydroRep(h);return {type:'scatter',mode:'lines+markers',name:hydroRepLabel(h),x:rr.map(r=>r.Month),y:rr.map(r=>storageValue(r.StorageHm3)),customdata:rr.map(r=>r.StorageHm3),line:{color:HC[h],width:3},marker:{size:5},hovertemplate:'Month %{x}<br>Storage %{customdata:,.2f} hm³<extra>%{fullData.name}</extra>'};});
 const lay=hydroAxes(storageLabel());lay.yaxis.range=[0,storageHi*1.06];
 plot('h24Storage',traces,lay,['Baseline','Adverse'].flatMap(h=>hydroRep(h)),`24N_${state.scenario}_${state.year}_storage_comparison`,storageLabel());
 el('h24StorageTitle').textContent=`Storage cycles · ${state.scenario} · ${state.year}`;
 el('h24CycleNote').textContent=`Independent paths: ${hydroRepLabel('Baseline')} and ${hydroRepLabel('Adverse')}. The total volume is not a measured water elevation or an ensemble mean.`;
 const deltas=['Baseline','Adverse'].map(h=>{const rr=hydroRep(h);return {type:'bar',name:hydroRepLabel(h),x:HM,y:HM.map((m,i)=>i&&rr[i]&&rr[i-1]?rr[i].StorageHm3-rr[i-1].StorageHm3:null),marker:{color:HC[h]},hovertemplate:'Month %{x}<br>ΔV %{y:,.2f} hm³<extra>%{fullData.name}</extra>'};});
 plot('h24Change',deltas,{...hydroAxes('Monthly storage change ΔV [hm³]'),barmode:'group',yaxis:{title:'Monthly storage change ΔV [hm³]',zeroline:true,zerolinecolor:'#67798e',zerolinewidth:1.2}},deltas.flatMap(t=>t.x.map((m,i)=>({path:t.name,month:m,delta_hm3:t.y[i]}))),`24N_${state.scenario}_${state.year}_storage_change`,'Change [hm³]');
 plot('h24Release',[{type:'bar',name:'Turbined · plant sum',x:HM,y:rep.map(r=>r.TurbineHm3),marker:{color:C.teal}},{type:'bar',name:'Spill / bypass · plant sum',x:HM,y:rep.map(r=>r.SpillHm3),marker:{color:C.gold}}],{...hydroAxes('Hydraulic operations [hm³/model-month]'),barmode:'stack'},rep,`24N_${state.scenario}_${state.year}_hydraulic_operations`,'Water [hm³/model-month]');
 const t=D.meta.techOrder.filter(t=>gen.some(r=>r.Tech===t&&r.GWh>0));
 plot('h24Supply',t.map(t=>({type:'bar',name:TECH_LABELS[t]||t,x:HM,y:HM.map(m=>gen.find(r=>r.Month===m&&r.Tech===t)?.GWh??null),marker:{color:TECH_COLORS[t]||C.grey}})),{...hydroAxes('Electricity supply [GWh/model-month]'),barmode:'stack',legend:{orientation:'h',y:1.28,font:{size:9}},margin:{t:70}},gen,`24N_${state.scenario}_${state.year}_monthly_supply`,'Energy [GWh/model-month]');
}
function renderHydroComparison24(){
 el('h24Calendar').innerHTML='<div class="season-calendar">'+['Baseline','Adverse'].map(h=>`<div class="season-row"><strong>${h}</strong><div class="season-months">${N24.calendar[h].map((s,i)=>`<span class="season-month ${s.toLowerCase()}"><b>${monthNames[i]}</b><small>${s}</small></span>`).join('')}</div></div>`).join('')+'</div>';
 plot('h24Means',['REF','BRIDGE','NZT'].map(s=>({type:'bar',name:s,x:['Baseline','Adverse'],y:['baseline','adverse'].map(h=>Number(N24.meanStorage.find(r=>r.Campaign===h&&r.Scenario===s)?.MeanStorage_hm3)),text:['baseline','adverse'].map(h=>Number(N24.meanStorage.find(r=>r.Campaign===h&&r.Scenario===s)?.MeanStorage_hm3).toFixed(1)),textposition:'outside',cliponaxis:false,marker:{color:C[s]}})),{barmode:'group',xaxis:{title:'Hydrological case'},yaxis:{title:'Mean aggregate storage [hm³]',range:[0,490]},margin:{t:40}},N24.meanStorage,'24N_storage_means_research','Whole-horizon mean [hm³]');
 const gr=D.national.monthlyGen.filter(r=>r.Scenario===state.scenario&&r.Year===state.year),techs=D.meta.techOrder.filter(t=>gr.some(r=>r.Tech===t&&r.GWh>0));
 plot('h24Response',techs.map(t=>({type:'bar',name:TECH_LABELS[t]||t,x:['Baseline','Adverse'].map(h=>hydroRepLabel(h)),y:['Baseline','Adverse'].map(h=>gr.filter(r=>r.Hydrology===h&&r.Tech===t).reduce((a,r)=>a+r.GWh,0)),marker:{color:TECH_COLORS[t]||C.grey}})),{barmode:'stack',xaxis:{title:`Hydrological case · representative realization · ${state.year}`},yaxis:{title:'Annual supply [GWh/model-year]'},legend:{orientation:'h',y:1.26,font:{size:9}},margin:{t:70}},gr,`24N_${state.scenario}_${state.year}_supply_response`,'Representative energy [GWh/model-year]');
 const ens=D.national.summary;plot('h24ENS',['Baseline','Adverse'].map(h=>({type:'bar',name:h,x:['REF','BRIDGE','NZT'],y:['REF','BRIDGE','NZT'].map(sc=>ens.find(r=>r.Hydrology===h&&r.Scenario===sc)?.MeanENS_GWh??null),marker:{color:HC[h]},hovertemplate:'%{x}<br>Expected cumulative ENS %{y:,.3f} GWh<extra>%{fullData.name}</extra>'})),{barmode:'group',xaxis:{title:'Policy pathway'},yaxis:{title:'Expected cumulative ENS, 2025–2050 [GWh]',rangemode:'tozero'}},ens,'24N_cumulative_EENS','Weighted horizon mean [GWh]');
 const env=D.national.reservoirEnvelope.filter(r=>r.Scenario===state.scenario),et=[];
 for(const h of ['Baseline','Adverse']){const rr=env.filter(r=>r.Hydrology===h).sort((a,b)=>a.Month-b.Month);et.push({type:'scatter',mode:'lines',name:h+' P90',x:HM,y:rr.map(r=>r.p90),line:{width:0},showlegend:false,hoverinfo:'skip'});et.push({type:'scatter',mode:'lines',name:h+' P10–P90',x:HM,y:rr.map(r=>r.p10),line:{width:0},fill:'tonexty',fillcolor:h==='Baseline'?'rgba(22,139,135,.14)':'rgba(196,62,125,.12)',showlegend:false,hoverinfo:'skip'});et.push({type:'scatter',mode:'lines+markers',name:h+' median',x:HM,y:rr.map(r=>r.p50),customdata:rr.map(r=>[r.p10,r.p90]),line:{color:HC[h],width:2.5},hovertemplate:'Month %{x}<br>P50 %{y:,.2f} hm³<br>P10 %{customdata[0]:,.2f}<br>P90 %{customdata[1]:,.2f}<extra>%{fullData.name}</extra>'});}
 plot('h24Envelope',et,{...hydroAxes('Aggregate storage envelope [hm³]'),yaxis:{title:'Aggregate storage envelope [hm³]',range:[0,storageHi*1.06]}},env,'24N_monthly_storage_envelope','2050 ensemble envelope [hm³]');

}

function initDetail(){
 const q=new URLSearchParams(location.search);if(['operation','comparison'].includes(q.get('hydroView')))detailState.hydroView=q.get('hydroView');

 const corridors=N24.edges.map(e=>({key:edgeKey(e.from_bus,e.to_bus),label:`${e.from_bus.replace('Node_','')}–${e.to_bus.replace('Node_','')} · ${name24(e.from_bus)} → ${name24(e.to_bus)}`}));
 if(corridors.some(r=>r.key===q.get('corridor24')))detailState.corridor=q.get('corridor24');
 el('tx24Corridor').innerHTML='<option value="all">All 31 corridors</option>'+corridors.map(r=>`<option value="${r.key}">${esc(r.label)}</option>`).join('');
 el('tx24Corridor').addEventListener('change',e=>{detailState.corridor=e.target.value;renderCurrent();});el('tx24Reset').addEventListener('click',()=>{detailState.corridor='all';renderCurrent();});
 document.querySelectorAll('[data-h24]').forEach(b=>b.addEventListener('click',()=>{detailState.hydroView=b.dataset.h24;renderCurrent();}));

 el('presentationBtn').addEventListener('click',()=>setTimeout(()=>document.querySelectorAll('.js-plotly-plot').forEach(p=>{if(p.offsetWidth)Plotly.Plots.resize(p);}),80));
 el('tx24Expand').addEventListener('click',async()=>{const card=el('tx24Maps').closest('.chart-card');try{if(document.fullscreenElement)await document.exitFullscreen();else await card.requestFullscreen();}catch{card.classList.toggle('map-expanded');}setTimeout(()=>Plotly.Plots.resize(el('tx24Maps')),90);});
 document.addEventListener('fullscreenchange',()=>setTimeout(()=>Plotly.Plots.resize(el('tx24Maps')),90));
 D.meta.version='1.0.0';
}


function initResearch(){
 const url=new URLSearchParams(location.search);el('wetCheck').checked=url.get('wet')!=='0';el('dryCheck').checked=url.get('dry')!=='0';if(url.get('txLayer')==='mean')el('tx24Layer').value='mean';
 for(const [id,key] of [['yearSelect','year'],['monthSelect','month']])el(id).addEventListener('input',e=>{state[key]=Number(e.target.value);renderCurrent()});
 for(const id of ['wetCheck','dryCheck','tx24Layer'])el(id).addEventListener('change',()=>renderCurrent());
}
function chosenMonths(h=state.hydrology){return HM.filter(m=>{const season=is24()?N24.calendar[h][m-1]:regimeSeason(h,m);return season==='Wet'?el('wetCheck').checked:season==='Dry'?el('dryCheck').checked:true});}
function applySeason(traces){return traces.map(t=>{if(!t.x?.length)return t;const monthly=t.x.every(x=>(typeof x==='number'&&x>=1&&x<=12)||(typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)));if(!monthly)return t;const h=t.name?.startsWith('Baseline')?'Baseline':t.name?.startsWith('Adverse')?'Adverse':state.hydrology;const allowed=chosenMonths(h);const indices=t.x.map((x,i)=>allowed.includes(typeof x==='number'?x:Number(x.slice(5,7)))?i:-1).filter(i=>i>=0);const out={...t,x:indices.map(i=>t.x[i])};if(t.type==='heatmap')out.z=t.z.map(row=>indices.map(i=>row[i]));else if(t.y)out.y=indices.map(i=>t.y[i]);for(const k of ['customdata','text'])if(Array.isArray(t[k])&&t[k].length===t.x.length)out[k]=indices.map(i=>t[k][i]);return out;});}
function renderResearchViews(){
 el('costRunsResearch').closest('.chart-card').hidden=!is24();

 document.body.classList.toggle('wide-results',['network','scores','generation','operation','hydrology','reliability','emissions','costs'].includes(state.tab));
 el('seasonStatus').textContent=is24()?`${monthNames[state.month-1]}: ${N24.calendar[state.hydrology][state.month-1]} · ${state.hydrology}`:'';
 if(state.tab==='scores'){renderScores();return;}if(!is24())return;
 if(state.tab==='network'){
 const selected=el('tx24Layer').value==='representative';
 el('networkStatus').textContent=selected?'Selected investment plans':'Ensemble investment states';
 el('networkNote').innerHTML=selected?`<strong>${state.scenario}</strong> · Baseline ${s24('Baseline').Representative_w} and Adverse ${s24('Adverse').Representative_w}. Maps show cumulative decisions by ${state.year}; the bars distinguish annual additions from cumulative decisions.`:`<strong>${state.scenario}</strong> · Baseline (100 realizations) and Adverse (five). Maps show reconductoring adoption and expected circuit counts by ${state.year}; the bars below retain the selected realizations for comparison.`;
 el('tx24Title').textContent=`${state.scenario} · ${state.year} · ${selected?'selected realizations':'ensemble means'}`;
 renderTransmissionBars();
 const map=el('tx24Maps');if(map.layout?.annotations){const annotations=map.layout.annotations.filter(a=>!(a.yref==='paper'&&a.y<0)).map(a=>a.yref==='paper'&&a.y>1?{...a,text:(a.text.includes('Baseline')?'Baseline':'Adverse')+(selected?' · '+s24(a.text.includes('Baseline')?'Baseline':'Adverse').Representative_w:' · ensemble mean')}:a);Plotly.relayout(map,{annotations,'margin.b':60});}
 if(selected){
 const subs=el('networkKpis').querySelectorAll('.kpi-sub');if(subs[2])subs[2].textContent=state.hydrology+' · '+s24().Representative_w+' · in service by '+state.year;if(subs[3])subs[3].textContent='Selected realization · existing corridors';
 el('tx24Selection').innerHTML=el('tx24Selection').innerHTML.replace('Expected reconductored corridors','Reconductored corridors').replace('Reconductoring share','Reconductoring state');
 const rr=txRows(state.hydrology);el('networkTable').innerHTML=tableHtml([{label:'Corridor',key:'corr'},{label:'Existing reconductoring',key:'rep'},{label:'New conventional',key:'nl',num:true},{label:'New reinforced',key:'nr',num:true}],rr.filter(r=>txMatch(r,detailState.corridor)).map(r=>({corr:r.FromNode.replace('Node_','')+'–'+r.ToNode.replace('Node_',''),rep:r.ReconductoringShare>.5?'✓':'—',nl:fmt0(r.ExpectedNewStandard),nr:fmt0(r.ExpectedNewReconductored)})));
 Plotly.relayout('tx24History',{'yaxis.title.text':'New circuits in service [count]'});Plotly.relayout('tx24Reconductoring',{'yaxis.title.text':detailState.corridor==='all'?'Reconductored corridors [count]':'Reconductoring state [%]'});
 }

 }

 if(state.tab==='costs'){
 const rr=D.national.costChartRows.filter(r=>r.Hydrology===state.hydrology&&r.Scenario===state.scenario);const terms=[['NewGenBuiltCost','Generation investment'],['NewLineBuiltCost','New conventional circuits'],['ExistingLineRepoweredCost','Reconductoring'],['RepoweredLineBuiltCost','New reinforced circuits'],['OpCostGen','Generation operation'],['FixedCosts','Fixed costs'],['EmissionCosts','Carbon cost'],['ReserveCosts','Reserve'],['PNSCost','ENS penalty'],['CurtailedCosts','Curtailment']];plot('costRunsResearch',terms.map(([k,name])=>({type:'bar',name,x:rr.map(r=>r.w),y:rr.map(r=>r[k])})),{barmode:'stack',xaxis:{title:'Realization'},yaxis:{title:'Discounted cost [MUSD]'},margin:{t:90},legend:{orientation:'h',y:1.2}},rr,'discounted_cost_components');
 }
}


function renderTransmissionBars(){
 const years=Array.from({length:26},(_,i)=>2025+i), cases=['Baseline','Adverse'];
 const actions=[['ReconductoringShare','Existing reconductoring','#2478a8'],['ExpectedNewStandard','New conventional circuits','#e39836'],['ExpectedNewReconductored','New reinforced circuits','#8555a8']];
 const records=[];
 const stock=(h,y,k)=>D.national.transmissionSelected.filter(r=>r.Scenario===state.scenario&&r.Hydrology===h&&r.Year===y&&txMatch(r,detailState.corridor)).reduce((a,r)=>a+Number(r[k]),0);
 const annual=cases.flatMap((h,i)=>actions.map(([k,label,color])=>({type:'bar',name:label,legendgroup:k,showlegend:i===0,x:years,y:years.map(y=>{const v=stock(h,y,k)-(y===2025?0:stock(h,y-1,k));records.push({Case:h,Year:y,Action:label,Additions:v});return v}),marker:{color},xaxis:i?'x2':'x',yaxis:i?'y2':'y',hovertemplate:h+'<br>%{x}: %{y}<extra>'+label+'</extra>'})));
 const layout={barmode:'stack',xaxis:{domain:[0,.46],title:'Year',dtick:5},xaxis2:{domain:[.54,1],title:'Year',anchor:'y2',dtick:5},yaxis:{title:'Additions [count]',rangemode:'tozero'},yaxis2:{anchor:'x2',matches:'y',title:'Additions [count]',rangemode:'tozero'},legend:{orientation:'h',y:1.2},margin:{t:100},annotations:cases.map((h,i)=>({xref:'paper',yref:'paper',x:i?.77:.23,y:1.06,text:h+' · '+s24(h).Representative_w,showarrow:false}))};
 el('txAnnualTitle').textContent='Annual transmission additions · '+state.scenario+' · selected realizations';
 plot('txAnnualBars',annual,layout,records,'annual_transmission_additions');
 const cum=[];const traces=actions.map(([k,label,color])=>({type:'bar',name:label,x:cases.flatMap(h=>[2025,2050].map(y=>h+' '+y)),y:cases.flatMap(h=>[2025,2050].map(y=>{const v=stock(h,y,k);cum.push({Case:h,Year:y,Action:label,Count:v});return v})),marker:{color}}));
 el('txCumulativeTitle').textContent='Cumulative transmission additions · '+state.scenario+' · selected realizations';
 plot('txCumulativeBars',traces,{barmode:'group',xaxis:{title:'Hydrological case and year'},yaxis:{title:'Cumulative count',rangemode:'tozero'},legend:{orientation:'h',y:1.18},margin:{t:90}},cum,'cumulative_transmission_additions');
}
function renderScores(){
 const rows=window.PARAMO_SCORE_INPUTS, keys=['cost_MUSD','cost_p90','CO2_Mt','renewable_share','ENS_GWh','ENS_positive_pct'];
 const scored=rows.map(r=>{const group=rows.filter(x=>x.campaign===r.campaign);const z=keys.map(k=>{const lo=Math.min(...group.map(x=>x[k])),hi=Math.max(...group.map(x=>x[k]));const v=hi===lo?0:(r[k]-lo)/(hi-lo);return k==='renewable_share'?1-v:v});return {...r,Economic:(z[0]+z[1])/6,Environmental:(z[2]+z[3])/6,Adequacy:(z[4]+z[5])/6}});
 const tr=['Economic','Environmental','Adequacy'].map((k,i)=>({type:'bar',name:k,x:scored.map(r=>r.campaign+' · '+r.policy),y:scored.map(r=>r[k]),marker:{color:['#6696ae','#73a187','#c5a26c'][i]}}));
 plot('weightedScores',tr,{barmode:'stack',xaxis:{title:'Hydrological case and policy pathway'},yaxis:{title:'Weighted score · lower is preferred',range:[0,1.12]},legend:{orientation:'h',y:1.16},margin:{t:80},annotations:scored.map(r=>({x:r.campaign+' · '+r.policy,y:r.Economic+r.Environmental+r.Adequacy,text:(r.Economic+r.Environmental+r.Adequacy).toFixed(3),showarrow:false,yshift:12}))},scored,'weighted_pathway_scores','Dimensionless score [0–1]');
 el('scoreInputs').innerHTML=tableHtml([{label:'Case',key:'campaign'},{label:'Pathway',key:'policy'},{label:'Mean cost [MUSD]',key:'cost_MUSD',num:true},{label:'P90 cost [MUSD]',key:'cost_p90',num:true},{label:'CO₂ [Mt]',key:'CO2_Mt',num:true},{label:'Renewable [%]',key:'renewable_share',num:true},{label:'ENS [GWh]',key:'ENS_GWh',num:true},{label:'Runs with ENS [%]',key:'ENS_positive_pct',num:true}],rows.map(r=>({...r,...Object.fromEntries(keys.map(k=>[k,fmt(r[k],3)]))})));
}


function contextLabel(stat=state.stat,h=state.hydrology,sc=state.scenario){
 return `${sc} · ${h} · ${stat==='Representative'?s24(h,sc).Representative_w:stat==='Mean'?'ensemble mean':stat+' across realizations'}`;
}
function chartScope(id,text){
 const card=el(id)?.closest('.chart-card');if(!card)return;
 let p=card.querySelector('.chart-scope');if(!p){p=document.createElement('p');p.className='chart-scope';card.querySelector('.chart-head').after(p);}p.textContent=text;
}
function renderCostEmissions(id){
 const rows=allConfigMetrics(),xs=rows.map(r=>r.cost),ys=rows.map(r=>r.co2);
 const xmin=Math.min(...xs)*.86,xmax=Math.max(...xs)*1.12,ymax=Math.max(...ys)*1.18;
 const traces=['Baseline','Adverse'].map((h,i)=>{const rr=rows.filter(r=>r.hydro===h);return {type:'scatter',mode:'markers+text',name:h,x:rr.map(r=>r.cost),y:rr.map(r=>r.co2),text:rr.map(r=>r.scenario),textposition:['top right','bottom left','bottom right'],customdata:rr.map(r=>[r.scenario,r.ens,h]),marker:{size:14,color:rr.map(r=>colorScenario(r.scenario))},xaxis:i?'x2':'x',yaxis:i?'y2':'y',showlegend:false,hovertemplate:'%{customdata[0]} · %{customdata[2]} · ensemble mean<br>Cost: %{x:,.1f} MUSD<br>CO₂: %{y:,.3f} Mt<br>ENS: %{customdata[1]:,.3f} GWh<extra></extra>'};});
 plot(id,traces,{xaxis:{domain:[0,.43],range:[xmin,xmax],title:'Discounted cost [MUSD]'},xaxis2:{domain:[.57,1],range:[xmin,xmax],title:'Discounted cost [MUSD]',anchor:'y2'},yaxis:{range:[0,ymax],title:'Cumulative CO₂ [Mt]',rangemode:'tozero'},yaxis2:{range:[0,ymax],matches:'y',anchor:'x2',overlaying:false,side:'left',title:'Cumulative CO₂ [Mt]'},margin:{l:65,r:35,t:55,b:65},annotations:['Baseline','Adverse'].map((h,i)=>({xref:'paper',yref:'paper',x:i?.79:.21,y:1.12,text:h,showarrow:false}))},rows,'cost_emissions_ens','2025–2050 · ensemble means');
 const title=el(id).closest('.chart-card').querySelector('.chart-title');title.textContent='Cost–emissions comparison · ENS on hover';
 chartScope(id,'REF, BRIDGE and NZT · shared axes · hover over a point for cumulative ENS. Point sizes are equal; no composite ranking is implied.');
}
function renderInterpretation(){
 let note=el('campaignContext');if(!note){note=document.createElement('p');note.id='campaignContext';note.className='detail-scope';el('overview').prepend(note);}
 el(state.tab)?.prepend(note);note.hidden=!is24()||!['overview','costs','emissions','reliability','network','hydrology','compare','scores'].includes(state.tab);note.textContent='Baseline and Adverse differ in hydropower availability, seasonal month assignments and certain operating and reserve costs. Their comparison reflects these combined assumptions.';
 document.querySelectorAll('.chart-scope').forEach(p=>p.hidden=!is24());
 if(!is24())return;
 const overviewCards=el('overviewKpis').querySelectorAll('.kpi-sub');if(overviewCards[2])overviewCards[2].textContent=contextLabel();if(overviewCards[4])overviewCards[4].textContent=contextLabel('Representative')+' · 2050';
 const fixed=['generationAnnual','generationMixYear','monthlyGeneration','operationReliability','annualOperation'];
 const statCharts=['capacityTrajectory','capacityAdditions','emissionAnnual','ensAnnual'];
 fixed.forEach(id=>chartScope(id,contextLabel('Representative')+' · selected realization'));
 statCharts.forEach(id=>chartScope(id,contextLabel()));
 ['overviewBars','ensCumulative','emissionCumulative','ensTradeoff'].forEach(id=>chartScope(id,'REF, BRIDGE and NZT · Baseline and Adverse · ensemble means over 2025–2050'));
 ['ensDistribution','emissionDistribution','costDistribution'].forEach(id=>chartScope(id,'REF, BRIDGE and NZT · Baseline and Adverse · medians (P50) and empirical P10–P90 ranges; 100 and 5 realizations respectively. Ranges are not confidence intervals.'));
 chartScope('costComponents','REF, BRIDGE and NZT · '+state.hydrology+' · ensemble means');
 if(['overview','costs','emissions'].includes(state.tab))renderCostEmissions({overview:'overviewTradeoff',costs:'performanceSpace',emissions:'emissionTradeoff'}[state.tab]);
 if(state.tab==='reliability'){
  const demand=window.PARAMO_DEMAND,den=demand.reduce((a,r)=>a+r.Demand_GWh,0);
  const m=summaryMetrics();
  el('reliabilityKpis').innerHTML=[kpi('Cumulative ENS',fmt(m.ens,3)+' GWh',contextLabel(),'red'),kpi('ENS / demand',fmt(100*m.ens/den,5)+'%','2025–2050 · demand '+fmt(den,1)+' GWh','gold'),kpi('Total cost',fmt(m.cost,1)+' MUSD',contextLabel(),'navy'),kpi('Detailed solution',s24().Representative_w,state.scenario+' · '+state.hydrology,'magenta')].join('');
  el('reliabilityInsight').textContent='ENS is a monthly energy deficit. Its share of demand describes its magnitude, not an acceptance threshold or the frequency and duration of interruptions. Selected realizations are chosen by cost and need not rank like ensemble means in ENS.';
  const stat=state.stat,rep=stat==='Representative';
  const rr=(rep?D.national.annualRep:D.national.annualEnsembleStats).filter(r=>r.Scenario===state.scenario&&r.Hydrology===state.hydrology).map(r=>{const e=r[rep?'PNS_GWh':stat+'ENS_GWh'],d=demand.filter(x=>x.Year===r.Year).reduce((a,x)=>a+x.Demand_GWh,0);return {Year:r.Year,ENS_GWh:e,Demand_GWh:d,ENS_pct:100*e/d};});
  plot('ensAnnual',[{type:'bar',name:contextLabel(),x:rr.map(r=>r.Year),y:rr.map(r=>r.ENS_GWh),customdata:rr.map(r=>[r.ENS_pct,r.Demand_GWh]),marker:{color:C.red},hovertemplate:'%{x}<br>ENS: %{y:,.3f} GWh<br>Demand: %{customdata[1]:,.1f} GWh<br>ENS / demand: %{customdata[0]:.5f}%<extra>%{fullData.name}</extra>'}],{xaxis:{title:'Year'},yaxis:{title:'Annual ENS [GWh]',rangemode:'tozero'}},rr,'annual_ens_demand');
  chartScope('ensAnnual',contextLabel()+' · hover for annual demand and ENS percentage');
 }
 if(state.tab==='network'){
  for(const id of ['tx24History','tx24Reconductoring','networkSecondary']){chartScope(id,state.scenario+' · Baseline / Adverse · '+(el('tx24Layer').value==='representative'?'selected plans '+s24('Baseline').Representative_w+' / '+s24('Adverse').Representative_w:'ensemble means'));}if(el('tx24Layer').value==='representative'){setChartUnit('tx24History','Selected plans · circuits in service');setChartUnit('tx24Reconductoring','Selected plans · reconductored corridors');setChartUnit('networkSecondary','Selected plan · new circuits in service');Plotly.relayout('networkSecondary',{'xaxis.title.text':'New circuits in service [count]'});chartScope('networkSecondary',contextLabel('Representative')+' · by '+state.year);}else{chartScope('networkSecondary',contextLabel('Mean')+' · by '+state.year);}
  chartScope('tx24Maps',state.scenario+' · cumulative states by '+state.year+' · '+(el('tx24Layer').value==='representative'?'Baseline '+s24('Baseline').Representative_w+' / Adverse '+s24('Adverse').Representative_w:'ensemble means: Baseline N=100 / Adverse N=5'));
  chartScope('transmissionCost',state.hydrology+' · ensemble means · existing-circuit reconductoring, new conventional circuits and new reinforced circuits');
  chartScope('txAnnualBars',state.scenario+' · Baseline '+s24('Baseline').Representative_w+' / Adverse '+s24('Adverse').Representative_w+' · additions commissioned in each year');
  chartScope('txCumulativeBars',state.scenario+' · Baseline '+s24('Baseline').Representative_w+' / Adverse '+s24('Adverse').Representative_w+' · cumulative additions by 2025 and 2050');
  el('networkNote').innerHTML+=' <br>Reconductoring upgrades existing circuits. New reinforced circuits are new construction. The displayed investment composition does not measure savings against a plan without reconductoring.';
 }
 if(state.tab==='scores')chartScope('weightedScores','Economic 1/3 · environmental 1/3 · supply adequacy 1/3; each of six indicators has weight 1/6. Normalization is separate within each case. Lower scores are preferred under these weights; absolute scores must not be compared across campaigns.');
}

try{if(typeof Plotly==='undefined')throw new Error('Plotly library not available.');if(!D)throw new Error('PARAMO public data bundle not available.');init()}catch(err){showRuntimeError(err)}
})();
