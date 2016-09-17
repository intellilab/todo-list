require('../less/index.less')

new Vue({
    el: 'body',
    data: {
        weeks: [
            'Monday', 'Tuesday',
            'Wednesday', 'Thursday',
            'Friday', 'Saturday', 'Sunday'
        ],
        months: [
            'Jan.', 'Feb.', 'Mar.', 'Apr.',
            'May.', 'Jun.', 'Jul.', 'Aug.',
            'Sep.', 'Oct.', 'Nov.', 'Dec.'
        ],
        current: {
            year: null,
            month: null,
            day: null,
            week: null
        },
        today: {
            year: null,
            month: null,
            day: null,
            week: null
        },
        date: {
            el: document.querySelectorAll('.date .col'),
            weeks: [
                [], [], [],
                [], [], [],
                []
            ]
        }

    },
    methods: {
        init() {
            const today = new Date()
            this.today.year =
                this.current.year = today.getFullYear()
            this.today.month =
                this.current.month = today.getMonth()
            this.today.day =
                this.current.day = today.getDate()
            this.today.week =
                this.current.week = today.getDay()
        },
        isToday(date) {
            return this.today.year == date.getFullYear() &&
                this.today.month == date.getMonth() &&
                this.today.day == date.getDate()
        },
        render() {
            this.clear()
            const date = new Date(this.current.year,
                this.current.month, 1)
            let index = date.getDay() - 1
            let i = 0

            index < 0 ? index = 6 : null
            this.date.weeks[index].push({
                day: date.getDate(),
                flag: false
            })
            // 前向填充
            while (i < index) {
                this.date.weeks[i].push({day: null, flag: false})
                i++
            }
            // 循环填充
            while (true) {
                date.setDate(date.getDate() + 1)
                if (date.getMonth() !== this.current.month) break
                index = date.getDay() - 1
                index < 0 ? index = 6 : null
                this.date.weeks[index].push({
                    day: date.getDate(),
                    flag: this.isToday(date)
                })
            }
            // 后向填充
            while (index < 6) this.date.weeks[++index].push({day: null, flag: false})
        },
        clear() {
            for (let i = 0; i < this.date.weeks.length; i++)
                this.date.weeks.$set(i, [])
        },
        prev() {
            if (this.current.month == 0) {
                this.current.month = 11
                this.current.year--
            } else this.current.month--
            this.render()
        },
        next() {
            if (this.current.month == 11) {
                this.current.month = 0
                this.current.year++
            } else this.current.month++
            this.render()
        },
        refresh() {
            this.current.year = this.today.year
            this.current.month = this.today.month
            this.current.day = this.today.day
            this.render()
        }
    },
    ready() {
        this.init()
        this.render()
        document.querySelector('body').style.display = 'block'
    }
})