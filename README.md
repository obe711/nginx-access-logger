# nginx-access-logger

Log Nginx requests to MongoDB database. This utility was created for a [VScode](https://code.visualstudio.com) plugin I created to provision and monitor my servers on [Digital Ocean](https://www.digitalocean.com) and works well with [Forge](https://forge.laravel.com), a server management tool by [Laravel](https://laravel.com).

## Installation

Clone the repo:

```bash
cd /home/<username>

git clone --depth 1 https://github.com/obe711/nginx-access-logger.git

cd nginx-access-logger
```

Install the dependencies:

```bash
npm install
```

or

```bash
yarn install
```

## Table of Contents

- [Setup](#setup)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Links](#links)

## Setup

**Nginx Setup**

The quickest way to get started is to include the `nginx-access-logger.conf` configuration to NGINX. The default settings will create a top level configuration to format and store logs from all of the server's enabled sites by default.

To do this, create a symlink to the nginx-access-logger config file.

```bash
# Change to the project's nginx-conf directory
cd nginx-conf

# Create the symlink
sudo ln -s $(pwd)/nginx-access-logger.conf /etc/nginx/conf.d/nginx-access-logger.conf

# Test the NGINX configuration
sudo nginx -t

# If successful and there were no errors, you should see...
...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

# To reload NGINX with the nexus-access-logger configurations use the signal reload
sudo nginx -s reload
```

Any sites that you DO NOT want these `nginx-access-logger` configuations on, the site level configurations found in the `/etc/nginx/sites-available` directory will overwrite them. For example, if you wanted to disable the logger on a single site:

`/etc/nginx/sites-available/my-no-log-site.com`

```bash
...
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name my-no-log-site.com;

        # Disable nginx-access-logger from this site
        access_log off;
        # store error log to custom log file
        error_log  /var/log/nginx/my-no-log-site.com-error.log error;
        ...
    }

```

**Setup NGINX Access Logger**

Create a `.env` file

```bash
cp .env.example .env
```

Edit the new `.env`

```
# Your Mongodb URI
MONGODB_URL=mongodb://127.0.0.1:27017

# The database to store access logs
MONGODB_DATABASE=mt-live-access

# The hostname of your site
SITE_NAME=example.com

# Nabla port
NABLA_PORT=41234

# Access log file - should match the nginx-access-loger.conf
ACCESS_LOG_FILE_PATH=/var/log/nginx/access.log

# Number of days to keep the databse documents
DAYS_TO_EXPIRE=15
```

## Commands

Build:

```bash
yarn
```

Running in development:

```bash
yarn start
```

Running in production:

```bash
yarn start:production
```

## Project Structure

```
\
 |--connection\     # DB Business logic
 |--schema\         # Mongoose schemas (data layer)
 |--log\            # Development log files
 |--index.js        # App entry point
```

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Links

- [NGINX Configuration](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files)
- [NGINX Access Log Setup](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/#access_log)
- [Digital Ocean](https://www.digitalocean.com)
- [Forge](https://forge.laravel.com)

## License

[MIT](LICENSE)
