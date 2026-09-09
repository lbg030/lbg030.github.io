"""Build the public CV from the website's shared content. Requires reportlab."""
import json
import shutil
import subprocess
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak

ROOT = Path(__file__).resolve().parent.parent
data = json.loads(subprocess.check_output([
    'node', '--input-type=module', '-e',
    'import * as data from "./data/portfolio.mjs"; console.log(JSON.stringify(data));'
], cwd=ROOT, text=True))
OUT = ROOT / 'output/pdf'
OUT.mkdir(parents=True, exist_ok=True)
target = ROOT / 'cv/cv.pdf'
backup = OUT / 'cv-before-refresh.pdf'
if target.exists() and not backup.exists():
    shutil.copy2(target, backup)

ink, teal, muted = colors.HexColor('#172e30'), colors.HexColor('#17685b'), colors.HexColor('#526360')
styles = {
    'name': ParagraphStyle('Name', fontName='Helvetica-Bold', fontSize=25, leading=29, textColor=ink, spaceAfter=7),
    'role': ParagraphStyle('Role', fontName='Helvetica', fontSize=12, leading=16, textColor=teal, spaceAfter=7),
    'section': ParagraphStyle('Section', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=teal, spaceBefore=15, spaceAfter=9),
    'title': ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=9.7, leading=13, textColor=ink, spaceAfter=3),
    'body': ParagraphStyle('Body', fontName='Helvetica', fontSize=9, leading=12.5, textColor=ink, spaceAfter=4),
    'small': ParagraphStyle('Small', fontName='Helvetica', fontSize=8.2, leading=11, textColor=muted, spaceAfter=4),
}
def clean(text):
    return escape(str(text).replace('–', '-').replace('—', '-').replace('→', 'to'))

def p(text, style='body'):
    return Paragraph(clean(text), styles[style])

def href(label, url):
    return f'<a href="{escape(url, {chr(34): "&quot;"})}" color="#17685b">{clean(label)}</a>'

story = []
def section(text):
    story.append(p(text.upper(), 'section'))

def record(title, date, details):
    row = Table([[p(title, 'title'), p(date, 'small')]], colWidths=[340, 159])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
    story.append(KeepTogether([row] + [p(t) for t in details] + [Spacer(1,6)]))

def publication(item):
    parts = [p(item['title'], 'title')]
    if item.get('authors'):
        parts.append(p(item['authors'], 'small'))
    parts.append(p(f"{item['venue']} | {item['status']} | {item['role']}", 'body'))
    paper = [href(label, url) for label, url in item['links'] if label in ['Paper', 'arXiv']]
    if paper:
        parts.append(Paragraph(' / '.join(paper), styles['small']))
    story.append(KeepTogether(parts + [Spacer(1,7)]))

profile = data['profile']
story += [p(profile['name'], 'name'), p(profile['role'], 'role')]
story.append(Paragraph(' | '.join([href(profile['email'], 'mailto:'+profile['email']),href('Portfolio','https://lbg030.github.io/'),href('GitHub','https://github.com/lbg030')]), styles['small']))
story += [p('lbg030@dgu.ac.kr | +82-10-4949-9224', 'small'), p(profile['fields'], 'body')]
section('Experience')
for e in data['experience']:
    record(e['organization'], e['date'], [e['role']] + ([e['description']] if e.get('description') else []))
section('Education')
for i, e in enumerate(data['education']):
    details = [e['degree'] + (' | GPA: 4.5 / 4.5' if i == 0 else ' | GPA: 3.68 / 4.5')]
    if e.get('description'):
        details.extend([e['description'],e['thesis']])
    record(e['organization'],e['date'],details)
section('Publications - Published / Accepted')
for item in data['publications']:
    if item['status'] == 'Published':
        publication(item)

story.append(PageBreak())
section('Manuscripts - Under Review')
story.append(p('The following manuscripts are under review and have not been accepted for publication.', 'small'))
for item in data['publications']:
    if item['status'] == 'Under Review':
        publication(item)
section('Research projects')
for item in data['projects']:
    record(item['fullTitle'],item['date'],[item['organization']+' | Core researcher',item['approach'],item['contribution'],item['result']])
section('Patents & professional service')
story += [p('System and Method for 3D Modeling Using Online Multi-view Stereo', 'title'),
          p('Korean patent application and PCT international patent application. Principal inventor.'),
          p('IEEE Access - Peer Reviewer | Nov. 2025 - Present')]
section('Awards & recognition')
story += [p('Dongguk University graduate school fair - Outstanding Research Award, 2025.'),
          p('Research featured in the Dongguk University graduate school newsletter, 2025.'),
          p('M.S. GPA: 4.5 / 4.5 throughout the degree, 2024 - 2026.')]
section('Technical skills')
story += [p('Programming: Python, PyTorch, C/C++, CUDA, Shell scripting.'),
          p('3D vision: Gaussian Splatting, Multi-View Stereo, SLAM, depth estimation, bundle adjustment, COLMAP, OpenMVS.'),
          p('2D vision: Object detection, image segmentation, keypoint detection, few-shot learning, defect inspection.'),
          p('Infrastructure: Linux, Git, Docker, Kubernetes.')]

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor('#d9dfd8'))
    canvas.line(48,36,A4[0]-48,36)
    canvas.setFont('Helvetica',8)
    canvas.setFillColor(muted)
    canvas.drawString(48,24,profile['name']+' | Research CV')
    canvas.drawRightString(A4[0]-48,24,str(doc.page))
    canvas.restoreState()

doc = SimpleDocTemplate(str(target), pagesize=A4, leftMargin=48, rightMargin=48, topMargin=40, bottomMargin=48, title=profile['name']+' - Research CV', author=profile['name'])
doc.build(story,onFirstPage=footer,onLaterPages=footer)
shutil.copy2(target,OUT / 'cv.pdf')
print(f'Generated {target.relative_to(ROOT)} from shared portfolio data.')
