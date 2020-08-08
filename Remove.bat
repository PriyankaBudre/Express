@echo off
Set runningContainer = $(docker ps -aqf name=expresscontainer)
Set exitedContainer = $(docker ps -aq -f status=exited -f name=expresscontainer)

if not  [%runningContainer%] == [] (
		docker stop expresscontainer
    docker rm expresscontainer

)else if not [%exitedContainer%] == [] (
    docker rm expresscontainer
)