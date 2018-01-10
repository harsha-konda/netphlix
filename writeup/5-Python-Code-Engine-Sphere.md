##Movie Recommendation as a service

Playground needs more funding before it can launch its service in production. As a Proof-of-Concept (PoC), you have been tasked with setting up a movie recommendation service on the Kubernetes cluster. This will enable users get a set of recommended movies based on set of  movies the user has already liked. In this task, you will be required to recommend movies based on the movies that the user has liked. The Kubernetes cluster will be deployed in GCP and you will publish your custom Docker images to Google Container Registry. Before you get started please revisit the kubernetes primer [Intro to Kubernetes](https://theproject.zone/f17-15619/intro-container#section_3) primer. 

To help you get started Playground has already designed the architectural setup of the service. It consists of **3 deployments**[info on deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

   1. A **frontend** that displays a list of movies, through which the user interacts to get his/her movie recommendations. The frontend team has already developed a UI.
   2. A **backend** that recommends a set of movies to the user based on the movies that the user liked and  based on the movies that Users with similar prefereneces liked. This is the only part of the services that needs to built by you.      
   3. An **ElasticSearch** deployment that stores the complete list of movies and also stores historical data of about 1,00,000 user's movie proferences that you will be using to build the recommendation service. Luckily, the database team has already built an API to handle elasticsearch queries that you'll be using to build the **backend**.  
![](https://s3.amazonaws.com/f17/Project2.2/task3.png)
**Figure 10**: Architectural overview of multi-cloud cluster deployment.

The interaction between the user and your service would be as follows:

   1. User enters the IP address (the loadbalancer IP) in the browser and types Python code in the text area provided by the Python Playground UI.

   1. On Submit, the loadbalancer will receive a POST request which will be forwarded to the Playground UI container. On receiving the POST request, the playground UI will make an HTTP request to the Python Playground Server container.

   1. The server container will execute the code, capture the output from `stdout` and `stderr` and return it as a response to the UI container.

   1. The UI container will return the response it receives from the backend server container to the browser.


For this task, you will be given a base Python Flask server. You need to add code in the Playground UI to send HTTP requests to the Playground server via POST and return the response from the server back to the browser. Similarly on the Playground backend server, you should execute the code received from the Playground UI, capture the output from stdout and stderr, and return it in the JSON format described below. The code that you develop here should be built as a docker image, published to a container repository. While creating the deployments on the Kubernetes cluster, the containers spawned within the deployments should be from the images you published into the container registry above.

To accomplish this, follow these steps:

 1. Launch a `t2.micro` instance in EC2 using the AMI `ami-cb7762b0` 

 1.  Deploy a Kubernetes cluster with `--node-count` 1 using the GCP's web console or gcloud CLI

[Deploying a Kubernetes Cluster on GCP](https://theproject.zone/f17-15619/intro-container#section_3) covers this process in detail.

**NOTE** - When you delete the Kubernetes cluster, check if the instance groups on your Google Compute Engine dashboard are also deleted to prevent new VMs from being launched automatically.

START-PANEL:"danger"
Please also make sure that you deployments' names are the same as your service's name in this task.
END-PANEL

START-PANEL:"info"

START-PANEL:"warning"
Spacing is significant in YAML documents. You should be sure to conform to the [Indentation Spaces](http://yaml.org/spec/1.2/spec.html#id2777534) and [Separation Spaces](http://yaml.org/spec/1.2/spec.html#id2778241) sections of the YAML specification.

There are tools such as `yq` and `yamllint` to validate your YAML documents.
END-PANEL

START-PANEL:"warning"
In this task you will need to route traffic from the frontend application to the backend application in the same cluster. Kubernetes will automatically assign a DNS name for every service in your cluster. You should review the following documentation to learn more:

1. [Kubernetes Services - DNS](https://kubernetes.io/docs/concepts/services-networking/service/#dns)
1. [DNS Pods and Services](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/)
END-PANEL

### Task to complete:
The setup information described previously is broken down below:

0. Setup an GCP Container Registry on Google Cloud. Please revisit **Introduction to Container Registry** for instructions on setting up a Docker repository in GCP.

1. Launch a t2.micro instance in EC2 using `ami-cb7762b0`. Use that for running the kubectl (Student VM in the diagram).

2. On the instance, enter `/home/<ANDREW_ID>/Project2_2/task2` directory and update the Python Playground UI code and ensure that the Flask server uses port `5000`. Also update Python Playground Server code and ensure that it uses port `6000`. Your Playground server should execute the code received from UI, capture stdout & stderr, and respond with a JSON output of the form:

          {"stdout": "<output_from_stdout>", "stderr": "<output_from_stderr>"}
You would like to include the IP of the backend service in the Playground UI code. The UI should only route the request to the Playground Server and return the output exactly from the server. As these containers will be within the same cluster, they will use the same network space. Therefore, the Playground UI can access the Playground server via the loadbalancer or using the service name; Kubernetes will configure DNS for services within the cluster as described in [service networking](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/). Please note that all HTTP responses where you return a JSON object should have their `Content-type` header as `application/json`.

3. Build the docker images for Playground UI and Playground server, and publish them into the Google Container Repository that you created.

4. Specify the following details in your YAML file for the Kubernetes cluster:
    - The image to launch in the container should be the docker image you had published to the Google Container Repository.
    - The Playground UI container should be listening at port `5000`. Similarly the Playground server container will listen on port `6000`.
    - The loadbalancer must redirect requests coming at port `80` to port `5000` of the Playground UI container.
    - Another loadbalancer must redirect requests coming at port `80` to port `6000` of the Playground backend container.
    - Make sure your deployment's name is the same as your service's name.

5. Before running the submitter, test your setup by executing some Python code on your browser using the loadbalancer IP and check the output. If you wish to debug the application outside the containerized environment, you can develop and test these endpoints in the VM itself and run it as:

        python <your_client_or_server.py>
You can then access this VM's public IP to test your service and build an image once you are confident.

6. Your `Dockerfile`, `playground.py`, Kubernetes YAML file along with `references` should be in the same directory as task2_submitter.

6. Run the submitter: `./task2_submitter`
    - Wait for the submitter to check for any misconfiguration or malformed behavior in your current working environment.
    - Follow the prompts for Andrew ID, Submission Password, and Integrity Check.
    - Receive a success message and check TPZ for your score.
END-PANEL
[1]: https://s3.amazonaws.com/15619public/webcontent/P22_Task_3.jpg


START-PANEL:"info"
### Hints
- How do I test my code on the MV if Flask and other dependencies I need are not installed?
 - You can use a `virtualenv`. Do `python3 -m virtualenv env && source env/bin/activate` to create and activate a virtual environment. In this environment, you should be able to use `pip` to install any dependencies you require. See the [official Python documentation](https://packaging.python.org/guides/installing-using-pip-and-virtualenv/) on installing packages with pip and virtualenv to learn more.
- How do I debug my frontend or backend servers?
 - You can use the `curl` command line utility to test if your services are providing the response you expected. [Postman](https://www.getpostman.com/apps) is also a good application for testing your endpoints.

To send a POST request to your backend container with curl, you can do something like

    curl -X POST -H "Content-Type: application/json" -d '{"code": "print 5"}' localhost:6000/py/eval
    {
      "stderr": "", 
      "stdout": "5\n"
    }


END-PANEL

