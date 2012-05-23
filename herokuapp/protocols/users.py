""" users management protocol """
import transaction
from pyramid.compat import NativeIO

import ptah
from ptah.sockjs import protocol, handler, Form, Protocol

import ptahcrowd
from ptahcrowd.user import ModifyUserForm, get_roles_vocabulary


@protocol('ptah-manage-users')
class UsersProtocol(Protocol):

    def __init__(self, *args, **kw):
        super(UsersProtocol, self).__init__(*args, **kw)

        principal = ptah.auth_service.get_current_principal()
        if principal:
            self.user_id = principal.__uri__
            self.user_name = principal.name
        else:
            self.user_id = None
            self.user_name = 'Anonymous'
 
    def get_user_data(self, user):
        roles = get_roles_vocabulary(None)

        item = {'uri': user.__uri__,
                'name': user.name,
                'suspended': user.suspended,
                'validated': user.validated,
                'joined': user.joined,
                'login': user.login,
                'roles': ','.join(
                    roles.get_term(item).title
                    for item in user.properties.get('roles',()) if item in roles)
                }

        return item

    def msg_init(self, data):
        with ptah.sa_session() as sa:
            users = [(user.name, self.get_user_data(user))
                     for user in sa.query(ptahcrowd.CrowdUser).all()]

        self.send('list', {'users': [u for _n,u in sorted(users)]})

    @handler('remove-users')
    def msg_remove_users(self, data):
        users = [uri for uri in data if uri != self.user_id]
        if not users:
            return

        # remove users
        with ptah.sa_session() as sa:
            for uri in users:
                user = sa.query(ptahcrowd.CrowdUser) \
                    .filter(ptahcrowd.CrowdUser.__uri__ == uri).first()
                if user is not None:
                    sa.delete(user)

        # notify client
        self.broadcast('removed', data)

    @handler('validate-users')
    def msg_validate_users(self, data):
        users = [uri for uri in data if uri != self.user_id]
        if not users:
            return

        # suspend users
        with ptah.sa_session() as sa:
            for user in sa.query(ptahcrowd.CrowdUser)\
                    .filter(ptahcrowd.CrowdUser.__uri__.in_(users)):
                user.validated = True
                sa.add(user)
                self.broadcast('updated', self.get_user_data(user))

        self.send(
            'message',
            {'message': "Selected accounts have been validated."})

    @handler('suspend-users')
    def msg_suspend_users(self, data):
        users = [uri for uri in data if uri != self.user_id]
        if not users:
            return

        # suspend users
        with ptah.sa_session() as sa:
            for user in sa.query(ptahcrowd.CrowdUser)\
                    .filter(ptahcrowd.CrowdUser.__uri__.in_(users)):
                user.suspended = True
                sa.add(user)
                self.broadcast('updated', self.get_user_data(user))

        self.send(
            'message',
            {'message': "Selected accounts have been suspended."})

    @handler('activate-users')
    def msg_activate_users(self, data):
        users = [uri for uri in data if uri != self.user_id]
        if not users:
            return

        # activate users
        with ptah.sa_session() as sa:
            for user in sa.query(ptahcrowd.CrowdUser)\
                    .filter(ptahcrowd.CrowdUser.__uri__.in_(users)):
                user.suspended = False
                sa.add(user)
                self.broadcast('updated', self.get_user_data(user))

        self.send(
            'message',
            {'message': "Selected accounts have been activated."})


@handler('add', UsersProtocol)
class UserAddForm(Form):

    label = 'Add user'

    fields = (ptahcrowd.UserSchema +
              ptah.form.Fieldset(
                  ptah.form.MultiChoiceField(
                      'roles',
                      title = 'Roles',
                      description = 'Choose user default roles.',
                      missing = (),
                      required = False,
                      voc_factory = get_roles_vocabulary),
                  ))

    @ptah.form.button('Cancel', name='close')
    def on_cancel(self):
        pass

    @ptah.form.button('Create', name='submit', actype=ptah.form.AC_PRIMARY)
    def on_submit(self):
        data, errors = self.extract()
        if errors:
            return errors

        with ptah.sa_session() as sa:
            # create user
            user = ptahcrowd.CrowdUser.__type__.create(
                name=data['name'],
                login=data['login'],
                email=data['login'],
                suspended = data['suspended'],
                validated = True,
                password=ptah.pwd_tool.encode(data['password']))
            user = ptahcrowd.CrowdUser.__type__.add(user)

            # additional props
            props = user.properties
            props['roles'] = data['roles']
            self.request.registry.notify(ptah.events.PrincipalAddedEvent(user))

            # done
            self.close("User has been created.")
            self.protocol.broadcast('added', self.protocol.get_user_data(user))


@handler('modify', UsersProtocol)
class ModifyUserForm(Form, ModifyUserForm):
    """ edit user form """

    label = 'Modify user'
    csrf = False

    def update(self):
        # load user
        with ptah.sa_session() as sa:
            uri = self.params['__uri__']
            user = ptah.resolve(uri)
            if user is None:
                raise ValueError("User unknown")

            sa.expunge(user)
            self.context = user

        super(ModifyUserForm, self).update()

    @ptah.form.button('Cancel', name='close')
    def on_cancel(self):
        pass

    @ptah.form.button('Modify', name='submit', actype=ptah.form.AC_PRIMARY)
    def modify_handler(self):
        data, errors = self.extract()
        if errors:
            return errors

        with ptah.sa_session() as sa:
            user = ptah.resolve(self.params['__uri__'])

            # update attrs
            user.name = data['name']
            user.login = data['login']
            user.email = data['login']
            if data['password'] is not ptah.form.null:
                user.password = ptah.pwd_tool.encode(data['password'])

            # update props
            user.validated = data['validated']
            user.suspended = data['suspended']

            # add roles and groups info
            props = user.properties
            props['roles'] = data['roles']
            props['groups'] = data['groups']

            info = self.protocol.get_user_data(user)

        # done
        self.close('User properties has been updated.')
        self.protocol.broadcast('updated', info)
