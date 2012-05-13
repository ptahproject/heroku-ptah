define(
    'proto-ptah-whoisonline', ['ptah'],

    function(ptah) {
        "use strict";

        return ptah.Protocol.extend({
            protocol: 'ptah-whoisonline',

            init: function() {
                this.users = {}
            }

            , on_connect: function() {
                this.users = {}
                this.send('load')
            }

            , on_disconnect: function() {
                for (var uid in this.users) {
                    this.msg_disconnected(this.users[uid])
                }
                this.users = {}
            }

            , msg_list: function(data) {
                this.uid = data.uid
                this.name = data.name
                this.users = data.users

                for (var key in data.users) {
                    this.events.publish('added', key, data.users[key])
                }
            }

            , msg_joined: function(data) {
                this.users[data.uid] = data
                this.users[data.uid].online = true

                for (var key in this.users)
                    if (key != this.users[key].uid)
                        delete this.users[key]

                this.events.publish('joined', data.uid, this.users[data.uid])
            }

            , msg_disconnected: function(data) {
                if (this.users[data.uid])
                    delete this.users[data.uid]
                this.events.publish('disconnected', data.uid, data)
            }

            , msg_added: function(data) {
                this.users[data.uid] = data
                this.events.publish('added', data.uid, data)
            }

            , msg_updated: function(data) {
                this.users[data.uid] = data
                this.events.publish('updated', data.uid, data)
            }

            , msg_removed: function(data) {
                for (var idx=0; idx < data.length; idx++) {
                    delete this.users[data[idx]]
                    this.events.publish('removed', data[idx])
                }
            }

            , msg_message: function(data) {
                this.events.publish('message', data.uid, data)
            }

            , is_online: function(uid) {
                if (this.users[uid])
                    return this.users[uid].online
                return false
            }

            , list_users: function() {
                var items = []
                for (var key in this.users) {
                    items.push(this.users[key])
                }

                items.sort(function(a, b) {
                    if (a.name < b.name) return -1
                    else if (a.name > b.name) return 1
                    else return 0
                })
                return items
            }

            , list_online_users: function() {
                var items = []
                for (var key in this.users) {
                    if (this.users[key].online)
                        items.push(this.users[key])
                }

                items.sort(function(a, b) {
                    if (a.name < b.name) return -1
                    else if (a.name > b.name) return 1
                    else return 0
                })
                return items
            }

        })
    }
)
