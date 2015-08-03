@ECHO OFF
FOR /F "delims=" %%x IN (sauce_username.txt) DO SET SAUCE_USERNAME=%%x
FOR /F "delims=" %%x IN (sauce_access_key.txt) DO SET SAUCE_ACCESS_KEY=%%x