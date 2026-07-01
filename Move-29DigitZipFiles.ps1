<#
.SYNOPSIS
Finds ZIP files whose file name is exactly 29 digits and moves them into one folder.

.DESCRIPTION
The script prompts for:
  1. The drive or folder to search.
  2. The collection folder name. Press Enter to use the computer name.
  3. Where to save that collection folder. Press Enter to save it in the search root.

Only files matching this shape are moved:
  12345678901234567890123456789.zip

Folders that cannot be read are skipped, reparse points are not followed, and existing
destination files are overwritten when a matching source file has the same name.

.EXAMPLE
.\Move-29DigitZipFiles.ps1

.EXAMPLE
.\Move-29DigitZipFiles.ps1 -SearchRoot E:\ -UseComputerName -Force

.EXAMPLE
.\Move-29DigitZipFiles.ps1 -SearchRoot D:\Backups -FolderName CollectedZips -DestinationParent D:\ -Force
#>

[CmdletBinding()]
param(
    [string]$SearchRoot,
    [string]$DestinationParent,
    [string]$FolderName,
    [switch]$UseComputerName,
    [switch]$Force,
    [switch]$NoLog
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

function Read-WithDefault {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Prompt,

        [Parameter(Mandatory = $true)]
        [string]$Default
    )

    $value = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($value)) {
        return $Default
    }

    return $value.Trim()
}

function Resolve-ExistingDirectory {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $resolved = Resolve-Path -LiteralPath $Path -ErrorAction Stop
    $providerPath = $resolved.ProviderPath
    if (-not (Test-Path -LiteralPath $providerPath -PathType Container)) {
        throw "$Label is not a folder: $providerPath"
    }

    return [System.IO.Path]::GetFullPath($providerPath)
}

function Get-UnresolvedFullPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    return [System.IO.Path]::GetFullPath(
        $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Path)
    )
}

function Test-SameOrUnderPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Parent
    )

    $fullPath = [System.IO.Path]::GetFullPath($Path).TrimEnd('\', '/')
    $fullParent = [System.IO.Path]::GetFullPath($Parent).TrimEnd('\', '/')

    if ([string]::Equals($fullPath, $fullParent, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $true
    }

    $separator = [System.IO.Path]::DirectorySeparatorChar
    return ($fullPath + $separator).StartsWith(
        $fullParent + $separator,
        [System.StringComparison]::OrdinalIgnoreCase
    )
}

function Assert-ValidFolderName {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    if ([string]::IsNullOrWhiteSpace($Name)) {
        throw 'The collection folder name cannot be blank.'
    }

    $invalidChars = [System.IO.Path]::GetInvalidFileNameChars()
    if ($Name.IndexOfAny($invalidChars) -ge 0) {
        throw "The collection folder name contains invalid characters: $Name"
    }

    if ($Name -eq '.' -or $Name -eq '..') {
        throw "The collection folder name is not valid: $Name"
    }
}

function Move-FileWithOverwrite {
    param(
        [Parameter(Mandatory = $true)]
        [string]$SourcePath,

        [Parameter(Mandatory = $true)]
        [string]$DestinationPath
    )

    $sourceFullPath = [System.IO.Path]::GetFullPath($SourcePath)
    $destinationFullPath = [System.IO.Path]::GetFullPath($DestinationPath)
    if ([string]::Equals($sourceFullPath, $destinationFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        return 'SkippedSameFile'
    }

    $backupPath = $null
    $destinationExisted = Test-Path -LiteralPath $DestinationPath -PathType Leaf
    if ($destinationExisted) {
        $destinationDirectory = [System.IO.Path]::GetDirectoryName($DestinationPath)
        $backupPath = Join-Path -Path $destinationDirectory -ChildPath ('.overwrite-backup-{0}.tmp' -f [System.Guid]::NewGuid().ToString('N'))
        [System.IO.File]::Move($DestinationPath, $backupPath)
    }

    try {
        [System.IO.File]::Move($SourcePath, $DestinationPath)

        if ($backupPath -and (Test-Path -LiteralPath $backupPath -PathType Leaf)) {
            [System.IO.File]::SetAttributes($backupPath, [System.IO.FileAttributes]::Normal)
            [System.IO.File]::Delete($backupPath)
        }

        if ($destinationExisted) {
            return 'Overwrote'
        }

        return 'Moved'
    }
    catch {
        $moveError = $_.Exception

        if ($backupPath -and (Test-Path -LiteralPath $backupPath -PathType Leaf)) {
            try {
                if (-not (Test-Path -LiteralPath $DestinationPath -PathType Leaf)) {
                    [System.IO.File]::Move($backupPath, $DestinationPath)
                }
            }
            catch {
                throw "Move failed ($($moveError.Message)) and restoring the existing destination also failed: $($_.Exception.Message)"
            }
        }

        throw $moveError
    }
}

function ConvertTo-CsvField {
    param(
        [AllowNull()]
        [string]$Value
    )

    if ($null -eq $Value) {
        $Value = ''
    }

    return '"' + $Value.Replace('"', '""') + '"'
}

function Write-LogRow {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.StreamWriter]$Writer,

        [Parameter(Mandatory = $true)]
        [string]$Status,

        [AllowNull()]
        [string]$Source,

        [AllowNull()]
        [string]$Destination,

        [AllowNull()]
        [string]$Message
    )

    $fields = @(
        (ConvertTo-CsvField $Status),
        (ConvertTo-CsvField $Source),
        (ConvertTo-CsvField $Destination),
        (ConvertTo-CsvField $Message)
    )
    $Writer.WriteLine(($fields -join ','))
}

function Get-SkippedZipDescription {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,

        [Parameter(Mandatory = $true)]
        [string]$BaseName
    )

    $fileName = [System.IO.Path]::GetFileName($FilePath)
    $digitCount = [System.Text.RegularExpressions.Regex]::Matches($BaseName, '\d').Count

    if ($BaseName.Length -ne 29) {
        return '{0} (base name length is {1}, digit count is {2})' -f $fileName, $BaseName.Length, $digitCount
    }

    return '{0} (base name length is 29, but it contains non-digit characters)' -f $fileName
}

