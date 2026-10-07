import concurrent.futures, hashlib, json, os, re, urllib.request, urllib.parse
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source=open(root+'/research/original/main.js').read()
paths=set(json.load(open(root+'/research/asset-paths.json')))
paths.update(re.findall(r'assets/[^`\s"\'${}<>]+\.(?:mp3|svg|webp|png|jpg|otf|glb|ktx2|mp4)',source))
paths.update(urllib.parse.unquote(p.lstrip('/')) for p in re.findall(r'url\(([^)]+)\)',open(root+'/research/original/main.css').read()))
for r in json.load(open(root+'/research/captures/requests.json')):
 if r['url'].startswith('https://why.zero.university/'):
  p=urllib.parse.unquote(urllib.parse.urlparse(r['url']).path.lstrip('/'))
  if not p.endswith(('.js','.css')): paths.add(p)
for name in ['angelfish','cat','dog','dolphin','elephant','fox','goldfish','rhino','seal','wolf']:
 paths.update([f'assets/origami/{name}.glb',f'assets/origami/ao/{name}.webp'])
for company in ['nike','openai','google','spotify']:paths.add(f'assets/logos/companies/{company}.webp')
for name in ['python','jupyter','notebook','pandas','cursor','codex','canva','googlesheets','googleslides','nextjs','vercel','supabase','gemini','anthropic']:paths.add(f'assets/logos/tools/{name}.svg')
paths.update(['assets/videos/'+p for p in ['Nike-Card.mp4','ChatGPT-Card.mp4','Google-Card.mp4','Spotify-Card.mp4','star_animation_480.mp4','star_animation_720.mp4']])
paths.update(['assets/brand/favicon.svg','assets/brand/favicon.png','assets/brand/apple-touch-icon.png','assets/brand/nav_logo.svg','assets/brand/og_image.jpg','assets/ui/share-card_congrats.webp','assets/ui/company_card_dummy.svg','vendor/draco/draco_decoder.js','vendor/draco/draco_wasm_wrapper.js','vendor/draco/draco_decoder.wasm','vendor/basis/basis_transcoder.js','vendor/basis/basis_transcoder.wasm'])
paths={p for p in paths if p and not p.endswith('/') and '${' not in p}
def fetch(p):
 dest=root+'/public/'+p;os.makedirs(os.path.dirname(dest),exist_ok=True)
 try:
  if os.path.exists(dest):data=open(dest,'rb').read()
  else:
   url='https://why.zero.university/'+urllib.parse.quote(p,safe='/')
   with urllib.request.urlopen(url,timeout=90) as r:data=r.read()
   if data.lstrip().startswith(b'<!doctype'):return {'path':p,'error':'HTML returned'}
   open(dest,'wb').write(data)
  result={'path':p,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'source':'https://why.zero.university/'+urllib.parse.quote(p,safe='/')}
  print(p,len(data),flush=True);return result
 except Exception as e:print('FAILED',p,str(e),flush=True);return {'path':p,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:results=list(pool.map(fetch,sorted(paths)))
json.dump(results,open(root+'/research/asset-manifest.json','w'),indent=2)
print('TOTAL',sum(r.get('bytes',0) for r in results),'FAILED',sum('error'in r for r in results))
