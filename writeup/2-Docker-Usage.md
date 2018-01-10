Now that you have gained the background context of containers, we will commence with a demonstration of how to interact with Docker. For this project we will specifically be considering Docker as the container engine; other container managers include [rkt](https://coreos.com/rkt). With respect to the use cases of containers discussed earlier, we will be exploring how to launch services using Docker containers.  We will begin by defining a Dockerfile and then using the Docker CLI to build an image based on the Dockerfile.

# Dockerfile
>  A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image to be used in containers.

When designing a Dockerfile it is important to consider which resources the resulting container image needs access to. For example:

 1. Packages installed using `apt-get`, `apk`, or `yum` depending on the OS of the container image.
 1. Ports the container should listen on.
 1. Files that need to be copied from the VM into the resulting image.

Below is a description of common Dockerfile instructions that will be used to build images in this project. The diagrams visualize the changes that occur in Dockerfile instructions

  * Starting on the host machine without any existing Docker image:
![simple_vm](https://s3.amazonaws.com/15619public/webcontent/p22_intro_default_image.jpg)
**Figure 3**: Blank starting point for building an image.

  * `FROM` - Sets the base image. Subsequent instructions will manipulate the base image by running commands or adding resources. `FROM` is required in valid Dockerfiles and ***must*** be the first non-commented instruction.

        FROM alpine:latest
![from_instruction](https://s3.amazonaws.com/15619public/webcontent/p22_intro_from_step.jpg)
**Figure 4**: Using FROM to set the base image.

  *  `RUN` - Specifies a command to run on the current image. This will create a new layer on top of the current image. `RUN`  is the instruction used to alter the base image (Alpine Linux) by adding dependencies or running any other required command. 

        # Commands run with the default shell - '/bin/sh'
        RUN apk add bash
  
        # To use a different shell - '/bin/bash' - or an executable, use the exec form of RUN
        RUN ["/bin/bash", "-c", "apk add curl"]
![from_instruction](https://s3.amazonaws.com/15619public/webcontent/p22_intro_run_step.jpg)
**Figure 5**: Including the RUN instruction will execute a command and modify the current image state.

  *  `ADD` - Copies files, directories, or remote URLs from a source location (the VM or a remote location) to the container's file system. `ADD` has similar behavior to the `COPY` instruction, but provides additional functionality for unpacking `.tar`  files and for handling remote sources.
		  
		  # add all the files in the current local directory to /home/demo
		  ADD . ./home/demo/
		 
		  # add index.html at /home/demo 
        ADD index.html /home/demo/
![add_instruction](https://s3.amazonaws.com/15619public/webcontent/p22_intro_add_step.jpg)
**Figure 6**: ADD will include a resource in the current working directory of the image.

  * `CMD` - the command the container executes by default when you launch the built image, whereas `RUN` is triggered while we build the base image.  If Docker container runs with a command, the default command will be ignored. A Dockerfile can only have one CMD.

        # starting a nodejs server 
        CMD ["node","app.js"]
        
  * `EXPOSE` - Notifies Docker that the container will expose a set of ports at runtime. Including this instruction in the Dockerfile is not sufficient for making the container port accessible to the host. The `docker run` command must be provided with a flag that designates the mapping of VM ports to container ports.

        EXPOSE 80 443

  * `ENTRYPOINT` - ENTRYPOINT instruction allows you to configure a container that will run as an executable. It looks similar to CMD, because it also allows you to specify a command with parameters. The difference is ENTRYPOINT command and parameters are not ignored when Docker container runs with command line parameters. For further explanation, review the [Understand how CMD and ENTRYPOINT interact](https://docs.docker.com/engine/reference/builder/#/understand-how-cmd-and-entrypoint-interact) portion of the Docker Engine documentation.

        # Using Bash as the entrypoint to the container
        ENTRYPOINT ["/bin/bash", "-c"]

        # Setting Perl as the entrypoint to the container
        ENTRYPOINT ["perl", "-e"]
![entrypoint_instruction](https://s3.amazonaws.com/15619public/webcontent/p22_intro_entrypt_step.jpg)
**Figure 7**: Adding instructions on what command the container should run when it starts. Including instructions on which ports to expose.

  * As stated in `EXPOSE`, when you launch a container with appropriate port mappings, the image that you built using the Dockerfile instructions above is used inside that container.
![single_container](https://s3.amazonaws.com/15619public/webcontent/p22_intro_cont_launch_step.jpg)
**Figure 8**: Ports are exposed on a container during runtime. They may be mapped to ports of the VM.

In the same host when you launch more containers, even though the container ports can be the same in C1 & C2 (as they belong in a different network namespace), the host ports need to be different.
![single_container](https://s3.amazonaws.com/15619public/webcontent/p22_intro_more_cont_launch_step.jpg)
**Figure 9**: Once a container is bound to a port on the VM, a different VM port must be used for subsequent containers.

This is a brief overview of Dockerfile instructions that will be useful during this Project. The [Docker Engine documentation](https://docs.docker.com/engine/reference/builder/) contains descriptions for all available instructions.

Below is a basic Dockerfile that demonstrates building a simple image using `alpine:latest` as the base image.  
  
    # Alpine Linux as the base image
    FROM alpine:latest

    # Install packages 
    RUN apk update && \
        apk upgrade && \
        apk add bash

    # index.html must be in the current directory
    # or must be referred to using an absolute path
    ADD index.html /home/demo/

    # Define the command which runs when the container starts
    CMD ["cat /home/demo/index.html"]

    # Use bash as the container's entry point
    ENTRYPOINT ["/bin/bash", "-c"]

# Docker CLI
For this project you should develop an understanding of the common set of commands used to interact with Docker. There are two important concepts to understand when working with Docker; the first is ***images*** and the second is ***containers***.

You will provide Docker with instructions on how to build an ***image*** based on a `Dockerfile`. After an image is successfully built, the ***run***  command will notify Docker that we wish to create a ***container*** using a specific ***image***.

 * `build` - Builds a Docker image from a Dockerfile. The `build` command accepts a path - `.` in this example - which is used as the location of the build's context. 
 
        $docker build --rm --tag andrewid/demo:v1 .
        ...
        Successfully built f64b5493e460

 * `images` - Shows images that have been built or pulled and their related information.

        $ docker images
        REPOSITORY                                                 TAG                IMAGE ID           CREATED             SIZE
        andrewid/demo                                              latest             f64b5493e460       9 seconds ago       9.004 MB

 * `run` - This command will start a Docker container based on the image specified.
		 
		 # command to run a container
        $ docker run andrewid/demo:v1
        15319 is awesome!
        
        # command to run a container by mapping 5000 port on the container to the 80 port on the local machine
        $ docker run -p 5000:80 andrewid/demo:v1

 * `ps` - Similar to bash's process status, this command will show the status of Docker containers.

        $ docker ps -a
        CONTAINER ID        IMAGE                  COMMAND                   CREATED             STATUS                           PORTS                         NAMES
        aafb095a6e87        andrewid/demo:v1   "/bin/bash -c 'cat /h"    21 seconds ago      Exited (0) 21 seconds ago                                      gigantic_rosalind

*  `kill` - Kills a running container    
		
		docker kill <container_id>

*  `logs` - Displays the container logs    
		
		docker logs <container_id>

START-PANEL:"info"
Using the Dockerfile from the previous section and the commands discussed above, you can now create an image that writes the contents of the `index.html` file to standard output.
END-PANEL

The [Docker Engine Command Line documentation](https://docs.docker.com/engine/reference/commandline/docker/) provides more details on the available commands.

[1]: https://docs.docker.com/engine/reference/commandline/
[2]: https://docs.docker.com/engine/reference/builder/
