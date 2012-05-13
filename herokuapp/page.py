""" Page """
import sqlalchemy as sqla
from pyramid.view import view_config

import ptah
import ptahcms

class Page(ptahcms.Content):
    """
    A Page model which subclasses ptahcms.Content
    """

    __tablename__ = 'ptah_minicms_pages'

    __type__ = ptahcms.Type(
        'page',
        title = 'Page',
        description = 'A page in the site.',
        name_suffix = '.html',
        )

    text = sqla.Column(sqla.Unicode,
                       info = {'field_type': 'tinymce'})

