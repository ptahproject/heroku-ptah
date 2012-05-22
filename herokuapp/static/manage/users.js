define(
    'ptah-manage-users',
    ['ptah', 'jquery',
     'ptah-pager', 'herokuapp', 'ptah-form',
     'proto-ptah-whoisonline'],

    function(ptah, $, pager, templates, form) {
        "use strict";

        return ptah.View.extend({
            connect: 'ptah-manage-users',
            templates: templates.manageusers

            , init: function() {
                this.users = {}

                this.wio = ptah.protocols['ptah-whoisonline']
                this.wio.events.subscribe(
                    'joined', this, this.on_user_joined)
                this.wio.events.subscribe(
                    'disconnected', this, this.on_user_disconnected)
            },

            get_selected_users: function() {
                var users = []
                var params = this.form.serializeArray()

                for (var k in params) {
                    if (params[k].name==='uid')
                        users[users.length] = params[k].value
                }
                return users
            },

            on_connect: function() {
                this.send('init');
            },

            on_user_joined: function(uid, data) {
                var td = $('[data-item="'+uid+'"] td[data-column="online"]',
                           this.__dom__)

                td.empty()
                td.append('<i class="icon-online"/> Online')
            },

            on_user_disconnected: function(uid, data) {
                var td = $('[data-item="'+uid+'"] td[data-column="online"]',
                           this.__dom__)

                td.empty()
                td.append('<i class="icon-offline"/> Offline')
            },

            action_activate_user: function(options) {
                this.send('activate-users', [options.uri])
            },

            action_suspend_user: function(options) {
                this.send('suspend-users', [options.uri])
            },

            action_validate_user: function(options) {
                this.send('validate-users', [options.uri])
            },

            action_remove: function() {
                var users = this.get_selected_users()
                if (users.length===0)
                    return

                var that = this
                var win = form.Window.extend({
                    template: this.templates.get('remove'),
                    action_confirm: function() {
                         that.send('remove-users', users)
                         this.destroy()
                     }}
                )
                new win(this)
            },

            action_create: function() {
                new form.Form(this.connect, 'add')
            },

            action_modify: function(options) {
                new form.Form(this.connect, 'modify', {'__uri__': options['user']})
            },

            msg_list: function(data) {
                for (var i=0; i<data.users.length; i++) {
                    data.users[i].online = this.wio.is_online(data.users[i].uri)
                }
                this.__dom__.append(this.templates.render('workspace', data))
                ptah.scan_and_create(this.__dom__)
                this.form = $('[data-form="users-listing"]', this.__dom__)
            },

            msg_removed: function(data) {
                for (var i=0; i < data.length; i++) {
                    $('[data-item="'+data[i]+'"]', this.__dom__).remove()
                }
            },

            msg_added: function(data) {
                var content = $('[data-place="users-listing"]', this.__dom__)
                content.append(this.templates.render('row', data))
            },

            msg_updated: function(data) {
                var content=$('[data-place="users-listing"]', this.__dom__)
                $('[data-item="'+data.uri+'"]', content).replaceWith(
                    this.templates.render('row', data))
            }
        })
    }
)
