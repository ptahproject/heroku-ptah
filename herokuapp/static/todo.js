define(
    'todo', ['ptah', 'jquery', 'ptah-wscrud'],

    function(ptah, $, templates) {
        "use strict";

        var Todo = ptah.View.extend({
            connect: 'todo',
            templates: templates.todo

            , init: function() {
                // load workspace html
                this.__dom__.append(
                    this.templates.render('workspace'))
                this.workspace = $('[data-tag="workspace"]', this.__dom__)

                // key press handler
                var that = this
                var input = $('input[name="todo"]', this.__dom__)
                input.keypress(function(ev) {
                    var keynum = (window.event) ? event.keyCode : ev.keyCode;
                    switch(keynum) {
                    case 13:
                        var el = $(this)
                        if (el.val()) {
                            that.send('create', {'text': el.val()})
                            el.val('')
                        }
                    }
                })

                // ask for items
                this.send('load')
            }

            , msg_list: function(data) {
                for (var i=0; i<data.tasks.length; i++) {
                    this.workspace.append(
                        this.templates.render('item', data.tasks[i]))
                }
            }

            , msg_added: function(data) {
                this.workspace.append(this.templates.render('item', data))
            }

            , msg_removed: function(data) {
                $('[data-item="'+data.id+'"]', this.workspace).remove()
            }

            , msg_completed: function(data) {
                $('[data-item="'+data.id+'"]', this.workspace).replaceWith(
                    this.templates.render('item', data))
            }

            , action_complete: function(options) {
                this.send('complete', {id: options.id})
            }

            , action_remove: function(options) {
                this.send('remove', {id: options.id})
            }


        })

        return Todo
    }
)
