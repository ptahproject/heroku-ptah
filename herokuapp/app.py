import os
import logging

import ptah
from pyramid.config import Configurator
from pyramid.asset import abspath_from_asset_spec
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.session import UnencryptedCookieSessionFactoryConfig

auth_policy = AuthTktAuthenticationPolicy('secret')
session_factory = UnencryptedCookieSessionFactoryConfig('secret')

logger = logging.getLogger('herokuapp')

def main(global_config, **settings):
    """ Function which returns a configured Pyramid/Ptah WSIG Application """

    # Info: This is how Pyramid is configured.

    durl = os.environ.get("DATABASE_URL") #heroku

    if not durl: #dotcloud
       print os.environ 
       logger.info(str(os.environ))
       durl = os.environ.get("DOTCLOUD_DB_POSTGRESQL_URL")

    if durl:
        settings['sqlalchemy.url']=durl
    else:
        logger.info('Did not find DATABASE_URL! You must issue, '
                    '$ heroku addons:add shared-database')

    config = Configurator(settings=settings,
                          session_factory = session_factory,
                          authentication_policy = auth_policy)

    # Info: This includes packages which have Pyramid configuration
    config.include('ptah')

    # Refer: Ptah: _Initialization_
    config.ptah_init_settings()

    # Refer: Ptah: _Initialization_
    config.ptah_init_sql()

    # enable ptah management
    config.ptah_init_manage(managers=('admin',))

    # populate database
    config.ptah_populate()

    # Refer: Pyramid's _URL Dispatch_
    config.add_route('home', '/')
    config.add_route('home2', '/home2')

    # static assets
    config.add_static_view('_herokuapp', 'herokuapp:static')

    # js protocols
    config.include('herokuapp.protocols')

    # add role
    Admin = ptah.Role('admin', 'Admin')
    Manager = ptah.Role('manager', 'Manager')

    # Refer: Pyramid's _Configuration Decorations and Code Scanning_
    config.scan()

    return config.make_wsgi_app()


import ptah
ptah.library(
    'herokuapp-styles',
    path='herokuapp:static/styles.css',
    type="css",
    require=('bootstrap',))
 
