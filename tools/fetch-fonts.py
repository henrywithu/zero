import concurrent.futures,hashlib,json,os,re,urllib.request
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
css=open(root+'/research/original/google-fonts.css').read()
urls=set(re.findall(r'url\((https://[^)]+)\)',css))
def get(url):
 name=url.rsplit('/',1)[-1];dest=root+'/public/assets/fonts/'+name
 if not os.path.exists(dest):
  with urllib.request.urlopen(url,timeout=60)as r:open(dest,'wb').write(r.read())
 data=open(dest,'rb').read()
 return {'path':'assets/fonts/'+name,'source':url,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=6)as pool:results=list(pool.map(get,urls))
for url in urls:css=css.replace(url,'/assets/fonts/'+url.rsplit('/',1)[-1])
open(root+'/src/styles/fonts.css','w').write(css)
json.dump(results,open(root+'/research/font-manifest.json','w'),indent=2)
print('Downloaded',len(results),'font files,',sum(x['bytes']for x in results),'bytes')
