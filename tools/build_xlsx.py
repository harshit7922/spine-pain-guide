"""Builds research/spine-knowledge-base.xlsx from research/spine-knowledge-base.json.
Run after tools/export_kb.js:   python3 tools/build_xlsx.py
"""
import json, os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(HERE, '..', 'research')
K = json.load(open(os.path.join(RES, 'spine-knowledge-base.json'), encoding='utf-8'))
C = K['common']
en = lambda o: (o or {}).get('en', '') if isinstance(o, dict) else (o or '')
hi = lambda o: (o or {}).get('hi', '') if isinstance(o, dict) else ''
MODNAME = {m['id']: en(m['tag']) or m['id'] for m in K['modules']}


def rule(r):
    """Turns the rule language into readable text."""
    if r is None: return ''
    if isinstance(r, str): return r
    if 'any' in r: return '(' + ' OR '.join(rule(x) for x in r['any']) + ')'
    if 'all' in r: return '(' + ' AND '.join(rule(x) for x in r['all']) + ')'
    if 'not' in r: return 'NOT ' + rule(r['not'])
    if 'painGte' in r: return f"pain ≥ {r['painGte']}"
    if 'atLeast' in r: n, xs = r['atLeast']; return f"at least {n} of (" + ', '.join(rule(x) for x in xs) + ')'
    if 'ageGte' in r: return f"age ≥ {r['ageGte']}"
    return json.dumps(r, ensure_ascii=False)


wb = Workbook(); FN = 'Arial'
hf = Font(name=FN, bold=True, color='FFFFFF'); hfill = PatternFill('solid', fgColor='0E6A64')
bf = Font(name=FN, size=10); thin = Side(style='thin', color='D0D7DE')
LVFILL = {'red': 'F8D7DA', 'orange': 'FDE5CC', 'yellow': 'FFF4C2', 'green': 'D8F0E0'}


def sheet(name, headers, rows, widths, fill_col=None):
    ws = wb.create_sheet(name); ws.append(headers)
    for r in rows: ws.append(list(r))
    for c in ws[1]:
        c.font = hf; c.fill = hfill; c.alignment = Alignment(vertical='center', wrap_text=True)
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.font = bf; c.alignment = Alignment(vertical='top', wrap_text=True); c.border = Border(bottom=thin)
        if fill_col is not None:
            v = row[fill_col].value
            if v in LVFILL: row[fill_col].fill = PatternFill('solid', fgColor=LVFILL[v])
    for i, w in enumerate(widths, 1): ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'C2' if len(headers) > 3 else 'B2'; ws.auto_filter.ref = ws.dimensions
    ws.row_dimensions[1].height = 30
    return ws


# ---------- README ----------
ws = wb.active; ws.title = 'README'
SHEETS = ['Modules', 'Conditions', 'Scoring weights', 'Urgency rules', 'Urgency levels', 'Emergencies', 'Red flags', 'Body areas',
          'Bedside tests', 'Nerve roots', 'Departments', 'Statistics', 'Sources']
rows = [(K['meta']['title'], None), (f"Version {K['meta']['version']} · exported {K['meta']['exported']} · English + Hindi", None), ('', None),
        (K['meta']['disclaimer'], None), ('', None), ('How the calculation works', None)]
rows += [('• ' + t, None) for t in K['meta']['howScoringWorks']]
rows += [('', None), ('Where this comes from', None),
         ('The website reads the files in site/data/*.js. This workbook and spine-knowledge-base.json are exports of those same files (tools/export_kb.js → tools/build_xlsx.py).', None),
         ('To change the research: edit the data file, reload the site, then re-run both export tools so this workbook matches.', None),
         ('', None), ('Sheet', 'Rows')]
for s in SHEETS: rows.append((s, f"=COUNTA('{s}'!A:A)-1"))
rows.append(('Total rows', None))
for r in rows: ws.append(list(r))
start = len(rows) - len(SHEETS)
ws.cell(row=len(rows), column=2, value=f'=SUM(B{start}:B{len(rows) - 1})')
ws.column_dimensions['A'].width = 120; ws.column_dimensions['B'].width = 10
for row in ws.iter_rows():
    for c in row: c.font = bf; c.alignment = Alignment(wrap_text=True, vertical='top')
