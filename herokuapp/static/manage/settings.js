define(
    'ptah-manage-settings', ['ptah', 'jquery', 'herokuapp', 'ptah-form'],

    function(ptah, $, templates, form) {
        "use strict";

        return ptah.View.extend({
            connect: 'ptah-manage-settings',
            templates: templates.managesettings

            , init: function() {
                this.data = {}
            }

            , set_navitem: function(name) {
                $('[data-place="nav"] li', this.__dom__).each(function() {
                    var el = $(this)
                    el.removeClass('active')
                    $('i', el).addClass('icon-white');
                });

                var item = $('li[data-navitem="' + name + '"]', this.__dom__);
                item.addClass('active');
                var i = $('i', item);
                i.removeClass('icon-white');
            }

            , on_connect: function() {
                console.log('===','test')
                this.__dom__.append(this.templates.render('workspace'))
                this.workspace = $('[data-place="workspace"]', this.__dom__)
                this.send('init')
            }

            , action_activate: function(options) {
                this.set_navitem(options.name)
                this.workspace.empty()
                this.workspace.append(
                    this.templates.render(
                        'group', this.data[options.name.substr(9)]))
            }

            , action_modify: function(options) {
                new form.Form(this.connect, 'modify', {'__group__': options.name})
            }

            , msg_list: function(data) {
                this.data = data['settings']
                this.action_activate({name: 'settings-ptah-wscrud'})
            }

            , msg_updated: function(data) {
                var name = data['name']
                this.data[name] = data
                this.action_activate({name: 'settings-'+name})
            }
        })
    }
)
