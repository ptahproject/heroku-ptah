import logging
from pyramid.httpexceptions import HTTPFound
import ptah
from pyramid.view import view_config

log = logging.getLogger(__name__)


ptah.layout.register('page', renderer='herokuapp:ptemplates/layoutpage.pt', use_global_views=True)

ptah.layout.register('ptah-page', renderer='herokuapp:ptemplates/layoutpage.pt', use_global_views=True)


@ptah.layout('workspace', 
             parent="page", renderer="herokuapp:ptemplates/layoutworkspace.pt",
             use_global_views=True)

class LayoutWorkspace(ptah.View):

    def update(self):
        self.root = getattr(self.request, 'root', None)
        self.user = ptah.auth_service.get_current_principal()
        self.isAnon = self.user is None
        self.ptahManager = ptah.manage.check_access(
            ptah.auth_service.get_userid(), self.request)


@ptah.layout('', parent="workspace",
             renderer="herokuapp:ptemplates/layouttemplate.pt")
class ContentLayout(ptah.View):
    def update(self):
        self.actions = ptah.list_uiactions(self.context, self.request)

@view_config(renderer='herokuapp:ptemplates/homepage.pt',
             route_name='home')
class HomepageView(object):

    def __init__(self, request):
        self.request = request
        ptah.include(request, 'bootstrap')
        ptah.include(request, 'bootstrap-js')

    def __call__(self):
        raise HTTPFound(location='/wstest.html')


@view_config('wstest.html',
             wrapper=ptah.wrap_layout(),
             renderer='herokuapp:ptemplates/wstest.pt')

def wstest_view(request):
    ptah.include(request, 'herokuapp-styles')
    return {}
