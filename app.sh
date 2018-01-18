#!/bin/bash
projectId=project2-186501
path=~/netphlix
install_npm(){
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get -y upgrade
sudo pip install flask 
sudo pip install requests
sudo chown -R $(whoami) ~/.npm
sudo apt-get install -y build-essential

#sudo for npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.profile
npm install -g @angular/cli 
}

#install docker
install_docker(){
sudo apt-get update
 sudo apt-get install -y\
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install -y docker-ce

sudo addgroup --system docker
sudo adduser $USER docker
newgrp docker
} 

install_gcloud_cli(){
	sudo apt-get install  -y python
	curl https://sdk.cloud.google.com | bash
	exec -l $SHELL
	gcloud init
  	gcloud components install kubectl
}

auth_gcloud(){
	if [[ ! -z "$1" ]]
		then

		gcloud auth login 
		gcloud auth application-default login
		gcloud config set project ${projectId}
	fi
}

build_docker(){
	cd $1
	docker build . --tag=gcr.io/${projectId}/$1
	gcloud docker -- push gcr.io/${projectId}/$1
	cd ..
}

push_docker(){
	auth_gcloud $1
	build_docker es 
	build_docker movies-app 
	build_docker solution 
}

deploy(){
	#TODO: delete running load balancer on gcp
	cd $path
	kubectl delete -f solution/config.yaml > /dev/null
	kubectl create -f solution/config.yaml
}

mount_volume(){
	cd $path
	kubectl delete -f solution/volume.yaml > /dev/null
	kubectl create -f solution/volume.yaml
}

load_db(){
	cd ~
	wget 
}
while getopts "bpadmh::" opt; do
  case $opt in
    b) #build 
      install_npm && install_docker && install_pip_dependencies && install_gcloud_cli >&2
      ;;
    p) # push to container repo ; change projectId above
	  push_docker >&2
	  ;;
	a) # push docker image
	  push_docker auth >&2
	  ;;
	d) # deploy
	  deploy >&2
	  ;;
  	m) #mount
	  mount_volume >&2
	  ;;
	*) #help
	  echo "
	-b install dependencies
	-p push docker images
	-a push by authenticating
	-d create k8 deployment
	-m create a volume mount" >&2
	  ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done