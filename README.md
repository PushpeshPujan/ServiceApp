#### Running Service App in Development Enviornment
---
#### Prerequisite
`Node.js`, `React-Native CLI`, `JAVA` and `Android Studio` should be installed and available in path in anviornment variablle.

#### Environtment Variables
 `JAVA_HOME`, `ANDROID_SDK_ROOT` and `ANDROID_HOME` should be set as enviornment variable.

#### Run Application in Debug Mode
```sh
Open **Command Prompt** form **serviceApp folder**.
Run the command `npm install` (for first time only).
Run the command `react-native run-android` (to run the application).
```
**`It will launch the app in connected device or emulator`**

**Change the `backend server` of serviceApp**
Open `src/utils/utils.js` and repalce `BASE_URL` constant with desired URL.

---
To prepare personalize build run the command `npm run make-personalize-build <path/to/assets/folder>` from the mobile application project root directory.

**Content of assets folder as below:**
- hdpi-72x72-round.png
- hdpi-72x72.png
- info.txt
- logo.png
- mdpi-48x48-round.png
- mdpi-48x48.png
- xhdpi-96x96-round.png
- xhdpi-96x96.png
- xxhdpi-144x144-round.png
- xxhdpi-144x144.png
- xxxhdpi-192x192-round.png
- xxxhdpi-192x192.png

**Content of the info.txt file as below:**
- applicationId=com.test.doctor1
- appName=doctor name
- providerId=4
- personalize=true
- companyName=Doctor Test

**Running the backend server:**
```sh
Open **Command Prompt** from **server folder**.
Run the command `npm install` (for first time only).
Run the command `node ./index.js`
```
**`It will run the server on port 3000`**

#### Database Setup
To change MySQL host open the file `dbHandler.js` and checnge connection credential in `mysql.createConnection` section.
To create new MySQL database plsae check `.sql` file in sql folder, all the .sql file has dummy data with table schema.

#### Google Service Account
To change the google service account credential, need to download different service account credential and replace with `credentials.json`.

**Please visit the link below for more information on `credentials.json`**
https://www.codepoc.io/blog/gcp/5993/how-to-create-service-account-in-google-cloud-and-download-private-key-json-file

#### Email Settings
To change email id in email listener open `mailHandler.js` change username and password in new `MailListener` section.
Password should be `app password`, for more details in app password please **visit link below**.
https://support.google.com/accounts/answer/185833?hl=en


#### AWS EC2 `MySql` Config for Ubuntu
- `Add 3306 port` on Security Inbound rules (On EC2 Instance).
- `Install` MySql Server.
- Modify `mysqld.conf` file located on `/etc/mysql/mysql.conf.d/mysqld.cnf`, change bind-address from `127.0.0.1` to `0.0.0.0`
- `Restrat` MySql Server.

**Check connection using `telnet` from your `local terminal`** (Use your `Public IP` for `EC2` Instance on `PUBLIC_IP`)
```sh
telnet PUBLIC_IP Instance 3306
```

#### Create user in MySQL Server
```sh
CREATE USER 'user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; 
GRANT ALL PRIVILEGES ON * . * TO 'user'@'localhost';
FLUSH PRIVILEGES;
```
**`You can use % in the place of localhost to grant all access`**
