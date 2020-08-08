if not "$(docker ps -aqf name=expresscontainer)"=="" (
		docker stop expresscontainer
    docker rm expresscontainer
)
else if not "$(docker ps -aq -f status=exited -f name=expresscontainer)" == ""
    docker rm expresscontainer
)