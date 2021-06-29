install: 
	yarn install

build: 
	yarn build

prod: 
	docker-compose -f docker-compose.prod.yml up

test: 
	MONGODB_HOST=localhost LDAP_HOST=localhost TESTING=true yarn e2e artemis-web-e2e --prod
