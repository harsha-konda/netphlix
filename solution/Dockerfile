FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y python-pip
RUN pip install Flask
RUN pip install requests
WORKDIR /solution
COPY . ./

EXPOSE 5000
CMD ["python","recommend.py"]


