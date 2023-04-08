# nginx-access-logger

Log Nginx requests to MongoDB database. This utility was created for a [VScode](https://code.visualstudio.com) plugin I created to provision and monitor my servers on [Digital Ocean](https://www.digitalocean.com) and works well with [Forge](https://forge.laravel.com), a server management tool by [Laravel](https://laravel.com). It can also be used on it's own with the correct [Manual Setup](#manual-setup).

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

- [Manual Setup](#manual-setup)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [VScode Plugin](#vscode-plugin)
- [Contributing](#contributing)
- [Links](#links)

## Manual Setup

**Nginx Setup**

This utility watches a custom [Access Log](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/#access_log) file that can be configured from your [NGINX Configuration](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files) file.

Example of simple NGINX Configuration file:

```

http {
    # Create the custom logfile format
    log_format access_json '[{"address":"$remote_addr",'
                        '"tsId":"$remote_addr[$time_local]",'
                        '"ts":"[$time_local]",'
                        '"method":"$request_method",'
                        '"host":"$host", "hostname":"$hostname",'
                        '"requestUri":"$request_uri", "uri":"$uri",'
                        '"request":"$request", "status":$status, "bytes":$body_bytes_sent,'
                        '"referer":"$http_referer", "agent":"$http_user_agent",'
                        '"duration":{"request":"$request_time",'
                        '"connect":"$upstream_connect_time",'
                        '"header":"$upstream_header_time",'
                        '"response":"$upstream_response_time"} }]';

    server {

        # Create the log file path with the site name + -access.log
        access_log /var/log/nginx/example.com-access.log access_json;
        ...

    }
}
```

## Commands

Running locally:

```bash
yarn dev
```

or

```bash
npm run dev
```

Running in production (requires Daemon):

```bash
node /home/<username>/nginx-access-logger/index.js example.com
```

## Project Structure

```
\
 |--connection\     # DB Business logic
 |--schema\         # Mongoose schemas (data layer)
 |--log\            # Development log files
 |--index.js        # App entry point
```

## Error Handling

Coming Soon

## VScode Plugin

Coming Soon

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Links

- [NGINX Configuration](https://docs.nginx.com/nginx/admin-guide/basic-functionality/managing-configuration-files)
- [NGINX Access Log Setup](https://docs.nginx.com/nginx/admin-guide/monitoring/logging/#access_log)
- [Digital Ocean](https://www.digitalocean.com)
- [Forge](https://forge.laravel.com)

## License

[MIT](LICENSE)
