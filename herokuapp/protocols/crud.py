""" crud protocol """
import ptah
from pyramid.decorator import reify
from ptah.sockjs import protocol, Protocol, handler, Form


@protocol('ptah-crud')
class CrudProtocol(Protocol):

    def msg_list_models(self, data):
        cfg = ptah.get_settings(ptah.CFG_ID_PTAH, self.registry)

        types = []
        for ti in ptah.get_types().values():
            if ti.__uri__ in cfg['disable_models']:
                continue
            types.append((ti.title, ti))

        types = [{'uri': f.__uri__,
                  'name': f.name,
                  'description': f.description}
                 for _t, f in sorted(types)]

        self.send('list_models', {'models': types})

    def msg_list_model(self, data):
        uri = data['uri']
        ti = ptah.resolve(uri)

        fields = [{'name':'id', 'title': 'Id'}]
        for name in ti.fieldset:
            fields.append({'name': name,
                           'title': ti.fieldset[name].title})

        info = {
            'uri': ti.__uri__,
            'name': ti.name,
            'description': ti.description,
            'fields': fields}
        self.send('load_model', info)

        with ptah.sa_session() as sa:
            result = {'size': sa.query(ti.cls).count(),
                      'page': self.page(sa, ti, 0, 5)}
            self.send('page', result)

    def msg_load_page(self, data):
        uri = data['uri']
        ti = ptah.get_types()[uri]

        with ptah.sa_session() as sa:
            self.send('page', {'page': self.page(sa, ti, 0, 5)})

    def page(self, sa, ti, offset, limit):
        cls = ti.cls
        fields = ti.fieldset

        result = []
        for item in sa.query(cls)\
                .order_by(cls.__id__).all(): #offset(offset).limit(limit).all():

            res = [{'v': item.__id__, 'id': True, 'uri': item.__uri__}]
            for name in fields:
                field = fields[name]
                val = getattr(item, name, field.default)
                try:
                    res.append({'v': field.serialize(val)})
                except:
                    res.append({'v': val})

            result.append({'item': res})

        return result


@handler('edit', CrudProtocol)
class EditRecord(Form):

    label = 'Edit'

    @reify
    def fields(self):
        return self.tinfo.fieldset

    def form_content(self):
        id = self.params['uri']

        data = {}
        for field in self.fields.fields():
            data[field.name] = getattr(self.context, field.name, field.default)

        return data

    def __call__(self):
        self.tinfo = ptah.resolve(self.params['turi'])

        with ptah.sa_session() as sa:
            self.session = sa
            self.context = ptah.resolve(self.params['uri'])
            return super(EditRecord, self).__call__()

    @ptah.form.button('Cancel', name='close')
    def on_cancel(self):
        pass

    @ptah.form.button('Modify', name='submit', actype=ptah.form.AC_PRIMARY)
    def modify_handler(self):
        data, errors = self.extract()
        if errors:
            return errors

        for field in self.fields.fields():
            setattr(self.context, field.name, data[field.name])

        self.close("Record has been updated.")
        self.protocol.broadcast('updated', {'uri': self.context.__uri__})


@handler('add', CrudProtocol)
class AddRecord(Form):

    label = 'Add'

    @reify
    def fields(self):
        tinfo = ptah.resolve(self.params['turi'])
        return tinfo.fieldset

    @ptah.form.button('Cancel', name='close')
    def on_cancel(self):
        pass

    @ptah.form.button('Add', name='submit', actype=ptah.form.AC_PRIMARY)
    def modify_handler(self):
        data, errors = self.extract()
        if errors:
            return errors

        with ptah.sa_session() as sa:
            tinfo = ptah.resolve(self.params['turi'])

            instance = tinfo.create(**data)
            sa.add(instance)

            uri = instance.__uri__

        self.close("Record has been created.")
        self.protocol.broadcast('added', {'uri': uri})