$defaultSearchRoot = [System.IO.Path]::GetPathRoot((Get-Location).Path)
if ([string]::IsNullOrWhiteSpace($SearchRoot)) {
    $SearchRoot = Read-WithDefault -Prompt 'Drive or folder to search' -Default $defaultSearchRoot
}

$SearchRoot = Resolve-ExistingDirectory -Path $SearchRoot -Label 'Search root'

if ($UseComputerName) {
    $FolderName = $env:COMPUTERNAME
}
elseif ([string]::IsNullOrWhiteSpace($FolderName)) {
    $FolderName = Read-WithDefault -Prompt 'Collection folder name; press Enter for computer name' -Default $env:COMPUTERNAME
}

$FolderName = $FolderName.Trim()
Assert-ValidFolderName -Name $FolderName

if ([string]::IsNullOrWhiteSpace($DestinationParent)) {
    $DestinationParent = Read-WithDefault -Prompt 'Where should the collection folder be saved' -Default $SearchRoot
}

$DestinationParent = Get-UnresolvedFullPath -Path $DestinationParent
if (-not (Test-Path -LiteralPath $DestinationParent -PathType Container)) {
    New-Item -ItemType Directory -Path $DestinationParent -Force | Out-Null
}

$DestinationParent = Resolve-ExistingDirectory -Path $DestinationParent -Label 'Destination parent'
$TargetDirectory = Join-Path -Path $DestinationParent -ChildPath $FolderName
if (-not (Test-Path -LiteralPath $TargetDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $TargetDirectory -Force | Out-Null
}
$TargetDirectory = Resolve-ExistingDirectory -Path $TargetDirectory -Label 'Target folder'

Write-Host ''
Write-Host 'Planned operation'
Write-Host "  Search root:        $SearchRoot"
Write-Host "  Target folder:      $TargetDirectory"
Write-Host '  Match rule:         base file name is exactly 29 digits, extension is .zip'
Write-Host '  Existing files:     overwritten when a matching file has the same name'
Write-Host ''

if (-not $Force) {
    $answer = Read-Host 'Type YES to move matching files'
    if ($answer -cne 'YES') {
        Write-Host 'Cancelled. No files were moved.'
        exit 1
    }
}

$logWriter = $null
$logPath = $null
if (-not $NoLog) {
    $logPath = Join-Path -Path $TargetDirectory -ChildPath ('move-29digit-zips-{0}.csv' -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $logWriter = [System.IO.StreamWriter]::new($logPath, $false, [System.Text.UTF8Encoding]::new($false))
    $logWriter.WriteLine('"Status","Source","Destination","Message"')
}

$directoriesScanned = 0
$zipFilesChecked = 0
$matchingFilesFound = 0
$filesMoved = 0
$filesOverwritten = 0
$filesSkipped = 0
$errors = 0
$skippedZipSamples = [System.Collections.Generic.List[string]]::new()
$startTime = Get-Date
$namePattern = '^\d{29}$'
$stack = [System.Collections.Generic.Stack[string]]::new()
$stack.Push($SearchRoot)

try {
    while ($stack.Count -gt 0) {
        $currentDirectory = $stack.Pop()

        if (Test-SameOrUnderPath -Path $currentDirectory -Parent $TargetDirectory) {
            continue
        }

        $directoriesScanned++
        if (($directoriesScanned % 500) -eq 0) {
            Write-Progress -Activity 'Scanning for 29-digit ZIP files' -Status "$directoriesScanned folders scanned, $matchingFilesFound matching files found"
        }

        try {
            foreach ($filePath in [System.IO.Directory]::EnumerateFiles($currentDirectory, '*.zip')) {
                $extension = [System.IO.Path]::GetExtension($filePath)
                if (-not [string]::Equals($extension, '.zip', [System.StringComparison]::OrdinalIgnoreCase)) {
                    continue
                }

                $zipFilesChecked++
                $baseName = [System.IO.Path]::GetFileNameWithoutExtension($filePath)
                if ($baseName -notmatch $namePattern) {
                    if ($skippedZipSamples.Count -lt 10) {
                        $skippedZipSamples.Add((Get-SkippedZipDescription -FilePath $filePath -BaseName $baseName)) | Out-Null
                    }
                    continue
                }

                $matchingFilesFound++
                $destinationPath = Join-Path -Path $TargetDirectory -ChildPath ([System.IO.Path]::GetFileName($filePath))

                try {
                    $moveStatus = Move-FileWithOverwrite -SourcePath $filePath -DestinationPath $destinationPath
                    if ($moveStatus -eq 'Overwrote') {
                        $filesOverwritten++
                    }
                    elseif ($moveStatus -eq 'SkippedSameFile') {
                        $filesSkipped++
                    }
                    else {
                        $filesMoved++
                    }

                    if ($null -ne $logWriter) {
                        Write-LogRow -Writer $logWriter -Status $moveStatus -Source $filePath -Destination $destinationPath -Message ''
                    }
                }
                catch {
                    $errors++
                    if ($null -ne $logWriter) {
                        Write-LogRow -Writer $logWriter -Status 'Error' -Source $filePath -Destination $destinationPath -Message $_.Exception.Message
                    }
                }
            }
        }
        catch {
            $errors++
            if ($null -ne $logWriter) {
                Write-LogRow -Writer $logWriter -Status 'ScanError' -Source $currentDirectory -Destination '' -Message $_.Exception.Message
            }
        }

        try {
            foreach ($childDirectory in [System.IO.Directory]::EnumerateDirectories($currentDirectory)) {
                try {
                    $attributes = [System.IO.File]::GetAttributes($childDirectory)
                    if (($attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
                        $filesSkipped++
                        if ($null -ne $logWriter) {
                            Write-LogRow -Writer $logWriter -Status 'SkippedReparsePoint' -Source $childDirectory -Destination '' -Message ''
                        }
                        continue
                    }
                }
                catch {
                    $errors++
                    if ($null -ne $logWriter) {
                        Write-LogRow -Writer $logWriter -Status 'ScanError' -Source $childDirectory -Destination '' -Message $_.Exception.Message
                    }
                    continue
                }

                if (Test-SameOrUnderPath -Path $childDirectory -Parent $TargetDirectory) {
                    continue
                }

                $stack.Push($childDirectory)
            }
        }
        catch {
            $errors++
            if ($null -ne $logWriter) {
                Write-LogRow -Writer $logWriter -Status 'ScanError' -Source $currentDirectory -Destination '' -Message $_.Exception.Message
            }
        }
    }
}
finally {
    Write-Progress -Activity 'Scanning for 29-digit ZIP files' -Completed
    if ($null -ne $logWriter) {
        $logWriter.Dispose()
    }
}

$elapsed = (Get-Date) - $startTime
Write-Host ''
Write-Host 'Done'
Write-Host "  Folders scanned:    $directoriesScanned"
Write-Host "  ZIP files checked:  $zipFilesChecked"
Write-Host "  Matching files:     $matchingFilesFound"
Write-Host "  Files moved:        $filesMoved"
Write-Host "  Files overwritten:  $filesOverwritten"
Write-Host "  Skipped entries:    $filesSkipped"
Write-Host "  Errors:             $errors"
Write-Host "  Elapsed:            $($elapsed.ToString())"
Write-Host "  Target folder:      $TargetDirectory"
if ($logPath) {
    Write-Host "  Log file:           $logPath"
}

if ($matchingFilesFound -eq 0) {
    Write-Host ''
    if ($zipFilesChecked -eq 0) {
        Write-Host 'No .zip files were found under the selected search root.'
        Write-Host 'Check that the entered drive or folder is the one that actually contains the ZIP files.'
    }
    elseif ($skippedZipSamples.Count -gt 0) {
        Write-Host 'ZIP files were found, but none matched the exact 29-digit filename rule.'
        Write-Host 'Skipped examples:'
        foreach ($sample in $skippedZipSamples) {
            Write-Host "  $sample"
        }
    }
}

if ($errors -gt 0) {
    exit 2
}
