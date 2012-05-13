""" whoisonline

init - init connection
list - list active users
disconnected - user has disconnected
typing - user is typing
message - message
"""
import ptah
from datetime import datetime
from ptah.sockjs import protocol, Protocol


@protocol('ptah-whoisonline')
class WhoIsOnline(Protocol):

    def __init__(self, *args, **kw):
        super(WhoIsOnline, self).__init__(*args, **kw)

        principal = ptah.auth_service.get_current_principal()
        self.user_id = principal.__uri__
        self.user_name = principal.name

    def on_closed(self):
        super(WhoIsOnline, self).on_closed()

        found = False
        for user in self.instances.values():
            if user.user_id == self.user_id:
                found = True
                break

        if not found:
            self.broadcast('disconnected', {'uid': self.user_id})

    def msg_load(self, data):
        """ init message handler """
        users = {}
        for user in self.instances.values():
            if user.user_id != self.user_id:
                users[user.user_id] = {'uid': user.user_id,
                                       'name': user.user_name,
                                       'online': True}

        info = {'uid': self.user_id,
                'name': self.user_name,
                'users': users}
        self.send('list', info)

        msg = {'uid': self.user_id,
               'online': True,
               'name': self.user_name}
        self.broadcast('joined', msg)

    def msg_message(self, data):
        """ 'message' message handler """

        msg = {'uid': self.user_id,
               'name': self.user_name,
               'date': datetime.utcnow(),
               'message': data['message']}

        for user in self.instances.values():
            if user.user_id == data['uid']:
                user.send('message', msg)
