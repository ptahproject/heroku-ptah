import os
from paste.deploy import loadapp
from gevent.wsgi import WSGIServer

if __name__ == "__main__":
    port = int(os.environ["PORT_WWW"])
    app = loadapp('config:dotcloud_settings.ini', relative_to='.')
    WSGIServer(('0.0.0.0', port)), app).serve_forever()

