# show next queued brief; or mark done: slides_next.py done <url>
import json,sys,subprocess
Q='/home/claude/infohab/tools/data/slides_queue.json';q=json.load(open(Q))
nx=[x for x in q if not x['done']]
if len(sys.argv)>2 and sys.argv[1]=='done':
  x=nx[0];x['done']=sys.argv[2];json.dump(q,open(Q,'w'),ensure_ascii=False,indent=0)
  print(subprocess.run(['python3','/home/claude/infohab/tools/add_map_slide.py',x['map'],x['label'],sys.argv[2]],capture_output=True,text=True).stdout)
else:
  print(len(nx),'left');print(nx[0]['label'] if nx else 'EMPTY');print(nx[0]['brief'] if nx else '')
