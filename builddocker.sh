projectId=project2-186501
build=$1
auth_gcloud(){
	if [[ ! -z "$build" ]]
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

# auth_gcloud
build_docker es 
build_docker movies-app 
build_docker solution 