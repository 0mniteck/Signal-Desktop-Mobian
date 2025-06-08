ARG SOURCE=0mniteck/debian-slim
FROM $SOURCE
RUN apt update 
RUN apt install iputils-ping -y
COPY buildscript.sh /usr/local/bin/
ENTRYPOINT ["buildscript.sh"]
