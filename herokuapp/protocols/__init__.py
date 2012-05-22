# herokuapp was ptah_wscrud

def includeme(config):
    config.ptah_init_sockjs()

    # mustache templates
    config.register_mustache_bundle(
        'herokuapp', 'herokuapp:templates/')

    # amd modules
    config.register_amd_module(
        'ptah-chat', 'herokuapp:static/chat.js')

    config.register_amd_module(
        'todo', 'herokuapp:static/todo.js')

    # amd protocols
    config.register_amd_module(
        'proto-ptah-whoisonline', 'herokuapp:static/whoisonline.js')

    # manage modules
    config.register_amd_module(
        'ptah-manage', 'herokuapp:static/manage.js')
    config.register_amd_module(
        'ptah-manage-users', 'herokuapp:static/manage/users.js')
    config.register_amd_module(
        'ptah-manage-settings', 'herokuapp:static/manage/settings.js')
    config.register_amd_module(
        'ptah-crud', 'herokuapp:static/crud.js')
    config.register_amd_module(
        'ptah-files', 'herokuapp:static/files.js')

    # files
    config.add_route('download_file', pattern='/_files/{id}')
