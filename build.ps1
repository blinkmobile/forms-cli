Remove-Item ./output/* -exclude *.css, clean.ps1, index.html -recurse
node index > output/result.json
