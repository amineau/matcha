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
ifeq ($(UNAME),Linux)
	SNAP := sleep 3 && fswebcam -D 2 --png
else
	SNAP := imagesnap -w 2
endif
all: $(NAME)

$(NAME):
	#screen -X eval "chdir $$PWD"
	npm install
	screen -dmS $(NAME)
	screen -S $(NAME) -p 0 -X stuff $$'mongod --dbpath ~/Documents/Mongodb\n'
	screen -S $(NAME) -X screen 1
	screen -S $(NAME) -p 1 -X stuff $$'cd client && webpack --watch\n'
	screen -S $(NAME) -X screen 2
	screen -S $(NAME) -p 2 -X stuff $$'cd client && webpack-dev-server\n'
	screen -S $(NAME) -X screen 3
	screen -S $(NAME) -p 3 -X stuff $$'nodemon api/app.js\n'
	screen -S $(NAME) -X screen 4
	screen -S $(NAME) -p 4 -X stuff $$'neo4j console\n'
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
	curl -X POST http://localhost:4242/generate/30

test:
	echo $(shell uname)

clean:
	screen -S $(NAME) -p 0 -X at "#" stuff $$'\003'
	screen -S $(NAME) -p 1 -X at "#" stuff $$'\003'
	screen -S $(NAME) -p 2 -X at "#" stuff $$'\003'
	screen -S $(NAME) -p 3 -X at "#" stuff $$'\003'
	screen -S $(NAME) -p 4 -X at "#" stuff $$'\003'

picclean:
	rm -rf client/src/assets/profil-*.png

fclean: clean
	@sleep 10
	screen -S $(NAME) -X quit

re: fclean all
