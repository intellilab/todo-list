require('../less/index.less')

new Vue({
    el: 'body',
    data: {
        normal: true
    },
    components: {
        normal: require('../vue/normal.vue'),
        min: require('../vue/min.vue')
    },
    ready() {
        window.innerWidth < 900 || window.innerHeight < 500 ? this.normal = false :
            this.normal = true
        window.onresize = e => {
            window.innerWidth < 900 || window.innerHeight < 500 ? this.normal = false :
                this.normal = true
        }
        document.write(navigator.appVersion)
    }
})