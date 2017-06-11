#!/bin/sh

NAME=matcha

WHITE	= \033[0m
DARK	= \033[1;30m
RED		= \033[1;31m
GREENB	= \033[1;32m
GREEN	= \033[0;32m
YELLOW	= \033[33m
CYAN	= \033[36m
UNAME := $(shell uname)
NB=50

ifeq ($(UNAME),Linux)
	SNAP := sleep 3 && fswebcam -D 2 --png
else
	SNAP := imagesnap -w 2
endif
all: $(NAME)

$(NAME):
	mongod --dbpath ~/Documents/Mongodb --config ~/mongodb.conf &
	neo4j restart
	npm install
	cd client && webpack
	cd client && webpack-dev-server &
	nodemon api/app.js &
	@echo Wait...
	@$(SNAP) -q ./client/src/assets/profil-0.png
	@convert -crop 720x720+260+0 ./client/src/assets/profil-0.png ./client/src/assets/profil-0.png
	@echo Smile !
	@$(SNAP) -q ./client/src/assets/profil-1.png
	@convert -crop 720x720+260+0 ./client/src/assets/profil-1.png ./client/src/assets/profil-1.png
	@echo Please smile !
	@$(SNAP) -q ./client/src/assets/profil-2.png
	@convert -crop 720x720+260+0 ./client/src/assets/profil-2.png ./client/src/assets/profil-2.png
	@echo Thanks

generate:
	curl -X POST http://localhost:4242/generate/$(NB)

clean:
	pkill -f nodemon
	pkill -f webpack-dev-server
	pkill -f mongod
	neo4j stop

fclean: clean
	rm -rf node_modules
	rm -rf ~/.brew/Cellar/neo4j/3.1.4/libexec/data/databases/graph.db/
	rm -rf ~/Documents/Mongodb/*
	rm -rf client/dist/build.js
	rm -rf api/logs/restrict.log
	rm -rf api/data/profile/*
	rm -rf client/src/assets/profil-*.png

re: fclean all
