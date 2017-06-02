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
	npm install
	# mongod --dbpath ~/Documents/Mongodb/ --config ~/mongodb.conf --fork --logpath /var/log/mongo.log
	# sudo neo4j start
	cd client && webpack
	pm2 start api/app.js --watch
	@echo Wait...
	$(SNAP)  ./client/src/assets/profil-0.png
	convert -crop 720x720+260+0 ./client/src/assets/profil-0.png ./client/src/assets/profil-0.png
	@echo Smile !
	$(SNAP)  ./client/src/assets/profil-1.png
	convert -crop 720x720+260+0 ./client/src/assets/profil-1.png ./client/src/assets/profil-1.png
	@echo Please smile !
	@$(SNAP)  ./client/src/assets/profil-2.png
	@convert -crop 720x720+260+0 ./client/src/assets/profil-2.png ./client/src/assets/profil-2.png
	@echo Thanks

generate:
	curl -X POST http://localhost:4242/generate/$(NB)

clean:
	pm2 delete app

picclean:
	rm -rf client/src/assets/profil-*.png

fclean: clean
	neo4j stop
	pkill -f mongo

re: fclean all
