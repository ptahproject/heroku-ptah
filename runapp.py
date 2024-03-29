import os

from paste.deploy import loadapp
from gevent.wsgi import WSGIServer
#from waitress import serve

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app = loadapp('config:settings.ini', relative_to='.')
    WSGIServer(('0.0.0.0', int(os.environ.get("PORT", 5000))), app).serve_forever()
    #serve(app, host='0.0.0.0', port=port)
