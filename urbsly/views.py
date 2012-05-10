import logging
import ptah
from pyramid.view import view_config

log = logging.getLogger(__name__)


ptah.layout.register('page', renderer='urbsly:templates/layoutpage.pt', use_global_views=True)

ptah.layout.register('ptah-page', renderer='urbsly:templates/layoutpage.pt', use_global_views=True)


@ptah.layout('workspace', 
             parent="page", renderer="urbsly:templates/layoutworkspace.pt",
             use_global_views=True)

class LayoutWorkspace(ptah.View):

    def update(self):
        self.root = getattr(self.request, 'root', None)
        self.user = ptah.auth_service.get_current_principal()
        self.isAnon = self.user is None
        self.ptahManager = ptah.manage.check_access(
            ptah.auth_service.get_userid(), self.request)


@ptah.layout('', parent="workspace",
             renderer="urbsly:templates/layouttemplate.pt")
class ContentLayout(ptah.View):
    def update(self):
        self.actions = ptah.list_uiactions(self.context, self.request)

@view_config(renderer='urbsly:templates/homepage.pt',
             route_name='home')
class HomepageView(object):

    def __init__(self, request):
        self.request = request
        ptah.include(request, 'bootstrap')
        ptah.include(request, 'bootstrap-js')

    def __call__(self):
        request = self.request
        self.rendered_includes = ptah.render_includes(request)
        self.rendered_messages = ptah.render_messages(request)
        return {}

@view_config('',
             wrapper=ptah.wrap_layout(),
             renderer='urbsly:templates/wstest.pt')

def wstest_view(request):
    ptah.include(request, 'wscrud-styles')
    ptah.include(request, 'jquery')
    ptah.include(request, 'jquery-ui')
    ptah.include(request, 'ckeditor')
    return {}
