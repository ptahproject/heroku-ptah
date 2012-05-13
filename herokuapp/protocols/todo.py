import ptah
import sqlalchemy as sqla
from datetime import datetime
from ptah.sockjs import protocol, Protocol


class Todo(ptah.get_base()):

    __tablename__ = 'wscrud_todo'

    id = sqla.Column(sqla.Integer(), primary_key=True)
    completed = sqla.Column(sqla.Boolean(), default=False)
    text = sqla.Column(sqla.UnicodeText(), default=u'')
    date = sqla.Column(sqla.DateTime())
    created = sqla.Column(sqla.DateTime())
    creator = sqla.Column(sqla.String(128))

    def __init__(self, **kwargs):
        self.created = datetime.utcnow()
        super(Todo, self).__init__(**kwargs)


@protocol('todo')
class TodoProtocol(Protocol):

    def __init__(self, *args, **kwargs):
        super(TodoProtocol, self).__init__(*args, **kwargs)

        principal = ptah.auth_service.get_current_principal()
        if principal is not None:
            self.user_name = principal.name
        else:
            self.user_name = 'Anonymous'

    def get_info(self, todo):
        return {'id': todo.id,
                'completed': todo.completed,
                'text': todo.text,
                'date': todo.date,
                'created': todo.created,
                'creator': todo.creator}


    def msg_load(self, data):
        with ptah.sa_session() as sa:
            data = []
            for todo in sa.query(Todo).all():
                data.append(self.get_info(todo))

            self.send('list', {'tasks':sorted(data,key=lambda i:i['created'])})

    def msg_create(self, data):
        with ptah.sa_session() as sa:
            todo = Todo(text=data['text'],
                        creator=self.user_name)
            sa.add(todo)
            sa.flush()

            self.broadcast('added', self.get_info(todo))

    def msg_remove(self, data):
        with ptah.sa_session() as sa:
            sa.query(Todo).filter(Todo.id == data['id']).delete()

        self.broadcast('removed', {'id': data['id']})

    def msg_complete(self, data):
        with ptah.sa_session() as sa:
            todo = sa.query(Todo).filter(Todo.id==data['id']).first()

            if todo is not None:
                todo.completed = not todo.completed

                self.broadcast('completed', self.get_info(todo))
