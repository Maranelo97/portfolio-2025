$content = Get-Content "coverage/lcov.info" -Raw
$lines = $content -split "`n"

$files = @()
$currentFile = $null

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i].Trim()
    
    if ($line.StartsWith("SF:")) {
        $filepath = $line.Substring(3)
        if (-not $filepath.EndsWith(".spec.ts") -and $filepath -match "^src\\app\\") {
            $currentFile = @{
                file = $filepath
                fnf = 0; fnh = 0; lf = 0; lh = 0; brf = 0; brh = 0
            }
        } else {
            $currentFile = $null
        }
    }
    elseif ($currentFile) {
        if ($line.StartsWith("FNF:")) { $currentFile.fnf = [int]$line.Substring(4) }
        elseif ($line.StartsWith("FNH:")) { $currentFile.fnh = [int]$line.Substring(4) }
        elseif ($line.StartsWith("LF:")) { $currentFile.lf = [int]$line.Substring(3) }
        elseif ($line.StartsWith("LH:")) { $currentFile.lh = [int]$line.Substring(3) }
        elseif ($line.StartsWith("BRF:")) { $currentFile.brf = [int]$line.Substring(4) }
        elseif ($line.StartsWith("BRH:")) { $currentFile.brh = [int]$line.Substring(4) }
        elseif ($line -eq "end_of_record") {
            $files += $currentFile
            $currentFile = $null
        }
    }
}

$results = @()
foreach ($f in $files) {
    $stmt = if ($f.lf -gt 0) { [math]::Round(($f.lh / $f.lf) * 100, 2) } else { 100 }
    $branch = if ($f.brf -gt 0) { [math]::Round(($f.brh / $f.brf) * 100, 2) } else { 100 }
    $func = if ($f.fnf -gt 0) { [math]::Round(($f.fnh / $f.fnf) * 100, 2) } else { 100 }
    $linesC = if ($f.lf -gt 0) { [math]::Round(($f.lh / $f.lf) * 100, 2) } else { 100 }
    $score = ($stmt + $branch + $func + $linesC) / 4
    
    $results += @{
        file = $f.file.Replace('\', '/'); statements = $stmt; branches = $branch; functions = $func; lines = $linesC; score = $score
    }
}

$topWorst = $results | Sort-Object score | Select-Object -First 10

$json = @()
foreach ($r in $topWorst) {
    $json += [PSCustomObject]@{
        file = $r.file
        statements = $r.statements
        branches = $r.branches
        functions = $r.functions
        lines = $r.lines
    }
}

$json | ConvertTo-Json
