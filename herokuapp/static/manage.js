define(
    'ptah-manage', ['ptah', 'jquery',
                    'ptah-chat',
                    'herokuapp',
                    'proto-ptah-whoisonline'],

    function(ptah, $, Chat, templates) {
        "use strict";

        return ptah.ViewContainer.extend({
            __name__: 'ptah.Manage',
            
            connect: 'ptah-manage',
            templates: templates.manage

            , init: function() {
                ptah.connect()
                
                this.chat = null
                this.active = null
                this.connected = false
            }

            , on_connect: function() {
                this.__dom__.empty()
                this.__dom__.append(this.templates.render('workspace'))
                this.__workspace__ = $('[data-place="workspace"]', this.__dom__)

                // whoisonline
                this.__workspace__.append(
                    '<div data-container="ptah-chat"></div>')

                this.chat = new Chat(this, 
                         $('[data-container="ptah-chat"]', this.__workspace__))
                this.chat.__view_name__ = 'ptah-chat'
                this.chat.set_userlist_container(
                    $('[data-tag="userlist"]', this.__dom__))

                $('.menu-items a[data-menuitem]').click(
                    this, function(ev) {
                        var name = $(this).attr('data-menuitem')
                        if (name) {
                            try {
                                if (ev.data.connected)
                                    ev.data.activate(name)
                            } catch(e) {
                                console.log(e)
                            }
                            ev.preventDefault()
                        }
                    }
                )

                this.connected = true

                if (this.view_name)
                    this.action_activate({name:this.view_name})
                else
                    this.action_activate({name:'ptah-crud'})
            }

            , on_disconnect: function() {
                this.reset()
                this.connected = false
            }

            , action_activate: function(options) {
                this.set_navitem(options.name)
                this.activate(options.name)
            }

            , set_navitem: function(name) {
                $('[data-place="nav"] li', this.__dom__).each(function() {
                    var el = $(this)
                    el.removeClass('active')
                    $('i', el).addClass('icon-white')
                    $('i', el).removeClass('icon-white-invert')
                })

                var item=$('li[data-navitem="manage-'+name+'"]',this.__dom__)
                item.addClass('active')
                var i = $('i', item)
                i.removeClass('icon-white')
                i.addClass('icon-white-invert')
            }
        })
})
