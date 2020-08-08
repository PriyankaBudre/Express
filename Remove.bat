@echo off
set runningContainer = ""
set exitedContainer = ""
FOR /F "tokens=1 delims=" %%I in ('docker ps -aq -f "name=expresscontainer"') do set runningContainer=%%I
FOR /F "tokens=1 delims=" %%A in ('docker ps -aq -f "status=exited" -f "name=expresscontainer"') do set exitedContainer=%%A
if not [%runningContainer%] == [] (
		docker stop expresscontainer
    docker rm expresscontainer
    echo "Removed"

)else if not [%exitedContainer%] == [] (
    docker rm expresscontainer
    echo "exited"
)
set "runningContainer="
set "exitedContainer="