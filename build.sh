#compatible with ubuntu:16.04

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

#build docker
cd es/
#increase virual memory
sudo sysctl -w vm.max_map_count=262144
sudo docker build . --tag=es
sudo docker run -d  -e "ES_JAVA_OPTS=-Xms4000m -Xmx4000m"  -p 9200:9200 es

a=$(curl localhost:9200)
while [[ -z $a ]]
do
sleep 3
a=$(curl localhost:9200)
done 

cd ..

}

s3_get(){
  aws s3 cp 
}


load_db(){
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies_tf.json"
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies_users.json"
curl -s -H "Content-Type: application/x-ndjson" -XPOST localhost:9200/_bulk --data-binary "@data/movies.json"
}


install_npm
install_docker
load_db
