# 理解nignx配置文件

先来看一下一份简单的去注释的配置文件`nginx.conf`：

```
user www-data;
worker_processes 1;
pid /run/nginx.pid;

events {
  worker_connections 768;
}

http {

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 2048;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;

  gzip on;
  gzip_disable "msie6";

  include /etc/nginx/conf.d/*.conf;
  include /etc/nginx/sites-enabled/*;
}
```

配置文件看起来长得很，其实就是由两个块（block）组成，

```
events {

}

http {

}

mail {

}
```

块和块之间还可以嵌套。例如http下面还可以放server。

```
http {
	server {
	}
}
```

这个是主配置文件。有时候仅仅一个配置文件是不够的，配置很多时，放一个文件难以维护。所以看最后两行`include`,自动包含符合格式的配置文件。

最后整个配置文件的结构大体是这个样子的。

```
# 这里是一些配置文件
...
http {
	# 这里是一些配置
	...
	
	#这部分可能存在include的其他配置文件下
	
	upstream {
	
	}
	
	server {
		listen 8080;
		root /data/up1;
		
		location / {
		}
	} 
	
	server {
		listen 80;
		root /data/up2;
		
		location / {
		}
	}
	这里是一些配置
	...
}

mail {
}
```

指令和指令之间是有层次和继承关系的。比如http内的指令会影响到server。

http那部分除非必要，一般不动它。假如我们现在要部署一个web服务，那就在配置目录下新增一个文件被`include`就好了。

http和events还有mail是同级的。http就是跟web有关的。

server，顾名思义就是一个服务，比如你现在有一个域名，要部署一个网站，那就得创建一个server块。


假设要为一个域名`foo.bar.com`，要在浏览器输入这个域名，并且host或者DNS指向最后的ip是本机就能访问，需要这样：

```
server {
 listen 80;
 root /home/web/foo;
 server_name foo.bar.com;
 location / {
 
 }
}
```

具体意思是这样的，listen是监听的端口。如果没有特殊指定，一般网站都是80端口。

root是网站的源代码静态文件的根目录。一般来说会在root指定的目录放置`index.html`这样的静态资源。

server_name指定的是域名。

有了这些，在浏览器下访问`http://foo.bar.com`就能访问到目录`home/web/foo`下的index.html文件的内容。但是有时候我们得访问`http://foo.bar.com/articles`呢。就得使用location。

```
server {
 ...
 server_name foo.bar.com;
 location /articles {
 }
}
```

如果路由很多，我们就要使用动态的方法。

```
server {
 listen 80;
 server_name example.org www.exanple.org
 root /data/www;
 
 location / {
 	index index.html index.php;
 }
 
 location ~* \.(gif|jpg|png)$ {
 	expires 30d;
 }
 
 location ~ \.php$ {
 	fastcgi_pass 	localhost:90000;
 	fastcgi_param 	SCRIPT_FILENAME
 						$document_root%fastcgi_script_name;
	include 			fastcgi_params;
 }
}
```

这端配置的意思是，当用户访问`http://example.org`时，就回去读取`/data/www/index.html`，如果找不到index.html，就会使用index.php，这个时候又马上转发到最后一个块对php文件的转发规则。同样道理，访问静态资源比如`http://example.org/log.png`就会读取`/data/www/log.png`文件，并且缓存过期时间为30天。
























