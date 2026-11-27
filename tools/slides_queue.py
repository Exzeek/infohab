# Будує чергу брифів для Canva з даних островів: python3 slides_queue.py <map> <cls> <n1> <n2>
import sys,re,json,os
mid,cls,a,b=sys.argv[1],int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4])
Q='/home/claude/infohab/tools/data/slides_queue.json'
q=json.load(open(Q)) if os.path.exists(Q) else []
HERO={2:('Карта року з Дослідиком','дружній робот Дослідик','Острів'),3:('Щоденник відкриттів Тимка','хлопчик Тимко і робот-помічник','Сторінка'),4:('Цифровий музей Сортика','робот Сортик — екскурсовод музею','Зала')}[cls]
CODE={2:'2101',3:'3101',4:'4101'}[cls]
cl=lambda t:re.sub(r'<[^>]+>','',t)
for n in range(a,b+1):
  p=f'/home/claude/infohab/a/{mid}/t{n:02d}.html'
  if not os.path.exists(p):continue
  G=json.loads(re.search(r'^window\.G = (.*);\s*$',open(p).read(),re.M).group(1))
  label=f'{HERO[2]} {n} — Canva-презентація'
  if any(x['label']==label and x['map']==mid for x in q):continue
  st='; '.join(f"«{x['name']}»" for x in G['stages'])
  brief=(f"Презентація українською для вчителя інформатики, {cls} клас, урок 15 хв. {HERO[2]} {n}: «{cl(G['title'])}» (гра «{HERO[0]}», герой — {HERO[1]}). "
   f"Яскравий дитячий стиль, великий текст, мінімум слів, 3D-ілюстрації з героєм. Слайди: титул ({HERO[2].lower()} {n}, тема-питання); "
   f"розминка — 2 питання з минулої теми; пояснення: {cl(G['intro'])[:400]}; що дізнаємося: {', '.join(cl(x) for x in G.get('learn',[]))}; "
   f"слайд «Передбач» з простою ситуацією з теми і відповідь на наступному слайді; завдання на уроці: {st}; "
   f"підсумок: {cl(G['finale'].get('learnt',''))[:300]}; місія — пройти {HERO[2].lower()} {n} на сайті urokinfo.com.ua (код {CODE}).")
  q.append({'map':mid,'label':label,'brief':brief[:1900],'done':None})
json.dump(q,open(Q,'w'),ensure_ascii=False,indent=0);print(len(q),'in queue')
