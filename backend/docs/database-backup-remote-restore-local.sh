# This shell script will backup your remote database and restore it locally inside your chosen docker container
# The following commands need to be executed in order to run the file (inside the script directory)
#
# chmod 755 your_script.sh
# ./your_script.sh

echo Enter your remote database URL
read REMOTE_DATABASE
echo Enter your database username
read USER_NAME
echo Name your file
read FILE_NAME
# This command will backup the remote database
# You will be prompted to enter the password
pg_dump -h $REMOTE_DATABASE -U $USER_NAME -f $FILE_NAME.sql
echo Enter your database container id (use 'docker ps' to find)
read CONTAINER_ID
# This command will restore the backup inside your chosen docker container
cat $FILE_NAME.sql | docker exec -i $CONTAINER_ID psql -U $USER_NAME