""" files protocol """
import sqlalchemy as sqla
from datetime import datetime
from pyramid.compat import bytes_
from pyramid.decorator import reify
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound

import ptah
from ptah.sockjs import protocol, Protocol


@ptah.type('wscrud-file', 'WSCrud File')
class File(ptah.get_base()):
    __tablename__ = 'wscrud_file'

    id = sqla.Column(sqla.Integer(), primary_key=True)
    filename = sqla.Column(sqla.Unicode(255))
    mimetype = sqla.Column(sqla.String(20))
    created = sqla.Column(sqla.DateTime())
    modified = sqla.Column(sqla.DateTime())
    size = sqla.Column(sqla.Integer())
    data = sqla.orm.deferred(sqla.Column(sqla.LargeBinary))

    def __init__(self, **kw):
        self.created = datetime.utcnow()
        self.modified = datetime.utcnow()

        super(File, self).__init__(**kw)


@protocol('ptah-files')
class FilesProtocol(Protocol):

    def get_info(self, f):
        return {'id': f.id,
                'filename': f.filename,
                'mimetype': f.mimetype,
                'size': f.size,
                'created': f.created}

    def msg_upload(self, data):
        if isinstance(data['data'], unicode):
            data['data'] = data['data'].encode('latin1')

        with ptah.sa_session() as sa:
            file = File(filename=data['filename'], 
                        mimetype=data['mimetype'],
                        size=len(data['data']),
                        data=data['data'])
            sa.add(file)
            sa.flush()
            self.broadcast('added', self.get_info(file))

    def msg_list(self, data):
        with ptah.sa_session() as sa:
            data = []
            for f in sa.query(File).all():
                data.append(self.get_info(f))

            self.send('list', {'files':sorted(data,key=lambda i:i['created'])})

    def msg_remove(self, data):
        with ptah.sa_session() as sa:
            sa.query(File).filter(File.id == data['id']).delete()

        self.broadcast('removed', {'id': data['id']})


@view_config(route_name='download_file')
def download(request):
    id = request.matchdict['id']

    with ptah.sa_session() as sa:
        f = sa.query(File).filter(File.id == id).first()
        if f is None:
            return HTTPNotFound()

        response = request.response

        headers = {'Content-Type': f.mimetype.encode('utf-8')}
        if f.filename:
            headers['Content-Disposition'] = \
                bytes_('filename="{0}"'.format(f.filename), 'utf-8')

        response.headers = headers
        response.body = f.data
        return response

