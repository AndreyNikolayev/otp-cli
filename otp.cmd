@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" --no-warnings  "%~dp0\app.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node --no-warnings  "%~dp0\app.js"  %*
)