ws['A1'].font = Font(name=FN, bold=True, size=14); ws['A4'].font = Font(name=FN, bold=True, color='9A3412')
for r in (6, 6 + len(K['meta']['howScoringWorks']) + 2, start - 1, len(rows)):
    ws.cell(row=r, column=1).font = Font(name=FN, bold=True); ws.cell(row=r, column=2).font = Font(name=FN, bold=True)

# ---------- Modules ----------
sheet('Modules', ['Module', 'Report title (EN)', 'Report title (HI)', 'Conditions', 'Emergencies', 'Body areas', 'Bedside tests', 'Sources added'],
      [(m['id'], en(m['title']), hi(m['title']), len(m['conditions']), len(m['emergencies']), len(m['areas']), len(m['bedsideTests']), ', '.join(m['sourcesAddedByModule']))
       for m in K['modules']], [12, 36, 36, 12, 12, 12, 12, 40])

# ---------- Conditions ----------
rows = []
for m in K['modules']:
    for c in m['conditions']:
        t = c['thresholds']
        rows.append((m['id'], c['id'], en(c['name']), hi(c['name']), c['scientific'], t[0], t[1], t[2], ', '.join(c['anchors']),
                     'yes' if c['rare'] else '', rule(c['onlyIf']), ', '.join(d if isinstance(d, str) else d['id'] + ' [if ' + rule(d.get('when')) + ']' for d in c['departments']), en(c['what']), hi(c['what']), en(c['causes']), en(c['confirm']),
                     en(c['treat']) if not isinstance(c['treat'], list) else ' | '.join(en(x) for x in c['treat']), en(c['outlook'])))
sheet('Conditions', ['Module', 'ID', 'Condition (EN)', 'Condition (HI)', 'Scientific name', 'Strong ≥', 'Moderate ≥', 'Possible ≥', 'Anchor features',
                     'Rare (rule out)', 'Only if', 'Departments', 'What it is (EN)', 'What it is (HI)', 'Causes (EN)', 'How doctors confirm (EN)', 'Treatment (EN)', 'Outlook (EN)'],
      rows, [10, 12, 36, 36, 30, 9, 10, 10, 26, 9, 16, 26, 60, 60, 60, 60, 60, 60])

# ---------- Scoring weights ----------
rows = []
for m in K['modules']:
    for c in m['conditions']:
        for w in sorted(c['weights'], key=lambda w: -w['weight']):
            rows.append((m['id'], c['id'], en(c['name']), w['feature'], en(w['label']), hi(w['label']), w['weight']))
sheet('Scoring weights', ['Module', 'Condition ID', 'Condition', 'Feature', 'Feature meaning (EN)', 'Feature meaning (HI)', 'Weight'], rows, [10, 12, 36, 16, 44, 44, 9])

# ---------- Urgency rules ----------
rows = []
for m in K['modules']:
    for e in m['emergencies']:
        rows.append((m['id'], 'red', 'EMERG_' + e['id'], en(e['name']), hi(e['name']), rule(e['when'])))
    for lv in ('orange', 'yellow'):
        for u in m['urgency'].get(lv, []):
            rows.append((m['id'], lv, u['reason'], en(u['text']), hi(u['text']), rule(u['when'])))
    rows.append((m['id'], 'green', 'g_ok', en(C['urgencyReasons'].get('g_ok')), hi(C['urgencyReasons'].get('g_ok')), 'none of the above'))
sheet('Urgency rules', ['Module', 'Level', 'Reason ID', 'Reason (EN)', 'Reason (HI)', 'Rule'], rows, [10, 9, 16, 50, 50, 70], fill_col=1)
sheet('Urgency levels', ['Level', 'Meaning (EN)', 'Meaning (HI)', 'What to do (EN)', 'What to do (HI)'],
      [(k, en(v.get('title')), hi(v.get('title')), en(v.get('act')), hi(v.get('act'))) for k, v in C['levels'].items()], [10, 40, 40, 70, 70], fill_col=0)

