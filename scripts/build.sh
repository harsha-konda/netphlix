#compatible with ubuntu:16.04
install_npm(){
sudo apt-get update
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get -y upgrade
sudo apt-get install -y python3-pip 
sudo pip3 install --upgrade pip
sudo pip3 install flask 
sudo pip3 install requests 
sudo pip3 install newspaper3k
sudo chown -R $(whoami) ~/.npm
sudo apt-get install -y build-essential

#sudo for npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
source ~/.profile
npm install -g elasticdump
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

#build docker
cd ../es
#increase virual memory
sudo sysctl -w vm.max_map_count=262144
sudo docker build . --tag=es
sudo docker run -d -it -p 9200:9200 es

a=$(curl localhost:9200)
while [[ -z $a ]]
do
sleep 3
a=$(curl localhost:9200)
done 

}


load_db(){
	curl -XPUT 'localhost:9200/news?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'

curl -XPUT 'localhost:9200/users?pretty' -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 3, 
            "number_of_replicas" : 2 
        }
    }
}
'

}

dns_config(){
	dns=$(curl -s http://169.254.169.254/latest/meta-data/public-hostname)

  if [[ ! -z dns ]]
    then
      line=$'var dns="'$dns$'";'
      sed -i "10s/.*/$line/" src/app/auth/auth0-variables.ts
  fi
}


install_npm
install_docker
load_db
cd ..
config
npm i
npm i
