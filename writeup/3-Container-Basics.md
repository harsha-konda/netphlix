# Scenario

Your budding cloud computing skills have come to the attention of a new startup named Playground. Playground is evaluating container technology for use in their lightweight and secure service which allows users to write and run code directly from their browser. They have brought you on board for your newly gained container expertise and your job is to develop a system that accepts code samples from a user, executes the code, and returns the result.

# Environment Setup

Your first task is to become more familiar with the work environment and with the tools Playground use.

For this task, the team has decided to use AWS Platform and Docker.  In this section, you will launch a VM instance and design a basic `Dockerfile`.

START-PANEL:"info"
To prepare the working environment you must:

1. Launch a `t2.micro` instance in EC2 using  `ami-cb7762b0`.

1. Wait for the UI to be available. (e.g., `ec2-50-70-60-20.compute-1.amazonaws.com:15319`)

1. Enter your Andrew ID, submission password and Select **Project 2.2 Instance** from the drop down. Do not refresh the page after hitting the Submit button, it takes time for the logs to appear. 

1. SSH to the instance using your Andrew ID once the project initialization is complete.

1. The provided files can be found in `/home/<ANDREW_ID>/Project2_2/task1/`.

END-PANEL

# Configuring a Simple Server

Running `docker images` and `docker ps -a` will show that no images exist on the system and that no containers have been run.  For this first task, we will learn the basic mechanics of launching a container with Docker, by running a container using the [Ubuntu](https://hub.docker.com/_/ubuntu/) image.

Container images can be created locally, or downloaded from a remote repository.  Docker hosts a large collection of images in [Docker Hub](https://hub.docker.com). Images can be obtained from other repositories, such as the Amazon EC2 Container Registry, the Azure Container Registry, and the Google Container Registry, as we'll see in the following tasks.  As mentioned, we will be launching a container with an [Ubuntu Linux image](https://hub.docker.com/_/ubuntu/). From the command prompt of the VM, run a container using the Ubuntu image with `bash` as the command to start with:

    $ docker run -it ubuntu:latest /bin/bash
    Unable to find image 'ubuntu:latest' locally
    latest: Pulling from library/ubuntu
    8aec416115fd: Pull complete 
    695f074e24e3: Pull complete 
    946d6c48c2a7: Pull complete 
    bc7277e579f0: Pull complete 
    2508cbcde94b: Pull complete 
    Digest: sha256:71cd81252a3563a03ad8daee81047b62ab5d892ebbfbf71cf53415f29c130950
    Status: Downloaded newer image for ubuntu:latest

    root@991cb45b70ba:/# echo "This shell is in the running container!"
    This shell is in the running container!

Note that when Docker cannot find the image locally, it attempts to pull the image from the Docker Hub or another specified Docker repository.  You can also pull an image explicitly, either from the Docker Hub or other repository, by using `docker pull`.

Using this container, become familiar with the various docker commands and capabilities.  Make sure you feel comfortable and are able to understand the AssessMe questions before moving on.

START-PANEL:"info"
### Tasks to complete

[table]
[tbody]

[tr]
[td]**Base Image**[/td]
[td]Must not be `nginx`. `ubuntu` or `alpine` are recommended.[/td]
[/tr]

[tr]
[td]**Nginx Server Port (on the VM)**[/td]
[td]15619[/td]
[/tr]

[tr]
[td]**Server Response**[/td]
[td]“15619 is awesome!”[/td]
[/tr]

[/tbody]
[/table]

**1** - Design a Dockerfile to launch an Nginx server and serve the static content found in `index.html`.

**2** - Map the container port to port `15619` of the VM.  

**3** - The VM should respond to HTTP requests on port `15619` with “15619 is awesome!”.

    $ curl localhost:15619
    15619 is awesome!

**4** - Run `./task1_submitter <container_name>` 

**Notes**

 * Do not use containers built using `nginx` as the base image for submission. The main objective is to learn Docker instructions which are included in the `Dockerfile`. An Nginx base image has much of the setup done which prevents you from trying other docker instructions. You are welcome to try an Nginx base image if you have enough budget leftover, however, please do not use it for submission.
 * Even though the Nginx will expose port 80 for the web server in the container, you must determine how to map port 80 of the container to a different port on the host VM.
END-PANEL

  [1]: https://s3.amazonaws.com/15619public/webcontent/15619_p22_aws_docker.png
  [2]: http://edu.cmu.cc.p22.grading.s3.amazonaws.com/task1_submitter
