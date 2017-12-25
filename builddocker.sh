projectId=project2-186501
auth_gcloud(){
	gcloud auth login 
	gcloud auth application-default login
	gcloud config set project ${projectId}
}

build_docker(){
	cd $1
	docker build . --tag=gcr.io/${projectId}/$1
	gcloud docker -- push gcr.io/${projectId}/$1
	cd ..
}


build_docker es 
build_docker movies-app 
build_docker solution 