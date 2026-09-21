param(
  [string]$Document = "",
  [string]$ProjectRoot = "D:\Web blog"
)

Add-Type -AssemblyName System.IO.Compression

if (-not $Document) {
  $Document = (Get-ChildItem -LiteralPath $ProjectRoot -Filter "*.docx" | Select-Object -First 1).FullName
}

$assetDirectory = Join-Path $ProjectRoot "assets\episodes"
[System.IO.Directory]::CreateDirectory($assetDirectory) | Out-Null

$stream = [System.IO.File]::Open($Document, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Read)

try {
  function Read-ZipXml([string]$path) {
    $entry = $archive.GetEntry($path)
    $reader = [System.IO.StreamReader]::new($entry.Open())
    try { return [xml]$reader.ReadToEnd() } finally { $reader.Dispose() }
  }

  $documentXml = Read-ZipXml "word/document.xml"
  $relationshipsXml = Read-ZipXml "word/_rels/document.xml.rels"

  $ns = [System.Xml.XmlNamespaceManager]::new($documentXml.NameTable)
  $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
  $ns.AddNamespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
  $ns.AddNamespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")

  $relationshipMap = @{}
  foreach ($relationship in $relationshipsXml.Relationships.Relationship) {
    $relationshipMap[$relationship.Id] = [string]$relationship.Target
  }

  $episodes = @()
  $current = $null
  $expectTitle = $false
  $imageIndex = 0

  foreach ($paragraph in $documentXml.SelectNodes("//w:body/w:p", $ns)) {
    $textParts = $paragraph.SelectNodes(".//w:t", $ns) | ForEach-Object { $_.'#text' }
    $paragraphText = ($textParts -join "").Trim()

    if ($paragraphText -match '^Topic\s+(\d+)$') {
      if ($null -ne $current) { $episodes += $current }
      $current = [ordered]@{ number = [int]$Matches[1]; title = ""; blocks = @() }
      $expectTitle = $true
      $imageIndex = 0
      continue
    }

    if ($null -eq $current) { continue }

    if ($expectTitle -and $paragraphText) {
      $current.title = $paragraphText
      $expectTitle = $false
      continue
    }

    if ($paragraphText) {
      $kind = if ($paragraphText -match '^https?://') { "source" } else { "paragraph" }
      $current.blocks += [ordered]@{ type = $kind; text = $paragraphText }
    }

    foreach ($blip in $paragraph.SelectNodes(".//a:blip", $ns)) {
      $relationshipId = $blip.GetAttribute("embed", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
      if (-not $relationshipId -or -not $relationshipMap.ContainsKey($relationshipId)) { continue }

      $target = $relationshipMap[$relationshipId] -replace '\\', '/'
      $zipPath = if ($target.StartsWith('/')) { $target.TrimStart('/') } else { "word/" + $target.TrimStart('./') }
      $mediaEntry = $archive.GetEntry($zipPath)
      if ($null -eq $mediaEntry) { continue }

      $imageIndex++
      $extension = [System.IO.Path]::GetExtension($mediaEntry.Name).ToLowerInvariant()
      if (-not $extension) { $extension = ".bin" }
      $filename = "episode-{0:D2}-{1:D2}{2}" -f $current.number, $imageIndex, $extension
      $destination = Join-Path $assetDirectory $filename

      $inputStream = $mediaEntry.Open()
      $outputStream = [System.IO.File]::Create($destination)
      try { $inputStream.CopyTo($outputStream) } finally { $outputStream.Dispose(); $inputStream.Dispose() }

      $current.blocks += [ordered]@{ type = "image"; src = "assets/episodes/$filename" }
    }
  }

  if ($null -ne $current) { $episodes += $current }

  $json = $episodes | ConvertTo-Json -Depth 8 -Compress
  $javascript = "window.EPISODE_CONTENT = $json;"
  $encoding = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllText((Join-Path $ProjectRoot "episode-content.js"), $javascript, $encoding)

  Write-Output ("Extracted {0} episodes and {1} ordered images." -f $episodes.Count, ($episodes.blocks | Where-Object { $_.type -eq 'image' }).Count)
}
finally {
  $archive.Dispose()
  $stream.Dispose()
}
