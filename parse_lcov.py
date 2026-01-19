import re
import json

# Read the lcov.info file
with open('coverage/lcov.info', 'r') as f:
    content = f.read()

# Split by end_of_record
records = content.split('end_of_record')

coverage_data = []

for record in records:
    lines = record.strip().split('\n')
    
    file = ""
    lf = 0
    lh = 0
    fnf = 0
    fnh = 0
    brf = 0
    brh = 0
    
    for line in lines:
        if line.startswith('SF:'):
            file = line[3:].strip()
        elif line.startswith('LF:'):
            lf = int(line[3:])
        elif line.startswith('LH:'):
            lh = int(line[3:])
        elif line.startswith('FNF:'):
            fnf = int(line[4:])
        elif line.startswith('FNH:'):
            fnh = int(line[4:])
        elif line.startswith('BRF:'):
            brf = int(line[4:])
        elif line.startswith('BRH:'):
            brh = int(line[4:])
    
    # Skip .spec.ts files and non-src/app files
    if file and '.spec.ts' not in file and file.startswith('src/app'):
        # Calculate percentages
        line_coverage = (lh / lf * 100) if lf > 0 else 0
        statement_coverage = line_coverage
        function_coverage = (fnh / fnf * 100) if fnf > 0 else 0
        branch_coverage = (brh / brf * 100) if brf > 0 else 0
        
        # Only include if coverage < 100%
        if line_coverage < 100:
            coverage_data.append({
                'file': file,
                'statements': round(statement_coverage, 1),
                'branches': round(branch_coverage, 1),
                'functions': round(function_coverage, 1),
                'lines': round(line_coverage, 1)
            })

# Sort by statements coverage
coverage_data.sort(key=lambda x: x['statements'])

# Output as JSON
print(json.dumps(coverage_data, indent=2))
