
sudo docker exec -t dictionary-database bash -c "cd /data/db && mongodump"
sudo docker exec -it dictionary-database bash -c "sshpass -e scp /data/db/* marcos@172.18.0.1:`pwd`/Database/dump"
