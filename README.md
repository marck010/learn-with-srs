# learn-with-srs

### Build & Run

        docker build -t dictionary-front-end ./Front-end
        docker run --restart=always --name dictionary-front-end -p 8080:8080 -v `pwd`/Front-end/:/opt/Front-end  -d dictionary-front-end