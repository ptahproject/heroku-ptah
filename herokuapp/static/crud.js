define(
    'ptah-crud', ['ptah', 'jquery', 'ptah-wscrud', 'ptah-form', 'ckeditor'],

    function(ptah, $, templates, form) {
        "use strict";

       return ptah.View.extend({
            __name__: 'ptah.Crud',

            connect: 'ptah-crud',
            templates: templates.crud

            , init: function() {
                this.__dom__.empty()
            }

            , on_connect: function() {
                this.__dom__.empty()
                this.send('list_models')
            }

            , show: function() {
                this._super()
                if (this.model) {
                    this.model.hide()
                    this.models.show()
                }
            }

            , msg_list_models: function(data) {
                this.__dom__.append(this.templates.render('workspace', data))
                this.models = $('[data-tag="models"]', this.__dom__)
                this.model = $('[data-tag="model"]', this.__dom__)
            }

            , msg_load_model: function(data) {
                this.models.hide()
                this.model.show()

                var title = $('[data-tag="modelname"]', this.model)
                title.empty()
                title.append(data.name)

                var headers = $('[data-tag="modelheaders"]', this.model)
                headers.empty()
                headers.append(this.templates.render('headers', data))

                this.current_uri = data.uri
                this.current_fields = data.fields
            }

            , msg_page: function(data) {
                var table = $('[data-tag="modeldata"]', this.model)
                table.empty()
                table.append(this.templates.render('record', data))
            }

            , msg_added: function(data) {
                this.send('load_page', {uri: this.current_model})
            }

            , msg_updated: function(options) {
                this.send('load_page', {uri: this.current_model})
            }

            , msg_list_data: function(data) {
                this.models.hide()
                this.model.hide()
                this.model = $('[data-place="model"]', this.__dom__)
                this.model.show()
            }

            , action_add: function(options) {
                new form.Form(this.connect, 'add', {turi: this.current_uri})
            }

            , action_edit: function(options) {
                new form.Form(this.connect, 'edit',
                             {turi: this.current_uri, uri: options.uri})
            }

            , action_model: function(options) {
                this.current_model = options.uri
                this.send('list_model', {uri: options.uri})
            }

            , action_list_models: function(options) {
                this.model.hide()
                this.models.show()
            }

        })
    }
)
