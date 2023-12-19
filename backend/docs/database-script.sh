#!/bin/sh
# This shell script will backup your remote database and restore it locally inside your chosen docker container
# The following commands need to be executed in order to run the file (inside the file directory)
# If you get a 'bad interpreter: /bin/sh^M: no such file or directory' error, run the following command: sed -i -e 's/\r$//' database-script.sh
#
# chmod 755 your_script.sh
# ./your_script.sh
while :
do
    echo "1. Backup remote database"
    echo "2. Restore database locally"
    echo "3. Exit the script"
    read OPTION
    echo
    case $OPTION in 
        1)
            echo "What is your remote database?"
            read REMOTE_DATABASE
            echo "What is your username?"
            read USER_NAME
            FILE_NAME=dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
            # This command will backup the remote database (it will ask you for the password)
            pg_dump -h $REMOTE_DATABASE -U $USER_NAME -f $FILE_NAME
            echo "Remote database backuped succesfully"
            echo
            ;;
        2)
            echo "What is your docker container id? (use 'docker ps')"
            read CONTAINER_ID
            echo "Enter your local database username"
            read USER_NAME
            echo "Enter the backup file name"
            read BACKUP_FILE
            # This command will restore the backup inside your chosen docker container
            cat $BACKUP_FILE | docker exec -i $CONTAINER_ID psql -U $USER_NAME
            echo "Local database restored succesfully"
            echo
            ;;
        3)
            echo
            break;
            ;;
        *)
            echo "Invalid input, please select one of the numbered options"
            echo
            ;;
    esac
done
echo "Script ended succesfully"