define(
    'ptah-chat', ['ptah', 'jquery', 'herokuapp', 'bootstrap',
                  'proto-ptah-whoisonline'],

    function(ptah, $, templates) {
        "use strict";

        return ptah.View.extend({
            __name__: 'ptah-chat',
            templates: templates.chat,

            init: function() {
                this.users = {}
                this.protocol = ptah.protocols['ptah-whoisonline']
                this.protocol.subscribe(this, 'on_user_')
            }

            , set_userlist_container: function(container) {
                this.userlist = container
                this.userlist_actions = new ptah.ActionChannel(
                    container, {scope: this})
            }

            , show: function(options) {
                this._super()

                if (options.uid && (this.current_user != options.uid)) {
                    this.current_uid = options.uid
                    this.current_user = this.protocol.users[options.uid]
                    if (!this.users[options.uid])
                        this.users[options.uid] = []
                    this.build_chat()
                }
            }

            , build_chat: function() {
                this.__dom__.empty()
                this.__dom__.append(
                    this.templates.render('user', this.current_user))

                this.messages = $('[data-tag="messages"]', this.__dom__)
                for (var idx=0; idx<this.users[this.current_uid].length; idx++)
                    this.messages.append(this.users[this.current_uid][idx])

                var indicator = $('[data-uid="'+this.current_uid+'"] i',
                                  this.userlist)
                indicator.removeClass('icon-comment')
                indicator.removeClass('icon-user')
                indicator.addClass('icon-user')

                var that = this
                var textarea = $('textarea[name="message"]', this.__dom__);
                textarea.keypress(function(ev) {
                    /* get keycode depending on IE vs. everyone else */
                    var keynum = (window.event) ? event.keyCode : ev.keyCode;

                    /* only interested in SHIFT */
                    if (!ev.shiftKey) {
                        switch(keynum) {
                        case 13:  /* enter key */
                            if ($(this).val())
                                that.send_message($(this))
                            ev.preventDefault();
                            break
                        }
                    }
                })
            }

            , send_message: function(el) {
                var msg = el.val();

                // append message
                var message = this.templates.render(
                    'message', {name: this.protocol.name,
                                message: msg,
                                date: ptah.utc()})

                this.users[this.current_uid].push(message)
                this.messages.append(message)
                this.messages.animate({scrollTop: this.messages.height()})

                this.protocol.send(
                    'message', {uid: this.current_uid, message: msg})
                el.val('')
            }

            , action_select_user: function(options) {
                this.__parent__.set_navitem(options.uid)
                this.__parent__.activate('ptah-chat', options)
            }

            , reload_online_users: function() {
                if (!this.userlist)
                    return

                this.userlist.empty()
                this.userlist.append(
                    this.templates.render(
                        'useritem',
                        {'users': this.protocol.list_users()})
                )
            }

            , on_user_joined: function() {this.reload_online_users()}
            , on_user_disconnected: function() {this.reload_online_users()}

            , on_user_message: function(uid, data) {
                var msg = this.templates.render('message', data)

                if (uid===this.current_uid) {
                    this.users[this.current_uid].push(msg)
                    this.messages.append(msg)
                    this.messages.animate({scrollTop: this.messages.height()})
                }
                var indicator = $('[data-uid="'+uid+'"] i', this.userlist)
                indicator.removeClass('icon-user')
                indicator.removeClass('icon-comment')
                indicator.addClass('icon-comment')

                if (!this.users[uid])
                    this.users[uid] = [msg]
                else
                    this.users.push(msg)
            }

        })
    }
)