# ---------- Emergencies ----------
sheet('Emergencies', ['Module', 'ID', 'Emergency (EN)', 'Emergency (HI)', 'Scientific', 'What it is (EN)', 'Triggered when'],
      [(m['id'], e['id'], en(e['name']), hi(e['name']), e['scientific'], en(e['what']), rule(e['when'])) for m in K['modules'] for e in m['emergencies']],
      [10, 10, 34, 34, 34, 70, 40])

# ---------- Red flags ----------
sheet('Red flags', ['Module', 'Feature', 'Question (EN)', 'Question (HI)'],
      [(m['id'], r['id'], en(r['label']), hi(r['label'])) for m in K['modules'] for r in m['redFlags']], [10, 16, 70, 70])

# ---------- Body areas ----------
sheet('Body areas', ['Module', 'Feature', 'Area (EN)', 'Area (HI)', 'Left/right asked', 'Nerve root code'],
      [(m['id'], a['id'], en(a['name']), hi(a['name']), 'yes' if a['paired'] else '', a['code'] or '') for m in K['modules'] for a in m['areas']], [10, 16, 40, 40, 12, 12])

# ---------- Bedside tests ----------
sheet('Bedside tests', ['Module', 'Test', 'Name (EN)', 'Name (HI)', 'How to do it (EN)', 'Positive means (EN)', 'Accuracy (EN)', 'Source', 'Answer features'],
      [(m['id'], t['id'], en(t['name']), hi(t['name']), ' '.join(en(s) for s in (t['steps'] or [])), en(t['positiveMeans']), en(t['accuracy']), t['source'], ', '.join(t['answers']))
       for m in K['modules'] for t in m['bedsideTests']], [10, 8, 34, 34, 60, 40, 50, 10, 30])

# ---------- Nerve roots ----------
rows = []
for m in K['modules']:
    for r, d in m['nerveRoots'].items():
        rows.append((m['id'], r, d.get('disc') or m['discOfRoot'].get(r, ''), en(d.get('skin')), en(d.get('mus')), en(d.get('ref')), en(d.get('test')), hi(d.get('skin'))))
    for rr in m['rootRules']:
        rows.append((m['id'], rr['root'], '(rule)', 'Root picked when: ' + rule(rr['when']), '', '', '', ''))
sheet('Nerve roots', ['Module', 'Root', 'Usual disc', 'Skin area (EN)', 'Muscles (EN)', 'Reflex (EN)', 'Self-test (EN)', 'Skin area (HI)'], rows, [10, 8, 12, 44, 44, 30, 40, 44])

# ---------- Departments ----------
sheet('Departments', ['ID', 'Department (EN)', 'Department (HI)', 'When to go (EN)', 'When to go (HI)'],
      [(k, en(d.get('n')), hi(d.get('n')), en(d.get('s')), hi(d.get('s'))) for k, d in C['departments'].items()], [14, 34, 34, 70, 70])

# ---------- Statistics ----------
sheet('Statistics', ['Value', 'Statistic (EN)', 'Statistic (HI)', 'Source'],
      [(s['v'], en(s['t']), hi(s['t']), s.get('s', '')) for s in C['statistics']], [12, 70, 70, 12])

# ---------- Glossary ----------
sheet('Glossary', ['ID', 'Term (EN)', 'Term (HI)', 'Words that open it (EN)', 'Words that open it (HI)', 'Plain meaning (EN)', 'Plain meaning (HI)', 'Picture', 'Sources'],
      [(g['id'], en(g['title']), hi(g['title']), ', '.join(g['terms'].get('en', [])), ', '.join(g['terms'].get('hi', [])), en(g['plain']), hi(g['plain']), g.get('picture') or '', ', '.join(g.get('sources') or [])) for g in C.get('glossary', [])], [12, 30, 30, 34, 34, 70, 70, 9, 16])

# ---------- Sources ----------
sheet('Sources', ['#', 'Key', 'Source', 'URL'], [(i + 1, s['key'], s['title'], s['url']) for i, s in enumerate(C['sources'])], [5, 12, 80, 70])

out = os.path.join(RES, 'spine-knowledge-base.xlsx'); wb.save(out); print('saved', out)
