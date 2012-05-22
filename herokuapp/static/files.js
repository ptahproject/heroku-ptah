define(
    'ptah-files', ['ptah', 'jquery', 'herokuapp', 'ptah-form'],

    function(ptah, $, templates, form) {
        "use strict";

       return ptah.View.extend({
           __name__: 'ptah.Crud',

           connect: 'ptah-files',
           templates: templates.files

           , init: function() {
               this.__dom__.append(this.templates.render('workspace'))
               this.dialog = false
               this.workspace = $('[data-tag="workspace"]', this.__dom__)

               var dz = $('[data-tag="dropzone"]', this.__dom__)
               dz.on({dragover: this.on_dragover,
                      dragend: this.on_dragend,
                      drop: this.on_drop}, this)
               $('[data-tag="fileinput"]', this.__dom__).bind(
                   'change', this, this.on_change)
           }

           , on_dragover: function(ev) {
               $(this).addClass('alert-success')
               $(this).removeClass('alert-info')
               return false
           }
           , on_dragend: function(ev) {
               console.log(this, ev)
               $(this).addClass('alert-info')
               $(this).removeClass('alert-success')
               return false
           }
           , on_drop: function(ev) {
               var that = ev.data
               $(this).addClass('alert-info')
               $(this).removeClass('alert-success')
               ev.preventDefault()

               ev = ev.originalEvent || ev

               // upload files
               var files = ev.files || ev.dataTransfer.files
               if (files.length)
                   that.upload(files)

               return false
           }

           , on_change: function(ev) {
               ev.preventDefault()

               var files = this.files || ev.dataTransfer.files
               if (files.length)
                   ev.data.upload(files)
               
               return false
           }

           , upload: function(files) {
               // upload files
               var idx = 0
               var that = this

               var process_file = function() {
                   var file = files[idx]
                   var reader = new FileReader()
                   reader.onload = function (ev) {
                       that.send('upload',
                                 {data: reader.result,
                                  filename: file.name,
                                  mimetype: file.type})
                       
                       idx += 1
                       if (idx < files.length) {
                           process_file()
                       } else {
                           that.dialog = false
                       }
                   }
                   reader.readAsBinaryString(file)
               }
               process_file()
           }

           , on_connect: function() {
               this.send('list')
           }

           , msg_list: function(data) {
               for (var i=0; i<data.files.length; i++) {
                   this.workspace.append(
                       this.templates.render('item', data.files[i]))
               }
           }
           
           , msg_added: function(data) {
               this.workspace.append(this.templates.render('item', data))
           }
           
           , msg_removed: function(data) {
               $('[data-item="'+data.id+'"]', this.workspace).remove()
           }
           
           , action_remove: function(options) {
               this.send('remove', {id: options.id})
           }

           , action_upload: function(options) {
               if (this.dialog)
                   return

               this.dialog = true
               var el = $('[data-tag="fileinput"]', this.__dom__)
               el[0].click()
           }

       })
    }
)
