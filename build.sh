echo "Executing command 'expo build:web'"
expo build:web
echo "Moving built files to /var/www/60seconds.io"
sudo rm /var/www/60seconds.io/* -rf
sudo mv web-build/* /var/www/60seconds.io/
echo "Done! Changes should be live."
